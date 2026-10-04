-- =====================================================
-- PROG2002 Assessment 2 - Charity Events Database
-- Database: charityevents_db
-- Organisation: City Hope Foundation
-- =====================================================

DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

-- -----------------------------------------------------
-- Table 1: organisations (charitable organisations)
-- -----------------------------------------------------
CREATE TABLE organisations (
    org_id INT AUTO_INCREMENT PRIMARY KEY,
    org_name VARCHAR(100) NOT NULL,
    mission TEXT,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(30),
    address VARCHAR(200)
);

-- -----------------------------------------------------
-- Table 2: categories (event categories, e.g. fun run, gala)
-- -----------------------------------------------------
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

-- -----------------------------------------------------
-- Table 3: events (charity events)
-- status:  'active' or 'suspended' (suspended events break policy and are hidden)
-- -----------------------------------------------------
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(150) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    end_date DATE,
    location VARCHAR(150) NOT NULL,
    purpose VARCHAR(255),
    ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,   -- 0.00 means free
    goal_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,    -- fundraising goal
    raised_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,  -- current progress
    image_url VARCHAR(255),
    status ENUM('active','suspended') NOT NULL DEFAULT 'active',
    org_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organisations(org_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- -----------------------------------------------------
-- Initial data
-- -----------------------------------------------------
INSERT INTO organisations (org_name, mission, contact_email, contact_phone, address) VALUES
('City Hope Foundation', 'Bringing hope to our city by connecting communities through charitable events that raise funds and awareness for local causes.', 'info@cityhope.org.au', '(02) 9876 5432', '12 Harmony Street, Sydney NSW 2000');

INSERT INTO categories (category_name) VALUES
('Fun Run'),
('Gala Dinner'),
('Silent Auction'),
('Concert'),
('Volunteer Day');

INSERT INTO events (event_name, description, event_date, end_date, location, purpose, ticket_price, goal_amount, raised_amount, image_url, status, org_id, category_id) VALUES
-- Past events (before Oct 2026)
('Harbour Bridge Fun Run 2026', 'A 10km charity fun run across the iconic Harbour Bridge raising funds for youth mental health services.', '2026-05-17', NULL, 'Circular Quay, Sydney', 'Youth mental health services', 45.00, 50000.00, 48250.00, 'images/funrun.jpg', 'active', 1, 1),
('Winter Charity Gala 2026', 'An elegant black-tie dinner with live entertainment, auctions and guest speakers, supporting homeless shelters.', '2026-07-25', NULL, 'Grand Ballroom, Sydney Hilton', 'Homeless shelter support', 180.00, 80000.00, 79400.00, 'images/gala.jpg', 'active', 1, 2),
('Art for Heart Silent Auction', 'An exclusive silent auction of donated artworks by local artists, with all proceeds going to children''s hospitals.', '2026-08-08', NULL, 'City Gallery, Darling Harbour', 'Children''s hospital equipment', 25.00, 30000.00, 31500.00, 'images/auction.jpg', 'active', 1, 3),
('Sunset Charity Concert', 'An open-air concert featuring local bands and artists, raising funds for rural drought relief.', '2026-09-12', NULL, 'The Domain, Sydney', 'Rural drought relief', 60.00, 40000.00, 38900.00, 'images/concert.jpg', 'active', 1, 4),
-- Upcoming events (after Oct 2026)
('Spring Community Fun Run', 'A family-friendly 5km fun run through the Royal Botanic Garden. All fitness levels welcome!', '2026-11-08', NULL, 'Royal Botanic Garden, Sydney', 'Community food bank', 35.00, 25000.00, 9800.00, 'images/funrun2.jpg', 'active', 1, 1),
('Hope Gala Dinner 2026', 'Our annual flagship gala dinner with a three-course meal, live band and fundraising auction for education programs.', '2026-12-05', NULL, 'Star Event Centre, Pyrmont', 'Education programs for disadvantaged youth', 200.00, 100000.00, 45300.00, 'images/gala2.jpg', 'active', 1, 2),
('Christmas Silent Auction', 'Bid on holiday gift hampers, experiences and art pieces at our festive silent auction supporting elderly care.', '2026-12-14', NULL, 'Town Hall, Sydney', 'Elderly care services', 20.00, 15000.00, 2100.00, 'images/auction2.jpg', 'active', 1, 3),
('Carols by Candlelight Concert', 'Join us for an evening of Christmas carols under the stars. Free entry with donations encouraged for disaster relief.', '2026-12-21', NULL, 'Hyde Park, Sydney', 'Disaster relief fund', 0.00, 20000.00, 5400.00, 'images/concert2.jpg', 'active', 1, 4),
('Beach Clean-Up Volunteer Day', 'Give back to the planet! A volunteer day cleaning up Bondi Beach, followed by a community BBQ.', '2026-11-21', NULL, 'Bondi Beach, Sydney', 'Ocean conservation', 0.00, 10000.00, 3200.00, 'images/volunteer.jpg', 'active', 1, 5),
('Suspicious Investment Seminar', 'This event is under review for policy violations.', '2026-10-30', NULL, 'Unknown Venue', 'N/A', 99.00, 5000.00, 0.00, NULL, 'suspended', 1, 5);

-- =====================================================
-- View: convenience view used by the API (optional)
-- =====================================================
CREATE VIEW v_event_list AS
SELECT e.event_id, e.event_name, e.event_date, e.location, e.ticket_price,
       e.goal_amount, e.raised_amount, e.image_url, e.status,
       c.category_name, o.org_name
FROM events e
JOIN categories c ON e.category_id = c.category_id
JOIN organisations o ON e.org_id = o.org_id;
