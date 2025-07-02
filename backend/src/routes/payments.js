const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripeService = require('../services/stripeService');
const receiptService = require('../services/receiptService');
const { Payment, Session } = require('../models');
const { validatePayment } = require('../middleware/validation');
const logger = require('../utils/logger');

// Create payment intent (NEW: Live Stripe Integration)
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { sessionId, amount, customerId, metadata = {} } = req.body;

    // Use Stripe service for payment intent creation
    const result = await stripeService.createPaymentIntent({
      amount,
      customerId,
      metadata: { sessionId, ...metadata }
    });

    res.json({
      success: true,
      paymentIntent: result
    });

  } catch (error) {
    logger.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment intent'
    });
  }
});

// Create or get customer
router.post('/create-customer', async (req, res) => {
  try {
    const customerData = req.body;
    const customer = await stripeService.createCustomer(customerData);

    res.json({
      success: true,
      customer
    });

  } catch (error) {
    logger.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create customer'
    });
  }
});

// Calculate total with tax and tip
router.post('/calculate-total', async (req, res) => {
  try {
    const { subtotal, tipPercentage = 0, taxRate = 0.08 } = req.body;
    
    const tax = subtotal * taxRate;
    const tipAmount = subtotal * (tipPercentage / 100);
    const total = subtotal + tax + tipAmount;

    res.json({
      success: true,
      totals: {
        subtotal,
        tax,
        tipAmount,
        total
      }
    });

  } catch (error) {
    logger.error('Error calculating total:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate total'
    });
  }
});

// Legacy payment intent endpoint
router.post('/create-intent', async (req, res) => {
  try {
    const { sessionId, paymentMethodId, amount, billingDetails } = req.body;

    // Validate session exists
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Create Stripe customer if needed
    let customer;
    try {
      customer = await stripe.customers.create({
        email: billingDetails.email,
        name: billingDetails.name,
        phone: billingDetails.phone,
        metadata: {
          sessionId,
          venueId: session.venueId
        }
      });
    } catch (stripeError) {
      logger.error('Failed to create Stripe customer:', stripeError);
      return res.status(400).json({
        success: false,
        error: 'Failed to create customer profile'
      });
    }

    // Attach payment method to customer
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });
    } catch (stripeError) {
      logger.error('Failed to attach payment method:', stripeError);
      return res.status(400).json({
        success: false,
        error: 'Invalid payment method'
      });
    }

    // Create payment intent with setup for future payments
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      customer: customer.id,
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      setup_future_usage: 'off_session', // Save for future use
      metadata: {
        sessionId,
        venueId: session.venueId,
        tableNumber: session.tableNumber || ''
      }
    });

    // Save payment record
    const payment = await Payment.create({
      sessionId,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: customer.id,
      amount: amount / 100, // Convert back to dollars
      totalAmount: amount / 100,
      status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'pending',
      paymentMethod: paymentMethodId,
      metadata: {
        billingDetails,
        stripeFees: paymentIntent.charges?.data[0]?.balance_transaction?.fee || 0
      }
    });

    // Update session with payment info
    await session.update({
      stripePaymentIntentId: paymentIntent.id,
      status: 'active' // Activate session once payment method is added
    });

    // Emit real-time update
    req.io.to(`session-${sessionId}`).emit('payment-added', {
      sessionId,
      paymentId: payment.id,
      status: payment.status
    });

    req.io.to(`bartender-${session.venueId}`).emit('session-update', {
      sessionId,
      status: 'active',
      hasPayment: true
    });

    logger.info(`Payment intent created for session ${sessionId}: ${paymentIntent.id}`);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status
      },
      payment: {
        id: payment.id,
        status: payment.status
      }
    });

  } catch (error) {
    logger.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent'
    });
  }
});

