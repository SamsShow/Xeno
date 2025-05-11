# Xeno CRM

Xeno is a modern CRM application designed to help businesses manage their customer relationships, marketing campaigns, and communications.

## Features

- **Authentication with Google OAuth 2.0**: Secure login process with Google account integration
- **Customer Management**: Store and manage customer data with comprehensive profiles
- **Campaign Management**: Create, manage, and track marketing campaigns
- **Communication Tracking**: Log and analyze customer communications
- **AI Integration**: Powered by Google's Gemini AI for message suggestions and campaign insights

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL
- **Authentication**: Passport.js with Google OAuth 2.0
- **AI Integration**: Google Gemini API

## Prerequisites

- Node.js (v18+)
- MySQL
- Google OAuth credentials (for authentication)
- Google Gemini API key (for AI features)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/xeno.git
   cd xeno
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend` directory with the following variables:

   ```
   # Server configuration
   PORT=3000
   NODE_ENV=development

   # MySQL Database Configuration
   DB_NAME=xeno
   DB_USER=root
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=3306

   # Authentication
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FRONTEND_URL=http://localhost:5173
   TOKEN_EXPIRY=7d

   # AI Integration
   GEMINI_API_KEY=your_gemini_api_key

   # Optional RabbitMQ configuration
   ENABLE_RABBITMQ=false
   ```

4. **Set up MySQL database**

   Create a new MySQL database:

   ```sql
   CREATE DATABASE xeno;
   ```

   Initialize the database with sample data:

   ```bash
   npm run db:init
   ```

## Running the Application

You can run both the frontend and backend concurrently:

```bash
npm run start
```

Or run them separately:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs

## Building for Production

```bash
npm run build:all
```

## API Documentation

The API documentation is available at `/api-docs` when the server is running. It's generated using Swagger and provides detailed information about all available endpoints.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
