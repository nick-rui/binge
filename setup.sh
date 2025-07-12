#!/bin/bash

# Create Python virtual environment and install dependencies
echo "Setting up Python backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start the Flask server in the background
echo "Starting Flask server..."
python app.py &

# Wait for Flask server to start
sleep 2

# Return to root directory
cd ..

# Print instructions for manual frontend setup
echo "
Backend server is running at http://localhost:5000

To set up the frontend:
1. Install Node.js from https://nodejs.org
2. Open a new terminal and run:
   cd frontend
   npm install
   npm run dev

The frontend will be available at http://localhost:3000
" 