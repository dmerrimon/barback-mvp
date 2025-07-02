import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CreditCard, DollarSign, Receipt, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentFlowProps {
  sessionData: {
    id: string;
    subtotal: number;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
  };
  onPaymentComplete: (paymentResult: any) => void;
  onCancel: () => void;
}

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const Title = styled.h2`
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const SessionInfo = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const OrderSummary = styled.div`
  margin-bottom: 2rem;
`;

const SummaryTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ItemList = styled.div`
  margin-bottom: 1rem;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.span`
  color: var(--text-primary);
  font-weight: 500;
`;

const ItemPrice = styled.span`
  color: var(--text-secondary);
`;

const TotalsSection = styled.div`
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
`;

const TotalRow = styled.div<{ isFinal?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  color: ${props => props.isFinal ? 'var(--text-primary)' : 'var(--text-secondary)'};
  font-weight: ${props => props.isFinal ? '600' : '400'};
  font-size: ${props => props.isFinal ? '1.1rem' : '0.9rem'};
  
  ${props => props.isFinal && `
    border-top: 1px solid var(--border-color);
    margin-top: 0.5rem;
    padding-top: 1rem;
  `}
`;

const TipSection = styled.div`
  margin-bottom: 2rem;
`;

const TipButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TipButton = styled.button<{ active?: boolean }>`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-card)'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--accent-hover)' : 'var(--bg-hover)'};
  }
`;

const CustomTipInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

const PaymentMethodSection = styled.div`
  margin-bottom: 2rem;
`;

const PaymentButton = styled.button<{ processing?: boolean }>`
  width: 100%;
  padding: 1rem;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    background: var(--accent-hover);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: none;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  margin-bottom: 1rem;
  background: ${props => props.type === 'success' ? 
    'rgba(81, 207, 102, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
  color: ${props => props.type === 'success' ? 
    'var(--success-color)' : 'var(--error-color)'};
`;

const PaymentFlow: React.FC<PaymentFlowProps> = ({ 
  sessionData, 
  onPaymentComplete, 
  onCancel 
}) => {
  const [tipPercentage, setTipPercentage] = useState(18);
  const [customTip, setCustomTip] = useState('');
  const [useCustomTip, setUseCustomTip] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  const tipPresets = [15, 18, 20, 25];
  const taxRate = 0.08; // 8% tax

  // Calculate totals
  const subtotal = sessionData.subtotal;
  const tipAmount = useCustomTip ? 
    parseFloat(customTip) || 0 : 
    subtotal * (tipPercentage / 100);
  const tax = subtotal * taxRate;
  const total = subtotal + tipAmount + tax;

  const handleTipSelect = (percentage: number) => {
    setTipPercentage(percentage);
    setUseCustomTip(false);
    setCustomTip('');
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    setUseCustomTip(true);
  };

  const processPayment = async () => {
    setProcessing(true);
    setPaymentStatus('pending');
    setErrorMessage('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, you would:
      // 1. Create payment intent with backend
      // 2. Confirm payment with Stripe
      // 3. Handle 3D Secure if needed
      // 4. Update session in Firebase

      const paymentResult = {
        success: true,
        paymentId: `pi_${Date.now()}`,
        amount: total,
        tipAmount: tipAmount,
        receiptUrl: `https://barback-frontend.onrender.com/receipt/${sessionData.id}`
      };

      setPaymentStatus('success');
      
      // Wait a moment to show success message
      setTimeout(() => {
        onPaymentComplete(paymentResult);
      }, 1500);

    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
      setErrorMessage('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Complete Your Payment</Title>
        <SessionInfo>Session #{sessionData.id}</SessionInfo>
      </Header>

      {paymentStatus === 'success' && (
        <StatusMessage type="success">
          <CheckCircle size={20} />
          Payment successful! Thank you for your visit.
        </StatusMessage>
      )}

      {paymentStatus === 'error' && (
        <StatusMessage type="error">
          <AlertCircle size={20} />
          {errorMessage}
        </StatusMessage>
      )}

      <OrderSummary>
        <SummaryTitle>
          <Receipt size={20} />
          Order Summary
        </SummaryTitle>
        
        <ItemList>
          {sessionData.items.map((item, index) => (
            <Item key={index}>
              <ItemName>
                {item.quantity}x {item.name}
              </ItemName>
              <ItemPrice>
                ${(item.price * item.quantity).toFixed(2)}
              </ItemPrice>
            </Item>
          ))}
        </ItemList>
      </OrderSummary>

      <TotalsSection>
        <TotalRow>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </TotalRow>
        <TotalRow>
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </TotalRow>
        <TotalRow>
          <span>Tip</span>
          <span>${tipAmount.toFixed(2)}</span>
        </TotalRow>
        <TotalRow isFinal>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </TotalRow>
      </TotalsSection>

      <TipSection>
        <SummaryTitle>
          <DollarSign size={20} />
          Add Tip
        </SummaryTitle>
        
        <TipButtons>
          {tipPresets.map(percentage => (
            <TipButton
              key={percentage}
              active={!useCustomTip && tipPercentage === percentage}
              onClick={() => handleTipSelect(percentage)}
            >
              {percentage}%
            </TipButton>
          ))}
        </TipButtons>
        
        <CustomTipInput
          type="number"
          placeholder="Custom tip amount ($)"
          value={customTip}
          onChange={(e) => handleCustomTipChange(e.target.value)}
          step="0.01"
          min="0"
        />
      </TipSection>

      <PaymentMethodSection>
        <SummaryTitle>
          <CreditCard size={20} />
          Payment Method
        </SummaryTitle>
        
        {/* In a real implementation, this would be Stripe Elements */}
        <div style={{ 
          padding: '1rem', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }}>
          💳 Card ending in 4242 (Demo)
        </div>
      </PaymentMethodSection>

      <PaymentButton 
        onClick={processPayment}
        disabled={processing || paymentStatus === 'success'}
        processing={processing}
      >
        {processing ? (
          <>
            <LoadingSpinner />
            Processing Payment...
          </>
        ) : paymentStatus === 'success' ? (
          <>
            <CheckCircle size={20} />
            Payment Complete
          </>
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </PaymentButton>

      {paymentStatus === 'pending' && (
        <CancelButton onClick={onCancel}>
          Cancel Payment
        </CancelButton>
      )}
    </Container>
  );
};

export default PaymentFlow;