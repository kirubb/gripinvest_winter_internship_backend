INSERT INTO investment_products 
(id, name, investment_type, tenure_months, annual_yield, risk_level, min_investment, description)
VALUES
(UUID(), 'AAA Rated Corporate Bond', 'bond', 36, 8.25, 'low', 10000.00, 'A highly rated corporate bond offering stable, predictable returns with minimal risk.'),
(UUID(), 'Guaranteed Return FD', 'fd', 24, 7.50, 'low', 5000.00, 'A fixed deposit with a guaranteed interest rate, ideal for risk-averse investors.'),
(UUID(), 'Aggressive Growth Equity Fund', 'mf', 60, 18.00, 'high', 2500.00, 'An equity mutual fund focused on high-growth stocks. High risk with potential for high returns.'),
(UUID(), 'Global Tech ETF', 'etf', 48, 14.50, 'moderate', 1000.00, 'An exchange-traded fund that tracks a basket of leading global technology companies.');