// Process tab payment (when leaving venue)
router.post('/process-tab', async (req, res) => {
  try {
    const { sessionId, tipAmount = 0 } = req.body;

    const session = await Session.findByPk(sessionId, {
      include: ['tabItems', 'payments']
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Calculate total amount
    const subtotal = parseFloat(session.subtotal) || 0;
    const tip = parseFloat(tipAmount) || 0;
    const total = subtotal + tip;

    if (total <= 0) {
      return res.status(400).json({
        success: false,
        error: 'No charges to process'
      });
    }

    // Get the saved payment method
    const existingPayment = session.payments[0];
    if (!existingPayment) {
      return res.status(400).json({
        success: false,
        error: 'No payment method on file'
      });
    }

    // Create new payment intent for the actual charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      customer: existingPayment.stripeCustomerId,
      payment_method: existingPayment.paymentMethod,
      confirmation_method: 'automatic',
      confirm: true,
      off_session: true, // Use saved payment method
      metadata: {
        sessionId,
        venueId: session.venueId,
        subtotal: subtotal.toString(),
        tipAmount: tip.toString(),
        type: 'tab_payment'
      }
    });

    // Create payment record
    const tabPayment = await Payment.create({
      sessionId,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: existingPayment.stripeCustomerId,
      amount: subtotal,
      tipAmount: tip,
      totalAmount: total,
      status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'failed',
      paymentMethod: existingPayment.paymentMethod,
      metadata: {
        type: 'tab_payment',
        itemCount: session.tabItems.length
      }
    });

    // Update session
    await session.update({
      tipAmount: tip,
      total: total,
      status: paymentIntent.status === 'succeeded' ? 'closed' : 'active',
      exitTime: new Date()
    });

    // Emit real-time updates
    req.io.to(`session-${sessionId}`).emit('payment-processed', {
      sessionId,
      amount: total,
      status: tabPayment.status
    });

    req.io.to(`bartender-${session.venueId}`).emit('session-closed', {
      sessionId,
      total,
      tipAmount: tip
    });

    logger.info(`Tab payment processed for session ${sessionId}: $${total}`);

    res.json({
      success: true,
      payment: {
        id: tabPayment.id,
        amount: total,
        tipAmount: tip,
        status: tabPayment.status
      },
      session: {
        id: session.id,
        status: session.status,
        total: session.total
      }
    });

  } catch (error) {
    logger.error('Error processing tab payment:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        success: false,
        error: error.message,
        type: 'card_error'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process payment'
    });
  }
});

// Get payment details
router.get('/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findByPk(paymentId, {
      include: ['session']
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    logger.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment'
    });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'charge.dispute.created':
        await handleChargeDispute(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Helper functions for webhook handlers
async function handlePaymentSucceeded(paymentIntent) {
  const payment = await Payment.findOne({
    where: { stripePaymentIntentId: paymentIntent.id }
  });

  if (payment) {
    await payment.update({ status: 'succeeded' });
    logger.info(`Payment succeeded: ${payment.id}`);
  }
}

async function handlePaymentFailed(paymentIntent) {
  const payment = await Payment.findOne({
    where: { stripePaymentIntentId: paymentIntent.id }
  });

  if (payment) {
    await payment.update({ 
      status: 'failed',
      failureReason: paymentIntent.last_payment_error?.message || 'Unknown error'
    });
    logger.error(`Payment failed: ${payment.id}`);
  }
}

async function handleChargeDispute(charge) {
  logger.warn(`Dispute created for charge: ${charge.id}`);
  // TODO: Implement dispute handling logic
}

// Generate receipt for payment
router.get('/receipt/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { email } = req.query;

    const receipt = await receiptService.processReceipt(paymentId, email);

    res.json({
      success: true,
      receipt: {
        id: receipt.receiptData.id,
        url: receipt.receiptURL,
        emailSent: receipt.emailSent || false
      }
    });

  } catch (error) {
    logger.error('Error generating receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate receipt'
    });
  }
});

// Get receipt HTML for display
router.get('/receipt/:paymentId/view', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const receipt = await receiptService.processReceipt(paymentId);

    res.setHeader('Content-Type', 'text/html');
    res.send(receipt.htmlContent);

  } catch (error) {
    logger.error('Error viewing receipt:', error);
    res.status(500).send('<h1>Error loading receipt</h1>');
  }
});

// Add tip to existing payment
router.post('/add-tip', async (req, res) => {
  try {
    const { paymentIntentId, tipAmount } = req.body;
    
    const result = await stripeService.addTip(paymentIntentId, tipAmount);

    res.json({
      success: true,
      tipPayment: result
    });

  } catch (error) {
    logger.error('Error adding tip:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add tip'
    });
  }
});

// Get payment details
router.get('/payment/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const payment = await stripeService.getPaymentDetails(paymentIntentId);

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    logger.error('Error getting payment details:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get payment details'
    });
  }
});

module.exports = router;