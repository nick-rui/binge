# Binge - Food Discovery App

A web application for discovering and saving your favorite restaurant dishes through an interactive swipe interface.

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js and npm (Download from https://nodejs.org)
- Git

## Project Structure

```
binge/
├── backend/         # Flask backend
│   ├── app.py
│   └── requirements.txt
└── frontend/        # React frontend
    └── (React files will be here)
```

## Setup Instructions

### Backend Setup

1. Create and activate a Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```bash
   python app.py
   ```
   The backend will run on http://localhost:5000

### Frontend Setup

1. Install Node.js from https://nodejs.org (LTS version recommended)

2. Set up the React project:
   ```bash
   cd frontend
   npm create vite@latest . -- --template react-ts
   npm install
   ```

3. Install required dependencies:
   ```bash
   npm install axios @react-spring/web react-tinder-card tailwindcss postcss autoprefixer
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5000

## Features

- Interactive card swiping interface
- Restaurant dish discovery
- Save favorite restaurants
- View saved restaurants in a separate view
- Responsive design for both desktop and mobile

## Tech Stack

- Frontend:
  - React with TypeScript
  - Tailwind CSS
  - react-tinder-card for swipe interactions
  - axios for API requests

- Backend:
  - Flask
  - Flask-CORS
  - Python standard library
