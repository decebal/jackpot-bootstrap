-- Create databases for each microservice
CREATE DATABASE IF NOT EXISTS jackpot_admin;
CREATE DATABASE IF NOT EXISTS jackpot_metrics;
CREATE DATABASE IF NOT EXISTS jackpot_scheduler;
CREATE DATABASE IF NOT EXISTS jackpot_engine;

-- Create user with appropriate permissions
CREATE USER IF NOT EXISTS 'jackpot'@'%' IDENTIFIED BY 'jackpot';
GRANT ALL PRIVILEGES ON jackpot_admin.* TO 'jackpot'@'%';
GRANT ALL PRIVILEGES ON jackpot_metrics.* TO 'jackpot'@'%';
GRANT ALL PRIVILEGES ON jackpot_scheduler.* TO 'jackpot'@'%';
GRANT ALL PRIVILEGES ON jackpot_engine.* TO 'jackpot'@'%';
FLUSH PRIVILEGES;
