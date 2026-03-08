# WebVibes Technology - Frontend

This is the Angular frontend application for the WebVibes Technology website.

## Technology Stack

- Angular 15+
- TypeScript
- Bootstrap 5
- RxJS

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/     # Angular components
│   │   ├── services/       # Angular services for API communication
│   │   ├── app.component.* # Root component
│   │   ├── app.module.ts   # Root module
│   │   └── app-routing.module.ts # Routing configuration
│   ├── assets/             # Static assets (images, etc.)
│   ├── index.html          # Main HTML file
│   ├── main.ts             # Application entry point
│   └── styles.css          # Global styles
├── angular.json            # Angular CLI configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Build the project for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

Run unit tests:
```bash
npm test
```

## Backend API

The frontend communicates with the Spring Boot backend API running at `http://localhost:8080`.

Make sure the backend server is running before starting the frontend application.

## Features

- Home page with hero section
- About page with company information
- Internship application page
- Course catalog and enrollment
- Student projects showcase
- Contact form
- Responsive design for mobile, tablet, and desktop
