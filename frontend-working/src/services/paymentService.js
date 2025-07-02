// Payment service for Stripe integration
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://barback-backend.onrender.com';

class PaymentService {
  constructor() {
    this.stripe = null;
    this.elements = null;
    this.initializeStripe();
  }

  async initializeStripe() {
    try {
      if (window.Stripe && STRIPE_PUBLISHABLE_KEY) {
        this.stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
        console.log('Stripe initialized successfully');
      } else {
        console.warn('Stripe not available or missing publishable key');
      }
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }

  // Create payment intent for session
  async createPaymentIntent(sessionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionData.sessionId,
          amount: sessionData.amount,
          customerId: sessionData.customerId,
          metadata: {
            venueId: sessionData.venueId,
            tableNumber: sessionData.tableNumber
          }
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment intent');
      }

      return data.paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Create or get customer
  async createCustomer(customerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/create-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create customer');
      }

      return data.customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Calculate totals with tax and tip
  async calculateTotal(subtotal, tipPercentage = 0, taxRate = 0.08) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/calculate-total`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subtotal,
          tipPercentage,
          taxRate
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to calculate total');
      }

      return data.totals;
    } catch (error) {
      console.error('Error calculating total:', error);
      throw error;
    }
  }

  // Process payment with Stripe Elements
  async processPayment(paymentIntentClientSecret, paymentElement) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not initialized');
      }

      const { error, paymentIntent } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        paymentIntent
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  // Add tip to existing payment
  async addTip(paymentIntentId, tipAmount) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/add-tip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          tipAmount
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to add tip');
      }

      return data.tipPayment;
    } catch (error) {
      console.error('Error adding tip:', error);
      throw error;
    }
  }

  // Get payment details
  async getPaymentDetails(paymentIntentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/payment/${paymentIntentId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to get payment details');
      }

      return data.payment;
    } catch (error) {
      console.error('Error getting payment details:', error);
      throw error;
    }
  }

  // Create Stripe Elements
  createElements(clientSecret) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    this.elements = this.stripe.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#00D4AA',
          colorBackground: '#ffffff',
          colorText: '#32302f',
          colorDanger: '#df1b41',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          spacingUnit: '4px',
          borderRadius: '12px'
        }
      }
    });

    return this.elements;
  }

  // Create payment element
  createPaymentElement(elements, options = {}) {
    return elements.create('payment', {
      layout: 'tabs',
      ...options
    });
  }

  // Mock payment for demo purposes
  async mockPayment(sessionData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentId: `pi_mock_${Date.now()}`,
          amount: sessionData.amount,
          status: 'succeeded',
          receiptUrl: `${window.location.origin}/receipt/${sessionData.sessionId}`
        });
      }, 2000);
    });
  }

  // Format amount for display
  formatAmount(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Validate card number (basic validation)
  validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  }

  // Get card brand from number
  getCardBrand(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6/.test(cleaned)) return 'discover';
    
    return 'unknown';
  }
}

export default new PaymentService();