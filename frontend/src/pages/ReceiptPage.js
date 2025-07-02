import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Star, 
  Home, 
  Receipt,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const ReceiptContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg);
`;

const ReceiptCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-lg);
  margin-top: var(--spacing-xl);
`;

const SuccessHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-lg);
  background: linear-gradient(135deg, var(--success-color), var(--accent-primary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const SuccessTitle = styled.h1`
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const SuccessMessage = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const ReceiptDetails = styled.div`
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  background-color: var(--bg-secondary);
`;

const ReceiptHeader = styled.div`
  text-align: center;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-md);
`;

const VenueName = styled.h2`
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
`;

const VenueDetails = styled.div`
  color: var(--text-secondary);
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
`;

const TransactionInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  font-size: 0.9rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  color: var(--text-primary);
  font-weight: 500;
`;

const ItemsList = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const ItemsHeader = styled.h3`
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Item = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  color: var(--text-primary);
  font-weight: 500;
`;

const ItemInfo = styled.div`
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

const ItemPrice = styled.div`
  color: var(--text-primary);
  font-weight: 600;
`;

const TotalSection = styled.div`
  border-top: 2px solid var(--border-color);
  padding-top: var(--spacing-md);
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 0.25rem 0;
  
  &.subtotal, &.tax, &.tip {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  &.total {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    border-top: 1px solid var(--border-color);
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
`;

const ActionButton = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &.primary {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
    
    &:hover {
      background-color: var(--accent-hover);
      transform: translateY(-1px);
    }
  }
  
  &.secondary {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: var(--bg-hover);
    }
  }
  
  &.ghost {
    background: none;
    color: var(--text-secondary);
    
    &:hover {
      color: var(--text-primary);
      background-color: var(--bg-hover);
    }
  }
`;

const RatingSection = styled.div`
  text-align: center;
  padding: var(--spacing-lg);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-lg);
`;

const RatingTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: var(--spacing-md);
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  transition: color 0.2s ease;
  
  &:hover,
  &.active {
    color: var(--warning-color);
  }
`;

const ReceiptPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { success } = useToast();

  const [receipt, setReceipt] = useState(null);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Mock receipt data
  const mockReceipt = {
    id: 'receipt-12345',
    sessionId,
    venue: {
      name: 'The Digital Tap',
      address: '123 Tech Street, San Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'contact@digitaltap.com'
    },
    transaction: {
      date: new Date(),
      tableNumber: '5',
      server: 'Sarah M.',
      paymentMethod: '**** 4242',
      transactionId: 'pi_1234567890'
    },
    items: [
      {
        id: '1',
        name: 'Craft IPA',
        category: 'Beer',
        quantity: 2,
        unitPrice: 8.50,
        totalPrice: 17.00
      },
      {
        id: '2',
        name: 'Buffalo Wings',
        category: 'Food',
        quantity: 1,
        unitPrice: 12.50,
        totalPrice: 12.50
      },
      {
        id: '3',
        name: 'Loaded Fries',
        category: 'Food',
        quantity: 1,
        unitPrice: 9.75,
        totalPrice: 9.75
      }
    ],
    totals: {
      subtotal: 39.25,
      tax: 3.14,
      tip: 7.85,
      total: 50.24
    }
  };

  useEffect(() => {
    // Simulate loading receipt data
    setTimeout(() => {
      setReceipt(mockReceipt);
      setIsLoading(false);
    }, 1000);
  }, [sessionId]);

  const handleDownloadReceipt = () => {
    // In real app, generate and download PDF
    success('Receipt download started!');
  };

  const handleShareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt from ${receipt.venue.name}`,
          text: `My tab total was $${receipt.totals.total.toFixed(2)}`,
          url: window.location.href
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      success('Receipt link copied to clipboard!');
    }
  };

  const handleRating = (stars) => {
    setRating(stars);
    success(`Thank you for rating ${stars} stars!`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <ReceiptContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-spinner" />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Loading receipt...
          </p>
        </div>
      </ReceiptContainer>
    );
  }

  if (!receipt) {
    return (
      <ReceiptContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Receipt not found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            The receipt you're looking for doesn't exist.
          </p>
          <ActionButton className="primary" onClick={handleGoHome}>
            <Home size={20} />
            Go Home
          </ActionButton>
        </div>
      </ReceiptContainer>
    );
  }

  return (
    <ReceiptContainer>
      <SuccessHeader>
        <SuccessIcon>
          <CheckCircle size={40} />
        </SuccessIcon>
        <SuccessTitle>Payment Successful!</SuccessTitle>
        <SuccessMessage>
          Thank you for dining with us. Your receipt is ready.
        </SuccessMessage>
      </SuccessHeader>

      <ReceiptCard>
        <ReceiptDetails>
          <ReceiptHeader>
            <VenueName>{receipt.venue.name}</VenueName>
            <VenueDetails>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={12} />
                {receipt.venue.address}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Phone size={12} />
                {receipt.venue.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Mail size={12} />
                {receipt.venue.email}
              </div>
            </VenueDetails>
          </ReceiptHeader>

          <TransactionInfo>
            <InfoItem>
              <InfoLabel>Date & Time</InfoLabel>
              <InfoValue>
                {receipt.transaction.date.toLocaleDateString()} at{' '}
                {receipt.transaction.date.toLocaleTimeString()}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Table</InfoLabel>
              <InfoValue>#{receipt.transaction.tableNumber}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Server</InfoLabel>
              <InfoValue>{receipt.transaction.server}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Payment</InfoLabel>
              <InfoValue>{receipt.transaction.paymentMethod}</InfoValue>
            </InfoItem>
          </TransactionInfo>

          <ItemsList>
            <ItemsHeader>
              <Receipt size={16} />
              Items Ordered
            </ItemsHeader>
            {receipt.items.map((item) => (
              <Item key={item.id}>
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemInfo>
                    {item.quantity > 1 && `${item.quantity}x `}
                    ${item.unitPrice.toFixed(2)}
                    {item.category && ` • ${item.category}`}
                  </ItemInfo>
                </ItemDetails>
                <ItemPrice>${item.totalPrice.toFixed(2)}</ItemPrice>
              </Item>
            ))}
          </ItemsList>

          <TotalSection>
            <TotalRow className="subtotal">
              <span>Subtotal</span>
              <span>${receipt.totals.subtotal.toFixed(2)}</span>
            </TotalRow>
            <TotalRow className="tax">
              <span>Tax</span>
              <span>${receipt.totals.tax.toFixed(2)}</span>
            </TotalRow>
            <TotalRow className="tip">
              <span>Tip</span>
              <span>${receipt.totals.tip.toFixed(2)}</span>
            </TotalRow>
            <TotalRow className="total">
              <span>Total</span>
              <span>${receipt.totals.total.toFixed(2)}</span>
            </TotalRow>
          </TotalSection>
        </ReceiptDetails>

        <ActionButtons>
          <ActionButton className="primary" onClick={handleDownloadReceipt}>
            <Download size={20} />
            Download PDF
          </ActionButton>
          
          <ActionButton className="secondary" onClick={handleShareReceipt}>
            <Share2 size={20} />
            Share Receipt
          </ActionButton>
          
          <ActionButton className="ghost" onClick={handleGoHome}>
            <Home size={20} />
            Back to Home
          </ActionButton>
        </ActionButtons>
      </ReceiptCard>

      <RatingSection>
        <RatingTitle>How was your experience?</RatingTitle>
        <StarRating>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarButton
              key={star}
              className={rating >= star ? 'active' : ''}
              onClick={() => handleRating(star)}
            >
              <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
            </StarButton>
          ))}
        </StarRating>
        {rating > 0 && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Thank you for your feedback!
          </p>
        )}
      </RatingSection>
    </ReceiptContainer>
  );
};

export default ReceiptPage;