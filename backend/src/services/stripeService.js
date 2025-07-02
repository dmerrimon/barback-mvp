const Stripe = require('stripe');

// Initialize Stripe with secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
  /**
   * Create a payment intent for a customer session
   */
  async createPaymentIntent(sessionData) {
    try {
      const { amount, currency = 'usd', customerId, metadata = {} } = sessionData;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        customer: customerId,
        metadata: {
          sessionId: metadata.sessionId,
          venueId: metadata.venueId,
          tableNumber: metadata.tableNumber,
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  /**
   * Create or retrieve a Stripe customer
   */
  async createCustomer(customerData) {
    try {
      const { email, name, phone } = customerData;

      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
      }

      // Create new customer
      const customer = await stripe.customers.create({
        email: email,
        name: name,
        phone: phone,
        metadata: {
          source: 'barback_app'
        }
      });

      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error(`Customer creation failed: ${error.message}`);
    }
  }

  /**
   * Process tip addition to existing payment
   */
  async addTipToPayment(paymentIntentId, tipAmount) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Cannot add tip to unpaid session');
      }

      // Create a separate payment intent for the tip
      const tipPaymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(tipAmount * 100),
        currency: paymentIntent.currency,
        customer: paymentIntent.customer,
        metadata: {
          originalPaymentId: paymentIntentId,
          type: 'tip',
          ...paymentIntent.metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: tipPaymentIntent.client_secret,
        paymentIntentId: tipPaymentIntent.id,
        amount: tipPaymentIntent.amount / 100,
        status: tipPaymentIntent.status
      };
    } catch (error) {
      console.error('Error adding tip:', error);
      throw new Error(`Tip processing failed: ${error.message}`);
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
        reason: reason
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }

      const refund = await stripe.refunds.create(refundData);

      return {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        reason: refund.reason
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error(`Refund failed: ${error.message}`);
    }
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        customer: paymentIntent.customer,
        metadata: paymentIntent.metadata,
        created: new Date(paymentIntent.created * 1000),
        paymentMethod: paymentIntent.payment_method
      };
    } catch (error) {
      console.error('Error retrieving payment details:', error);
      throw new Error(`Payment retrieval failed: ${error.message}`);
    }
  }

  /**
   * Create a setup intent for saving payment methods
   */
  async createSetupIntent(customerId) {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      });

      return {
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id
      };
    } catch (error) {
      console.error('Error creating setup intent:', error);
      throw new Error(`Setup intent creation failed: ${error.message}`);
    }
  }

  /**
   * List customer payment methods
   */
  async getCustomerPaymentMethods(customerId) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data.map(pm => ({
        id: pm.id,
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
        fingerprint: pm.card.fingerprint
      }));
    } catch (error) {
      console.error('Error retrieving payment methods:', error);
      throw new Error(`Payment methods retrieval failed: ${error.message}`);
    }
  }

  /**
   * Calculate total with tax and tip
   */
  calculateTotal(subtotal, tipPercentage = 0, taxRate = 0.08) {
    const tax = subtotal * taxRate;
    const tip = subtotal * (tipPercentage / 100);
    const total = subtotal + tax + tip;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      tip: Math.round(tip * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload, signature, endpointSecret) {
    try {
      return stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw new Error('Invalid webhook signature');
    }
  }
}

module.exports = new StripeService();