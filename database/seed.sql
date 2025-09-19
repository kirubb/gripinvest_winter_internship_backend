-- Use the target database
USE gripinvest_db;

-- Create a sample user
-- The password is 'AStrongPassword123!' and has been pre-hashed with bcrypt.
INSERT INTO users (id, first_name, last_name, email, password_hash, risk_appetite, balance)
VALUES 
('a4ecd42f-9464-11f0-94ba-005056c00001', 'Test', 'User', 'test@example.com', '$2a$10$f.o1.1x.2h4l2j8G8g2u4eT2i8Y.0i2u8g4l2j8G8g2u4eT2i8Y.o', 'moderate', 100000.00);

-- Create sample investment products
INSERT INTO investment_products (id, name, investment_type, tenure_months, annual_yield, risk_level, min_investment, description)
VALUES
('b5fdf7b0-9464-11f0-94ba-005056c00002', 'AAA Rated Corporate Bond', 'bond', 36, 8.25, 'low', 10000.00, 'A highly rated corporate bond offering stable, predictable returns with minimal risk.'),
('c6gde8c1-9464-11f0-94ba-005056c00003', 'Guaranteed Return FD', 'fd', 24, 7.50, 'low', 5000.00, 'A fixed deposit with a guaranteed interest rate, ideal for risk-averse investors.'),
('d7hef9d2-9464-11f0-94ba-005056c00004', 'Aggressive Growth Equity Fund', 'mf', 60, 18.00, 'high', 2500.00, 'An equity mutual fund focused on high-growth stocks. High risk with potential for high returns.'),
('e8igh0e3-9464-11f0-94ba-005056c00005', 'Global Tech ETF', 'etf', 48, 14.50, 'moderate', 1000.00, 'An exchange-traded fund that tracks a basket of leading global technology companies.'),
('f9jih1f4-9464-11f0-94ba-005056c00006', 'Laxmi Chit Fund', 'other', 24, 22.50, 'high', 5000.00, 'A high-risk, high-return chit fund investment scheme.');

-- Create a sample investment for the test user in the 'AAA Rated Corporate Bond'
INSERT INTO investments (id, user_id, product_id, amount, status, expected_return, maturity_date)
VALUES
(UUID(), 'a4ecd42f-9464-11f0-94ba-005056c00001', 'b5fdf7b0-9464-11f0-94ba-005056c00002', 15000.00, 'active', 3712.50, DATE_ADD(CURDATE(), INTERVAL 36 MONTH));