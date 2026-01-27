A modern, clean, and professional web-based admin dashboard designed for the offline analysis of web server access logs. This application leverages React.js and NLP-driven logic to identify threats, analyze IP behavior, and visualize security trends.

🚀 Key Features
Secure Admin Authentication: Centered login layout for restricted administrative access.

Automated Log Parsing: Handles .log and .csv files locally for efficient offline analysis.

Threat Detection: Displays identified security events with color-coded severity levels (Low, Medium, High).

IP Analysis: Tracks unique IP addresses, highlights suspicious behavior, and identifies user-agents.

Data Visualizations: Interactive Bar and Line charts representing HTTP status distributions and request volume over time.

NLP Integration: Analyzes frequently occurring security-related terms within raw log data.

🛠️ Tech Stack
Frontend: React.js (Vite)

Styling: CSS3 / Tailwind CSS

Icons: Lucide-React

Charts: Recharts

Navigation: State-based conditional rendering for internal dashboard views

📂 Project Structure
Plaintext
src/
├── components/     # Reusable UI elements (Navbar, Header)
├── pages/          # Dashboard, Threats, IP Analysis, Visualizations
├── styles/         # Global and component-specific CSS
└── utils/          # Log parsing and NLP logic
⚙️ Installation & Setup
To run this project locally, follow these steps:

Clone the repository:

Bash
git clone https://github.com/YOUR-USERNAME/security-analyzer.git
cd security-analyzer
Install dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
🎯 Target Audience
This project is developed as part of a final-year academic curriculum, intended for:

College Evaluators and Faculty Reviewers

Cybersecurity Enthusiasts

Data Analysts