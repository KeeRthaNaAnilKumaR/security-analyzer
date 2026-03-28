import pyodbc
import re
import sys 

conn_str = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=127.0.0.1\\SQLEXPRESS;"
    "DATABASE=SecurityAnalyzerDB;"
    "UID=keer_user;"
    "PWD=root123;"
    "Encrypt=no;"
    "TrustServerCertificate=yes;"
)

def run_analysis():
    # Get file path from Node.js argument, otherwise default to access.log
    target_file = sys.argv[1] if len(sys.argv) > 1 else 'access.log'
    
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        with open(target_file, 'r') as file:
            for line in file:
                match = re.search(r'(\d+\.\d+\.\d+\.\d+) .*? "(GET|POST) (.*?) HTTP.*?" (\d+) (\d+)', line)
                if match:
                    ip, method, url, status, size = match.groups()
                    
                    # NLP/Security Logic
                    level, event = "Low", "Normal Access"
                    if any(x in url.upper() for x in ["SELECT", "UNION", "DROP"]):
                        level, event = "High", "SQL Injection Attempt"
                    elif "<script>" in url.lower():
                        level, event = "High", "XSS Attempt"

                    # Batch insertions to both tables
                    cursor.execute("INSERT INTO parsed_logs (timestamp, ip_address, req_method, req_url, status_code, response_size, security_level, event_type) VALUES (GETDATE(), ?, ?, ?, ?, ?, ?, ?)", 
                                   (ip, method, url, int(status), int(size), level, event))
                    
                    if level == "High":
                        cursor.execute("INSERT INTO security_events (timestamp, ip_address, event_type, event_description, security_level) VALUES (GETDATE(), ?, ?, ?, ?)", 
                                       (ip, event, f"Detected {event} via {method}", level))
        
        conn.commit()
        print(f"Success: Processed {target_file}")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_analysis()