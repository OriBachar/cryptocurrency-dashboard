# Cryptocurrency Dashboard API

A robust, real-time cryptocurrency tracking and analysis platform powered by advanced AI insights.

## Overview

The Cryptocurrency Dashboard API provides a comprehensive solution for tracking and analyzing cryptocurrency markets in real-time. Built with enterprise-grade technologies, it combines powerful market data from CoinGecko with AI-driven analysis through Google Gemini to deliver actionable insights for cryptocurrency traders and enthusiasts.

### Key Features

- Real-time cryptocurrency market data tracking
- Secure user authentication and authorization
- Personalized cryptocurrency watchlists
- AI-powered market analysis and predictions
- RESTful API architecture

## Technology Stack

### Core Technologies
- **Runtime**: Node.js (v16+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)

### External Services
- CoinGecko API for market data
- Google Gemini AI for market analysis
- MongoDB Atlas (optional for cloud deployment)

## Getting Started

### Prerequisites

1. Node.js (v16 or higher)
2. MongoDB (v4.4 or higher)
3. npm or yarn package manager
4. API Keys:
   - CoinGecko API key
   - Google Gemini API key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://127.0.0.1:27017
   DB_NAME=cryptocurrency-db

   # Authentication
   JWT_SECRET=your_jwt_secret

   # External APIs
   COINGECKO_API_KEY=your_coingecko_key
   GEMINI_API_KEY=your_gemini_key

   # Server Configuration
   PORT=3000
   ```

### Development

```bash
# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Documentation

### Authentication Endpoints

#### User Management
- **POST** `/api/auth/register`
  - Register a new user
  - Required fields: `email`, `password`
  - Returns: User object with JWT token

- **POST** `/api/auth/login`
  - Authenticate existing user
  - Required fields: `email`, `password`
  - Returns: JWT token and user data

### Cryptocurrency Endpoints

#### Market Data
- **GET** `/api/cryptos`
  - List all cryptocurrencies
  - Query parameters:
    - `page`: Page number (default: 1)
    - `limit`: Results per page (default: 20)
    - `sort`: Sort field (default: 'marketCap')

- **GET** `/api/cryptos/:id`
  - Get detailed information for a specific cryptocurrency
  - URL parameters:
    - `id`: Cryptocurrency identifier

- **POST** `/api/cryptos/refresh`
  - Force refresh of cryptocurrency data
  - Requires authentication
  - Rate limited to 1 request per minute

#### Watchlist Management
- **GET** `/api/watchlist`
  - Retrieve user's watchlist
  - Requires authentication

- **POST** `/api/watchlist`
  - Add cryptocurrency to watchlist
  - Required fields: `cryptoId`
  - Requires authentication

- **DELETE** `/api/watchlist/:cryptoId`
  - Remove cryptocurrency from watchlist
  - Requires authentication

#### AI Analysis
- **GET** `/api/analysis/crypto/:id`
  - Get AI-powered analysis for specific cryptocurrency
  - Includes:
    - Price predictions
    - Market sentiment
    - Technical indicators
    - Trading recommendations

## Data Models

### Cryptocurrency Schema
```typescript
{
  id: string;            // Unique identifier
  name: string;          // Full name
  symbol: string;        // Trading symbol
  currentPrice: number;  // Current price in USD
  marketCap: number;     // Market capitalization
  priceChange24h: number; // 24h price change
  imageUrl: string;      // Logo URL
  lastUpdated: Date;     // Last data update timestamp
}
```

### User Schema
```typescript
{
  email: string;         // User email (unique)
  password: string;      // Hashed password
  watchlist: string[];   // Array of crypto IDs
  token: string;         // JWT token
  createdAt: Date;      // Account creation date
  lastLogin: Date;      // Last login timestamp
  preferences: {         // User preferences
    currency: string;    // Preferred currency
    notifications: boolean; // Notification settings
  }
}
```

## Error Handling

The API uses standardized error responses:

```typescript
{
  status: number;        // HTTP status code
  message: string;       // Error message
  code: string;         // Error code
  details?: any;        // Additional error details
}
```
