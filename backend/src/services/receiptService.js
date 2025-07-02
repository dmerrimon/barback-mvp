// Receipt generation and email service
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class ReceiptService {
  constructor() {
    this.transporter = null;
    this.initializeEmailTransporter();
  }

  async initializeEmailTransporter() {
    try {
      // Configure email transporter (using Gmail as example)
      this.transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      // Verify connection
      await this.transporter.verify();
      logger.info('Email transporter initialized successfully');
    } catch (error) {
      logger.warn('Email transporter not configured:', error.message);
    }
  }

  // Generate receipt data
  async generateReceiptData(payment, session, venue) {
    try {
      const receiptData = {
        id: `REC-${payment.id}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        venue: {
          name: venue.name,
          address: venue.address,
          phone: venue.phone,
          email: venue.email
        },
        session: {
          id: session.id,
          tableNumber: session.tableNumber,
          startTime: session.startTime,
          endTime: session.exitTime || new Date()
        },
        payment: {
          id: payment.id,
          stripePaymentIntentId: payment.stripePaymentIntentId,
          amount: payment.amount,
          tipAmount: payment.tipAmount || 0,
          totalAmount: payment.totalAmount,
          paymentMethod: this.getPaymentMethodDisplay(payment.paymentMethod),
          status: payment.status,
          processedAt: payment.createdAt
        },
        items: session.tabItems || [],
        totals: {
          subtotal: payment.amount,
          tip: payment.tipAmount || 0,
          tax: payment.totalAmount - payment.amount - (payment.tipAmount || 0),
          total: payment.totalAmount
        }
      };

      return receiptData;
    } catch (error) {
      logger.error('Error generating receipt data:', error);
      throw error;
    }
  }

  // Generate HTML receipt
  generateHTMLReceipt(receiptData) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receipt - ${receiptData.venue.name}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .receipt { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: #00D4AA; color: white; padding: 2rem; text-align: center; }
        .header h1 { margin: 0; font-size: 1.5rem; }
        .header p { margin: 0.5rem 0 0; opacity: 0.9; }
        .content { padding: 2rem; }
        .section { margin-bottom: 2rem; }
        .section h3 { color: #32302f; margin: 0 0 1rem; font-size: 1.1rem; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .info-item { }
        .info-label { color: #6B6B6B; font-size: 0.9rem; margin-bottom: 0.25rem; }
        .info-value { color: #32302f; font-weight: 500; }
        .items-table { width: 100%; border-collapse: collapse; }
        .items-table th, .items-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #E8E8E8; }
        .items-table th { background: #F8F8F8; color: #32302f; font-weight: 600; }
        .totals { background: #F8F8F8; border-radius: 8px; padding: 1.5rem; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .total-row.final { font-weight: 600; font-size: 1.1rem; color: #32302f; border-top: 1px solid #E8E8E8; padding-top: 0.75rem; margin-top: 0.75rem; }
        .footer { background: #F8F8F8; padding: 1.5rem; text-align: center; color: #6B6B6B; font-size: 0.9rem; }
        .payment-status { display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; text-transform: uppercase; font-size: 0.8rem; }
        .status-succeeded { background: rgba(81, 207, 102, 0.1); color: #51CF66; }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>${receiptData.venue.name}</h1>
            <p>Thank you for your visit!</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h3>Receipt Details</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Receipt #</div>
                        <div class="info-value">${receiptData.id}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Date & Time</div>
                        <div class="info-value">${new Date(receiptData.timestamp).toLocaleString()}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Table</div>
                        <div class="info-value">Table ${receiptData.session.tableNumber || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Payment Status</div>
                        <div class="info-value">
                            <span class="payment-status status-${receiptData.payment.status}">${receiptData.payment.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            ${receiptData.items.length > 0 ? `
            <div class="section">
                <h3>Items Ordered</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${receiptData.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity || 1}</td>
                            <td>$${(item.price || 0).toFixed(2)}</td>
                            <td>$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}

            <div class="section">
                <h3>Payment Summary</h3>
                <div class="totals">
                    <div class="total-row">
                        <span>Subtotal</span>
                        <span>$${receiptData.totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Tax</span>
                        <span>$${receiptData.totals.tax.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Tip</span>
                        <span>$${receiptData.totals.tip.toFixed(2)}</span>
                    </div>
                    <div class="total-row final">
                        <span>Total Paid</span>
                        <span>$${receiptData.totals.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <h3>Payment Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Payment Method</div>
                        <div class="info-value">${receiptData.payment.paymentMethod}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Transaction ID</div>
                        <div class="info-value">${receiptData.payment.stripePaymentIntentId}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p><strong>${receiptData.venue.name}</strong></p>
            <p>${receiptData.venue.address}</p>
            <p>${receiptData.venue.phone} • ${receiptData.venue.email}</p>
            <p style="margin-top: 1rem;">Powered by Barback</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  // Send receipt via email
  async sendReceiptEmail(receiptData, customerEmail) {
    try {
      if (!this.transporter) {
        logger.warn('Email transporter not configured, skipping receipt email');
        return { success: false, reason: 'Email not configured' };
      }

      const htmlContent = this.generateHTMLReceipt(receiptData);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: `Receipt from ${receiptData.venue.name} - ${receiptData.id}`,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Receipt email sent to ${customerEmail}: ${result.messageId}`);

      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Error sending receipt email:', error);
      throw error;
    }
  }

  // Save receipt to file system
  async saveReceiptFile(receiptData, outputPath) {
    try {
      const htmlContent = this.generateHTMLReceipt(receiptData);
      const filename = `receipt-${receiptData.id}.html`;
      const filepath = path.join(outputPath, filename);

      await fs.writeFile(filepath, htmlContent, 'utf8');
      logger.info(`Receipt saved to file: ${filepath}`);

      return { success: true, filepath };
    } catch (error) {
      logger.error('Error saving receipt file:', error);
      throw error;
    }
  }

  // Get payment method display name
  getPaymentMethodDisplay(paymentMethodId) {
    // In a real implementation, you'd fetch the payment method details from Stripe
    // For now, return a generic display name
    return 'Card ending in ••••';
  }

  // Generate receipt URL for customer access
  generateReceiptURL(receiptId) {
    const baseURL = process.env.FRONTEND_URL || 'https://barback-frontend.onrender.com';
    return `${baseURL}/receipt/${receiptId}`;
  }

  // Process receipt generation workflow
  async processReceipt(paymentId, customerEmail = null) {
    try {
      // This would typically fetch payment, session, and venue data
      // For demo purposes, we'll create a mock receipt
      const mockReceiptData = {
        id: `REC-${paymentId}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        venue: {
          name: 'The Barback Demo',
          address: '123 Main Street, City, State 12345',
          phone: '(555) 123-4567',
          email: 'hello@barback.demo'
        },
        session: {
          id: 'session-123',
          tableNumber: '5',
          startTime: new Date(Date.now() - 3600000).toISOString(),
          endTime: new Date().toISOString()
        },
        payment: {
          id: paymentId,
          stripePaymentIntentId: `pi_${paymentId}_demo`,
          amount: 42.50,
          tipAmount: 7.65,
          totalAmount: 53.55,
          paymentMethod: 'Card ending in ••••4242',
          status: 'succeeded',
          processedAt: new Date().toISOString()
        },
        items: [
          { name: 'Craft IPA', quantity: 2, price: 8.50 },
          { name: 'Moscow Mule', quantity: 1, price: 13.50 },
          { name: 'House Red Wine', quantity: 1, price: 12.00 }
        ],
        totals: {
          subtotal: 42.50,
          tip: 7.65,
          tax: 3.40,
          total: 53.55
        }
      };

      const result = {
        receiptData: mockReceiptData,
        htmlContent: this.generateHTMLReceipt(mockReceiptData),
        receiptURL: this.generateReceiptURL(mockReceiptData.id)
      };

      // Send email if customer email provided
      if (customerEmail) {
        const emailResult = await this.sendReceiptEmail(mockReceiptData, customerEmail);
        result.emailSent = emailResult.success;
        result.emailMessageId = emailResult.messageId;
      }

      return result;
    } catch (error) {
      logger.error('Error processing receipt:', error);
      throw error;
    }
  }
}

module.exports = new ReceiptService();