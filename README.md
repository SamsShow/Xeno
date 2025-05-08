# Mini CRM Platform

A modern Customer Relationship Management (CRM) platform that enables customer segmentation, personalized campaign delivery, and intelligent insights using AI-powered features.

## Project Overview

This Mini CRM Platform is designed to handle customer data, create targeted campaigns, and deliver personalized messages while providing intelligent insights through AI integration.

## Core Features

### 1. Data Ingestion APIs

- Secure REST APIs for customer and order data ingestion
- API documentation using Postman/Swagger UI
- Optional: Pub-sub architecture using message broker (Kafka/RabbitMQ/Redis Streams)
  - API layer for validation
  - Asynchronous data persistence via consumer service

### 2. Campaign Creation UI

- Dynamic audience segmentation with flexible rule logic
- Rule builder supporting AND/OR conditions
- Audience size preview functionality
- Campaign history dashboard showing:
  - Past campaigns list
  - Delivery statistics (sent, failed, audience size)
  - Chronological campaign display

### 3. Campaign Delivery & Logging

- Campaign initiation on segment save
- Communication log storage
- Personalized message delivery via vendor API
- Delivery receipt handling
- Batch processing for delivery status updates

### 4. Authentication

- Google OAuth 2.0 integration
- Protected routes for campaign creation and viewing

### 5. AI Integration Features

1. Natural Language to Segment Rules

   - Convert natural language prompts to logical rules
   - Example: "People who haven't shopped in 6 months and spent over ₹5K"

2. AI-Driven Message Suggestions

   - Generate message variants based on campaign objectives
   - Optional: Product/offer image recommendations

3. Campaign Performance Summarization

   - Human-readable insights and statistics
   - Delivery rate analysis by customer segments

4. Smart Scheduling Suggestions

   - AI-powered campaign timing recommendations
   - Based on customer activity patterns

5. Audience Lookalike Generator

   - Suggest similar audiences based on high-performing segments

6. Auto-tagging Campaigns
   - AI-based campaign categorization
   - Intent-based labeling

## Tech Stack

### Frontend

- Next.js/React.js
- Modern UI components
- Responsive design

### Backend

- Node.js/Spring Boot
- RESTful APIs
- Message broker integration (optional)

### Database

- MySQL/MongoDB
- Efficient data modeling
- Optimized queries

### Additional Tools

- Message Broker: Kafka/RabbitMQ/Redis Streams (optional)
- AI Services: OpenAI, Google Vertex AI, Replicate, etc.
- Image APIs for personalization

## Project Structure

```
xeno/
├── src/                    # Frontend application
│   ├── assets/            # Static assets and images
│   ├── components/        # Reusable React components
│   ├── pages/            # Next.js pages and routing
│   ├── styles/           # Global styles and CSS modules
│   ├── utils/            # Helper functions and utilities
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context providers
│   ├── types/            # TypeScript type definitions
│   ├── services/         # API service calls
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Entry point
│   ├── App.css           # App styles
│   └── index.css         # Global styles
│
├── backend/               # Node.js backend application
│   ├── src/              # Source code
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Custom middleware
│   │   ├── utils/        # Helper functions
│   │   ├── config/       # Configuration files
│   │   └── types/        # TypeScript type definitions
│   ├── tests/            # Backend tests
│   ├── .env              # Environment variables
│   ├── tsconfig.json     # TypeScript configuration
│   └── package.json      # Backend dependencies
│
├── .gitignore
└── README.md
```

## Getting Started

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run development server
5. Access the application

## Evaluation Criteria

The project will be evaluated based on:

- Code quality and project structure
- Creative problem solving and clean UX
- Scalability (especially in ingestion & delivery flows)
- AI integration and thoughtful use of tools
- Completeness of solution
- Documentation and communication

## Important Notes

- All work must be original
- Plagiarism is strictly prohibited
- Be prepared to discuss implementation decisions during interviews
- Focus on clean, maintainable code
- Prioritize user experience and performance

## License

[Specify License]

## Contact

[Your Contact Information]
