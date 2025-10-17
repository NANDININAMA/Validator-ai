# 🚀 Startup Validator

A comprehensive web application for validating and scoring startup ideas. Entrepreneurs can submit their ideas and receive automated scoring and feedback, while admins can manage and review all submissions.

## ✨ Features

### For Entrepreneurs
- **User Authentication**: Secure signup/login with JWT tokens
- **Idea Submission**: Submit startup ideas with detailed information
- **Automated Scoring**: AI-powered scoring system (0-100 scale)
- **Idea Classification**: Automatic classification (Low/Moderate/High potential)
- **Dashboard**: View all submitted ideas with scores and feedback
- **Modern UI**: Clean, responsive design with intuitive user experience

### For Admins
- **Admin Dashboard**: Manage all user submissions
- **User Management**: View and manage entrepreneur accounts
- **Analytics**: Track idea submissions and scoring trends

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Framework**: Express.js with MongoDB
- **Authentication**: JWT-based with bcrypt password hashing
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API with proper error handling
- **Scoring**: Automated text analysis and scoring algorithm

### Frontend (React/Vite)
- **Framework**: React 18 with Vite
- **Styling**: Custom CSS with modern design system
- **State Management**: React hooks for local state
- **API Integration**: Axios-like fetch API calls
- **Responsive**: Mobile-first responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd startup-validator
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend_original
   npm install
   ```

4. **Setup Environment Variables**
   
   Create a `.env` file in the Backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/startup-validator
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   PORT=5001
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGO_URI in .env file
   ```

6. **Start the Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```
   Server will run on http://localhost:5001

7. **Start the Frontend Server**
   ```bash
   cd frontend_original
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## 📱 Usage

### For Entrepreneurs

1. **Sign Up**: Create an account with your email and password
2. **Login**: Access your dashboard
3. **Submit Ideas**: Click "New Idea" to submit your startup concept
4. **View Results**: See your idea's score and classification
5. **Track Progress**: Monitor all your submitted ideas

### Idea Submission Form

- **Problem**: What problem are you solving?
- **Solution**: What's your product/service solution?
- **Market**: Who are your target customers?
- **Revenue Model**: How will you make money?
- **Team**: Tell us about your team

### For Admins

1. **Admin Access**: Sign up with an email ending in `@admin.com`
2. **Dashboard**: Access admin panel to manage all submissions
3. **User Management**: View and manage entrepreneur accounts
4. **Analytics**: Track submission trends and scoring patterns

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Ideas
- `POST /api/ideas` - Create new idea (requires auth)
- `GET /api/ideas` - Get user's ideas (requires auth)
- `GET /api/ideas/:id` - Get specific idea (requires auth)
- `GET /api/ideas/:id/export` - Export idea to PDF (requires auth)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/ideas` - Get all ideas (admin only)

## 🎨 UI/UX Features

### Modern Design System
- **Color Palette**: Professional blue and gray scheme
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle depth with box shadows
- **Animations**: Smooth transitions and hover effects

### Responsive Layout
- **Mobile First**: Optimized for mobile devices
- **Grid System**: Flexible grid for idea cards
- **Breakpoints**: Responsive design for all screen sizes

### User Experience
- **Loading States**: Clear feedback during API calls
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation with helpful messages
- **Empty States**: Encouraging messages for new users

## 🧪 Scoring Algorithm

The scoring system evaluates ideas based on:

1. **Problem Definition** (25% weight)
   - Clarity and specificity of the problem
   - Market need validation

2. **Solution Quality** (25% weight)
   - Innovation and uniqueness
   - Feasibility and implementation

3. **Market Analysis** (20% weight)
   - Target market size and accessibility
   - Competitive landscape understanding

4. **Revenue Model** (15% weight)
   - Monetization strategy clarity
   - Revenue potential assessment

5. **Team Capability** (15% weight)
   - Team expertise and experience
   - Execution capability

**Scoring Scale:**
- 0-39: Low Potential
- 40-69: Moderate Potential  
- 70-100: High Potential

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for frontend domain
- **Error Handling**: Secure error messages without data leaks

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Railway, or similar platform
4. Update CORS settings for production domain

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Update API endpoints to production URLs

## 🛠️ Development

### Project Structure
```
startup-validator/
├── Backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # API route handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── tests/           # Backend tests
├── frontend_original/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/     # API service functions
│   │   └── styles/       # CSS styles
│   └── public/          # Static assets
└── README.md
```

### Adding New Features

1. **Backend**: Add new routes in `routes/`, controllers in `controllers/`
2. **Frontend**: Create components in `src/components/`
3. **Styling**: Add CSS in `src/App.css`
4. **Testing**: Add tests in respective test directories

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ for entrepreneurs and startup enthusiasts**
