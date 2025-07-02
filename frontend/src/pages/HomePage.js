import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { QrCode, Smartphone, CreditCard, BarChart3, Users, Zap } from 'lucide-react';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-md);
`;

const HeroSection = styled.section`
  text-align: center;
  padding: var(--spacing-2xl) 0;
  margin-bottom: var(--spacing-2xl);
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  
  &.primary {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
    
    &:hover {
      background-color: var(--accent-hover);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }
  
  &.secondary {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: var(--bg-hover);
      border-color: var(--border-hover);
      transform: translateY(-2px);
    }
  }
`;

const FeaturesSection = styled.section`
  margin: var(--spacing-2xl) 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: var(--spacing-xl);
  font-size: 2.5rem;
  color: var(--text-primary);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
`;

const FeatureCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-primary);
  }
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-lg);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FeatureTitle = styled.h3`
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  font-size: 1.25rem;
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const HowItWorksSection = styled.section`
  background-color: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  margin: var(--spacing-2xl) 0;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
`;

const Step = styled.div`
  text-align: center;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 32px;
    right: -${props => props.theme.spacing?.xl || '2rem'};
    width: 2rem;
    height: 2px;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
    
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const StepNumber = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-md);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
`;

const StepTitle = styled.h4`
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
`;

const StepDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const HomePage = () => {
  const features = [
    {
      icon: <QrCode size={32} />,
      title: "QR Code Entry",
      description: "Scan a QR code at any table to instantly open your tab. No app downloads required."
    },
    {
      icon: <Smartphone size={32} />,
      title: "BLE Detection",
      description: "Bluetooth beacons automatically detect when you enter and exit the venue."
    },
    {
      icon: <CreditCard size={32} />,
      title: "Automatic Payment",
      description: "Your card is charged automatically when you leave, with smart tip prompting."
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Analytics Dashboard",
      description: "Real-time insights for bar owners on revenue, tips, and customer behavior."
    },
    {
      icon: <Users size={32} />,
      title: "Bartender Tools",
      description: "Intuitive dashboard for staff to manage tabs and track patron presence."
    },
    {
      icon: <Zap size={32} />,
      title: "Instant Updates",
      description: "Real-time sync across all devices with WebSocket technology."
    }
  ];

  const steps = [
    {
      title: "Scan QR Code",
      description: "Point your phone camera at the QR code on your table"
    },
    {
      title: "Add Payment",
      description: "Securely enter your payment method via Stripe"
    },
    {
      title: "Enjoy Your Visit",
      description: "Order drinks while beacons track your presence"
    },
    {
      title: "Auto Checkout",
      description: "Leave and get charged automatically with tip prompt"
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>The Future of Bar Tabs</HeroTitle>
        <HeroSubtitle>
          Checkout-free bar experiences powered by QR codes, Bluetooth beacons, 
          and smart analytics. No app required.
        </HeroSubtitle>
        <CTAButtons>
          <CTAButton to="/scan" className="primary">
            <QrCode size={20} />
            Start Your Tab
          </CTAButton>
          <CTAButton to="#features" className="secondary">
            Learn More
          </CTAButton>
        </CTAButtons>
      </HeroSection>

      <FeaturesSection id="features">
        <SectionTitle>How Barback Works</SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <HowItWorksSection>
        <SectionTitle>Simple Process</SectionTitle>
        <StepsGrid>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepNumber>{index + 1}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Step>
          ))}
        </StepsGrid>
      </HowItWorksSection>
    </HomeContainer>
  );
};

export default HomePage;