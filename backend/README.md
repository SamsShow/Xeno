# Xeno Data Ingestion API

A scalable and secure API for ingesting customer and order data with asynchronous processing built with Node.js, TypeScript, Express, MongoDB, and RabbitMQ.

## Features

- **Secure REST APIs** for customer and order data ingestion
- **Pub-Sub Architecture** using RabbitMQ for asynchronous data processing
- **Batch Processing** for efficient database operations
- **Validation** with express-validator
- **Swagger Documentation** for easy API testing and exploration
- **MongoDB** for data persistence

## Architecture

The system follows a pub-sub architecture:

1. API Layer:

   - Validates incoming data
   - Publishes validated data to message queues
   - Returns immediate response to client

2. Consumer Layer:
   - Consumes messages from the queues
   - Processes data in batches
   - Persists data to MongoDB

## Prerequisites

- Node.js (v14+)
- MongoDB
- RabbitMQ

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/xeno-backend.git
cd xeno-backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

   Create a `.env` file with the following variables:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/xenodb
RABBITMQ_URL=amqp://localhost
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:5000/api-docs
```

## API Endpoints

### Customers

- **POST /api/customers** - Add a new customer
- **POST /api/customers/bulk** - Add multiple customers
- **GET /api/customers** - Get all customers (with pagination)
- **GET /api/customers/:id** - Get customer by ID
- **PUT /api/customers/:id** - Update customer
- **DELETE /api/customers/:id** - Delete customer

### Orders

- **POST /api/orders** - Add a new order
- **POST /api/orders/bulk** - Add multiple orders
- **GET /api/orders** - Get all orders (with pagination)
- **GET /api/orders/:id** - Get order by ID
- **GET /api/orders/customer/:customerId** - Get orders by customer ID
- **PUT /api/orders/:id** - Update order
- **DELETE /api/orders/:id** - Delete order

## Asynchronous Processing

The system uses RabbitMQ for message queuing:

1. When data is received via the API, it is validated and published to a queue.
2. Consumer services process these messages in batches for efficient database operations.
3. This pattern allows for:
   - Immediate response to the client
   - Scalable processing
   - Resilience to spikes in traffic

## Data Models

### Customer

- name (required)
- email (required, unique)
- phone (required)
- dateOfBirth (optional)
- address (optional)
- tags (optional)
- metadata (optional)

### Order

- customerId (required)
- items (required)
- totalAmount (required)
- status ('pending', 'processing', 'completed', 'cancelled')
- paymentMethod (required)
- paymentStatus ('unpaid', 'paid', 'refunded')
- shippingAddress (optional)
- metadata (optional)

## Running with Docker (Future Enhancement)

```bash
docker-compose up -d
```

This will start:

- MongoDB
- RabbitMQ
- The API service

## Testing

```bash
npm test
```
