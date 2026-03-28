-- Table for structured log data
CREATE TABLE parsed_logs (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    ip_address NVARCHAR(50) NOT NULL,
    req_method NVARCHAR(10) NOT NULL,
    req_url NVARCHAR(MAX) NOT NULL,
    status_code INT NOT NULL,
    response_size BIGINT NULL,
    user_agent NVARCHAR(MAX) NULL,
    event_type NVARCHAR(100) NULL,
    security_level NVARCHAR(20) NULL
);

-- Table for detected threats
CREATE TABLE security_events (
    event_id INT IDENTITY(1,1) PRIMARY KEY,
    log_id INT FOREIGN KEY REFERENCES parsed_logs(log_id),
    timestamp DATETIME NOT NULL,
    ip_address NVARCHAR(50) NOT NULL,
    event_type NVARCHAR(100) NOT NULL,
    event_description NVARCHAR(MAX) NULL,
    security_level NVARCHAR(20) NOT NULL,
    detection_rule NVARCHAR(MAX) NULL
);