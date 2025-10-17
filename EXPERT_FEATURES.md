# Expert Authentication & Dashboard

## Overview
Expert system for startup idea validation with role-based authentication and review capabilities.

## Features

### 🎯 Expert Dashboard
- **Profile Setup**: Create expert profile with specialization and experience
- **Idea Review**: Rate and review startup ideas (1-5 stars)
- **Review Tracking**: View all submitted reviews

### 👥 Admin Dashboard
- **Expert Management**: View and manage expert accounts
- **Analytics**: Basic statistics and expert performance tracking

### 🔧 Backend
- **Expert Authentication**: Role-based access control
- **Review System**: Multiple expert reviews per idea
- **API Endpoints**: REST API for expert operations

## User Roles

### 1. **Entrepreneur** (Default)
- Submit startup ideas
- View idea scores and feedback

### 2. **Expert**
- Create expert profile
- Review and rate ideas
- Track review history

### 3. **Admin**
- Manage ideas and experts
- View analytics

## API Endpoints

### Expert Routes (`/api/expert`)
- `GET /profile` - Get expert profile
- `POST /profile` - Create expert profile
- `PUT /profile` - Update expert profile
- `POST /ideas/:id/review` - Submit expert review
- `GET /my-reviews` - Get expert's reviews

## Database Schema

### Expert Model
```javascript
{
  user: ObjectId,
  specialization: String,
  experience: Number,
  bio: String,
  expertise: [String],
  rating: Number,
  totalReviews: Number,
  isActive: Boolean
}
```

### Idea Model Enhancement
```javascript
{
  expertReviews: [{
    expert: ObjectId,
    rating: Number, // 1-5
    review: String,
    feedback: String,
    createdAt: Date
  }],
  averageExpertRating: Number,
  totalExpertReviews: Number
}
```

## Setup

### Backend
```bash
cd startup-validator/Backend
npm install
npm start
```

### Frontend
```bash
cd startup-validator/frontend_original
npm install
npm run dev
```

### Expert Account
1. Register account
2. Complete expert profile
3. Start reviewing ideas

## Core Features

### Expert Profile
- Specialization and experience
- Bio and expertise areas

### Review Process
1. View submitted ideas
2. Rate ideas (1-5 stars)
3. Write reviews and feedback
4. Track review history

### Admin Analytics
- Total ideas and experts
- Review statistics
- Average ratings

## Authentication

### Security Features
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- Route-level security middleware

### Data Validation
- Rating constraints (1-5 stars)
- Required field validation
- Input sanitization

---

**Note**: Multiple experts can review the same ideas independently.
