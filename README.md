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
- AWS infrastructure for scalable deployment and file storage

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
- AWS Services:
  - Amazon EC2 for application hosting
  - Amazon S3 for file storage
  - AWS SDK for infrastructure management

## Getting Started

### Prerequisites

1. Node.js (v16 or higher)
2. MongoDB (v4.4 or higher)
3. npm or yarn package manager
4. API Keys:
   - CoinGecko API key
   - Google Gemini API key
   - AWS Access Key ID and Secret Access Key

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

   # AWS Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET=your_s3_bucket_name

   # Server Configuration
   PORT=3000

   # Github repo url
   GITHUB_REPO_URL=your_github_repo_url
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

## AWS Infrastructure

### S3 Service

The application uses Amazon S3 for file storage and management. The following operations are supported:

- File upload with public/private access control
- File deletion
- Generating signed URLs for temporary file access
- Bucket management

Example usage:

```typescript
import { uploadToS3, getSignedUrl } from "./awsService";

// Upload file
const fileUrl = await uploadToS3({
  file: fileBuffer,
  fileName: "example.jpg",
  contentType: "image/jpeg",
  bucketName: "your-bucket"
});

// Generate temporary access URL
const signedUrl = await getSignedUrl("your-bucket", "example.jpg", 3600);
```

### EC2 Deployment

The application can be automatically deployed to Amazon EC2 instances. The deployment process includes:

- Instance launch with customizable configurations
- Automatic setup of Node.js environment
- Application code deployment
- Environment configuration
- Instance management (start/stop/status monitoring)

Example deployment:

```typescript
import { deployEC2 } from "./script/deployEC2";

// Launch new EC2 instance with application
const instanceId = await deployEC2();
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
  id: string; // Unique identifier
  name: string; // Full name
  symbol: string; // Trading symbol
  currentPrice: number; // Current price in USD
  marketCap: number; // Market capitalization
  priceChange24h: number; // 24h price change
  imageUrl: string; // Logo URL
  lastUpdated: Date; // Last data update timestamp
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

## AWS Service Types

### EC2 Instance Parameters

```typescript
{
  imageId: string;            // AMI ID
  instanceType: string;       // EC2 instance type
  minCount: number;          // Minimum instances to launch
  maxCount: number;          // Maximum instances to launch
  keyName?: string;          // SSH key pair name
  securityGroupIds?: string[]; // Security group IDs
  userData: string;          // Instance initialization script
  tags?: {                   // Instance tags
    Key: string;
    Value: string;
  }[];
}
```

### Upload Parameters

```typescript
{
  file: Buffer;              // File buffer
  fileName: string;          // Target file name
  contentType: string;       // File MIME type
  bucketName: string;        // S3 bucket name
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

## AWS Service Health Check

The application includes a health check endpoint for AWS services:

```typescript
const awsHealth = await checkAWSServices();
if (!awsHealth) {
  console.error("AWS services are not responding");
}
```
