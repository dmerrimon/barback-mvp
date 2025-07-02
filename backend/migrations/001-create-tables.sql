-- Barback Database Migration
-- Creates all tables for the Barback application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    stripe_account_id VARCHAR(255),
    settings JSONB DEFAULT '{
        "autoCloseTabMinutes": 30,
        "tipSuggestions": [15, 18, 20, 25],
        "requireTipBeforeClose": false,
        "maxTabAmount": 500,
        "beaconExitDelaySeconds": 10
    }'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_tier VARCHAR(50) DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'premium')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    patron_name VARCHAR(255) NOT NULL,
    patron_phone VARCHAR(50),
    patron_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'closed', 'cancelled')),
    qr_code TEXT NOT NULL,
    table_number VARCHAR(20),
    entry_time TIMESTAMP WITH TIME ZONE,
    exit_time TIMESTAMP WITH TIME ZONE,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    tip_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    stripe_payment_intent_id VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tab items table
CREATE TABLE IF NOT EXISTS tab_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    total_price DECIMAL(10, 2) NOT NULL,
    added_by VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
    stripe_customer_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    tip_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')),
    payment_method VARCHAR(255),
    last4 VARCHAR(4),
    brand VARCHAR(50),
    receipt_url VARCHAR(500),
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Beacons table
CREATE TABLE IF NOT EXISTS beacons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    uuid VARCHAR(255) NOT NULL,
    major INTEGER NOT NULL,
    minor INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location JSONB,
    rssi_threshold INTEGER DEFAULT -65,
    is_active BOOLEAN DEFAULT TRUE,
    battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
    last_seen TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{
        "transmissionPower": "medium",
        "advertisingInterval": 100
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(uuid, major, minor)
);

-- Zones table
CREATE TABLE IF NOT EXISTS zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('entry', 'exit', 'bar', 'seating', 'other')),
    description TEXT,
    coordinates JSONB,
    trigger_action VARCHAR(50) DEFAULT 'none' CHECK (trigger_action IN ('activate_tab', 'close_tab', 'notification', 'none')),
    dwell_time_threshold INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 1,
    settings JSONB DEFAULT '{
        "requireConfirmation": false,
        "sendNotification": true,
        "maxOccupancy": null
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zone-Beacon junction table
CREATE TABLE IF NOT EXISTS zone_beacons (
    zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    beacon_id UUID NOT NULL REFERENCES beacons(id) ON DELETE CASCADE,
    PRIMARY KEY (zone_id, beacon_id)
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    total_tips DECIMAL(10, 2) DEFAULT 0,
    average_tab_size DECIMAL(10, 2) DEFAULT 0,
    average_dwell_time INTEGER DEFAULT 0,
    unique_patrons INTEGER DEFAULT 0,
    tip_conversion_rate DECIMAL(5, 2) DEFAULT 0,
    peak_hour INTEGER CHECK (peak_hour >= 0 AND peak_hour <= 23),
    zone_activity JSONB DEFAULT '{}'::jsonb,
    hourly_breakdown JSONB DEFAULT '{}'::jsonb,
    payment_methods JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(venue_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_venue_id ON sessions(venue_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_tab_items_session_id ON tab_items(session_id);
CREATE INDEX IF NOT EXISTS idx_payments_session_id ON payments(session_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_beacons_venue_id ON beacons(venue_id);
CREATE INDEX IF NOT EXISTS idx_beacons_uuid_major_minor ON beacons(uuid, major, minor);
CREATE INDEX IF NOT EXISTS idx_zones_venue_id ON zones(venue_id);
CREATE INDEX IF NOT EXISTS idx_analytics_venue_id_date ON analytics(venue_id, date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tab_items_updated_at BEFORE UPDATE ON tab_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beacons_updated_at BEFORE UPDATE ON beacons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON zones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample venue for testing
INSERT INTO venues (id, name, address, phone, email, subscription_tier) VALUES 
(
    'demo-venue-id',
    'The Digital Tap',
    '123 Tech Street, San Francisco, CA 94105',
    '+1 (555) 123-4567',
    'contact@digitaltap.com',
    'premium'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample beacons for the demo venue
INSERT INTO beacons (venue_id, uuid, major, minor, name, description) VALUES 
(
    'demo-venue-id',
    'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
    1,
    1,
    'Entry Zone Beacon',
    'Beacon at main entrance'
),
(
    'demo-venue-id',
    'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
    1,
    2,
    'Bar Zone Beacon',
    'Beacon at bar area'
),
(
    'demo-venue-id',
    'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
    1,
    3,
    'Exit Zone Beacon',
    'Beacon at exit'
) ON CONFLICT (uuid, major, minor) DO NOTHING;

-- Insert sample zones for the demo venue
INSERT INTO zones (venue_id, name, type, trigger_action) VALUES 
(
    'demo-venue-id',
    'Main Entrance',
    'entry',
    'activate_tab'
),
(
    'demo-venue-id',
    'Bar Area',
    'bar',
    'notification'
),
(
    'demo-venue-id',
    'Exit Area',
    'exit',
    'close_tab'
) ON CONFLICT DO NOTHING;