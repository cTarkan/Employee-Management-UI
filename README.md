# Employee Management System

A simple web application to manage employee information.

## What This App Does

- View a list of all employees
- Add new employees
- Edit existing employee details
- Delete employees
- Store employee data locally in your browser

## Employee Information

Each employee record includes:
- First Name
- Last Name
- Date of Employment
- Date of Birth
- Phone Number
- Email
- Department (Tech, Analytics, HR, or Marketing)
- Position (Senior, Medior, or Junior)

## How to Use

1. Open the application in your web browser
2. You'll see a list of employees
3. Use the buttons to:
   - Add new employees
   - Edit existing employees
   - Delete employees

## Technical Details

- The app uses your browser's local storage to save data
- Initial data includes 20 sample employees
- All changes are saved automatically

## Project Structure and Technologies

- **Frontend**: React.js with modern hooks and functional components
- **State Management**: React Context API for global state
- **Styling**: CSS with responsive design
- **Data Storage**: Browser's localStorage for persistence
- **Testing**: Jest and React Testing Library for unit tests
- **Build Tool**: Create React App

Project Structure:
```
src/
├── components/     # React components
├── services/      # Data and business logic
├── data/         # Initial data and constants
├── styles/       # CSS files
└── tests/        # Test files
```

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the application: `npm run dev`
4. Open your browser and go to `http://localhost:3000`

## Testing

Run the test suite:
```bash
npm test
```

This will:
- Run all unit tests
- Show test coverage
- Watch for changes during development

Key test areas:
- Employee data operations (add, edit, delete)
- Component rendering
- User interactions
- Data validation 
