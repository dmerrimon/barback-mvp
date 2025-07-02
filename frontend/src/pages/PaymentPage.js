import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, ArrowLeft, Check } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const PaymentContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
`;

const PaymentHeader = styled.div`
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-hover);
  }
`;

const HeaderTitle = styled.h1`
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
`;

const PaymentContent = styled.div`
  flex: 1;
  padding: var(--spacing-lg);
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: var(--spacing-md);
  background-color: rgba(0, 212, 170, 0.1);
  border: 1px solid rgba(0, 212, 170, 0.3);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
  color: var(--accent-primary);
  font-size: 0.9rem;
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const FormSection = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const StripeCardContainer = styled.div`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
  
  .StripeElement {
    color: var(--text-primary);
  }
  
  .StripeElement--invalid {
    color: var(--error-color);
  }
  
  .StripeElement::placeholder {
    color: var(--text-muted);
  }
`;

const OrderSummary = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }
  
  &.total {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--text-primary);
    margin-top: 0.5rem;
  }
`;

const SummaryLabel = styled.span`
  color: var(--text-secondary);
  
  &.total {
    color: var(--text-primary);
  }
`;

const SummaryValue = styled.span`
  color: var(--text-primary);
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: var(--accent-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-lg);
  padding: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 107, 107, 0.1);
  border: 1px solid var(--error-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  color: var(--error-color);
  font-size: 0.9rem;
`;

const PaymentPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { success, error: showError } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Mock session data
  const mockSession = {
    id: sessionId,
    venue: 'The Digital Tap',
    tableNumber: '5',
    subtotal: 29.00,
    tax: 2.32,
    total: 31.32
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, sans-serif',
        '::placeholder': {
          color: 'var(--text-muted)',
        },
      },
      invalid: {
        color: 'var(--error-color)',
      },
    },
    hidePostalCode: false,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: billingDetails.name,
          email: billingDetails.email,
          phone: billingDetails.phone,
        },
      });

      if (paymentError) {
        setError(paymentError.message);
        return;
      }

      // In a real app, send payment method to backend
      console.log('Payment method created:', paymentMethod);

      // Create payment intent on backend
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          paymentMethodId: paymentMethod.id,
          amount: Math.round(mockSession.total * 100), // Convert to cents
          billingDetails
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

      if (confirmError) {
        setError(confirmError.message);
        return;
      }

      // Success!
      success('Payment method added successfully!');
      navigate(`/session/${sessionId}`);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/session/${sessionId}`);
  };

  return (
    <PaymentContainer>
      <PaymentHeader>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={20} />
        </BackButton>
        <HeaderTitle>Add Payment Method</HeaderTitle>
      </PaymentHeader>

      <PaymentContent>
        <SecurityBadge>
          <Lock size={16} />
          Secured by Stripe • Your card info is never stored
        </SecurityBadge>

        <PaymentForm onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>
              <CreditCard size={20} />
              Card Information
            </SectionTitle>
            
            <FormField>
              <Label>Card Details</Label>
              <StripeCardContainer>
                <CardElement options={cardElementOptions} />
              </StripeCardContainer>
            </FormField>
          </FormSection>

          <FormSection>
            <SectionTitle>Billing Information</SectionTitle>
            
            <FormField>
              <Label>Full Name</Label>
              <Input
                type="text"
                name="name"
                value={billingDetails.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </FormField>

            <FormRow>
              <FormField>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={billingDetails.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                />
              </FormField>

              <FormField>
                <Label>Phone (Optional)</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={billingDetails.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </FormField>
            </FormRow>
          </FormSection>

          <OrderSummary>
            <SectionTitle>Order Summary</SectionTitle>
            
            <SummaryRow>
              <SummaryLabel>{mockSession.venue} - Table {mockSession.tableNumber}</SummaryLabel>
            </SummaryRow>
            
            <SummaryRow>
              <SummaryLabel>Subtotal</SummaryLabel>
              <SummaryValue>${mockSession.subtotal.toFixed(2)}</SummaryValue>
            </SummaryRow>
            
            <SummaryRow>
              <SummaryLabel>Tax</SummaryLabel>
              <SummaryValue>${mockSession.tax.toFixed(2)}</SummaryValue>
            </SummaryRow>
            
            <SummaryRow className="total">
              <SummaryLabel className="total">Total</SummaryLabel>
              <SummaryValue>${mockSession.total.toFixed(2)}</SummaryValue>
            </SummaryRow>
          </OrderSummary>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={!stripe || isLoading}>
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                Processing...
              </>
            ) : (
              <>
                <Check size={20} />
                Add Payment Method
              </>
            )}
          </SubmitButton>
        </PaymentForm>
      </PaymentContent>
    </PaymentContainer>
  );
};

export default PaymentPage;