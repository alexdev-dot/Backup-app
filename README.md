# GigaFix - Service Marketplace Application

A full-stack service marketplace platform that connects customers with service professionals. Built with modern web technologies to provide a seamless experience for booking services, posting jobs, and managing professional profiles.

## 🌟 Features

### For Customers
- **Service Discovery**: Browse and search for service professionals across various categories
- **Direct Booking**: Schedule appointments with professionals directly
- **Job Posting**: Post job requests and receive quotes from professionals
- **Messaging**: Real-time communication with professionals
- **Reviews & Ratings**: Rate and review professionals based on service quality
- **Payment Management**: Secure payment processing and transaction history

### For Professionals
- **Profile Management**: Create and manage professional profiles with service categories
- **Job Marketplace**: Browse and apply to posted jobs
- **Quote Management**: Send quotes to potential customers
- **Booking Management**: Manage scheduled appointments and availability
- **Earnings Tracking**: Monitor earnings and payment history
- **Review System**: Build reputation through customer reviews

### Platform Features
- **Authentication**: Secure JWT-based authentication system
- **Role-Based Access**: Distinct interfaces for customers and professionals
- **Real-time Messaging**: WebSocket-based messaging system
- **Secure Payments**: Integrated payment processing
- **Rating System**: 5-star rating and review system
- **Responsive Design**: Mobile-friendly interface using TailwindCSS

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting, bcrypt
- **Validation**: express-validator
- **Real-time**: WebSocket (ws)

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Hooks

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git

## 📁 Project Structure

```
GigaFixzipzip/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and server configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware (auth, security, error handling)
│   │   ├── models/          # Database models
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # Utility functions
│   │   ├── server.js        # Application entry point
│   │   └── setup-db.js      # Database setup script
│   ├── .env                 # Environment variables (not committed)
│   ├── .env.example         # Environment variable template
│   ├── package.json         # Backend dependencies
│   └── schema.sql           # Database schema
├── frontend/
│   ├── src/
│   │   ├── assets/          # Static assets
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   ├── AuthPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── SupportPage.tsx
│   │   │   ├── Customers/   # Customer-specific pages
│   │   │   └── Professionals/ # Professional-specific pages
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Application entry point
│   ├── .env                 # Environment variables (not committed)
│   ├── .env.example         # Environment variable template
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # TailwindCSS configuration
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (>=18.0.0)
- PostgreSQL database (Supabase recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alexdev-dot/Backup-app.git
   cd Backup-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   **Backend (.env):**
   ```env
   NODE_ENV=development
   PORT=3001
   
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   JWT_SECRET=your_long_random_secret_at_least_64_chars
   JWT_EXPIRES_IN=7d
   
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   
   CORS_ORIGIN=http://localhost:5173
   ```

   **Frontend (.env):**
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Set up the database**
   ```bash
   cd backend
   # Run the schema setup script
   node src/setup-db.js
   # Or manually execute schema.sql in your PostgreSQL database
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - Register a new account or log in with existing credentials

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

### Core Tables
- **users**: Stores user information (customers and professionals)
- **professionals**: Extended profile information for service professionals
- **services**: Available service categories and descriptions

### Booking & Jobs
- **bookings**: Scheduled service appointments
- **jobs**: Posted job requests from customers

### Communication
- **conversations**: Message threads between users
- **messages**: Individual messages within conversations

### Financial
- **payment_methods**: User payment method information
- **transactions**: Payment transaction records
- **invoices**: Billing invoices

### Reviews
- **reviews**: Customer reviews and ratings for professionals

### Key Relationships
- Users can be customers or professionals
- Professionals are linked to users via foreign key
- Bookings link customers to professionals for specific services
- Jobs are posted by customers and can receive multiple proposals
- Reviews are linked to both customers and professionals

## 🔌 API Documentation

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-domain.com/api`

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Main Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout

#### Users (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /account` - Delete user account

#### Professionals (`/api/professionals`)
- `GET /` - List all professionals
- `GET /:id` - Get professional details
- `POST /` - Create professional profile
- `PUT /:id` - Update professional profile

#### Bookings (`/api/bookings`)
- `GET /` - List user bookings
- `POST /` - Create new booking
- `PUT /:id` - Update booking
- `DELETE /:id` - Cancel booking

#### Jobs (`/api/jobs`)
- `GET /` - List all jobs
- `POST /` - Post new job
- `PUT /:id` - Update job
- `DELETE /:id` - Delete job

#### Messages (`/api/messages`)
- `GET /conversations` - List user conversations
- `GET /conversations/:id` - Get conversation messages
- `POST /messages` - Send new message

#### Payments (`/api/payments`)
- `GET /transactions` - List user transactions
- `POST /process` - Process payment
- `GET /methods` - List payment methods

#### Reviews (`/api/reviews`)
- `GET /:professionalId` - Get professional reviews
- `POST /` - Submit new review

#### Services (`/api/services`)
- `GET /` - List all services
- `GET /:id` - Get service details

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **Input Validation**: Request validation using express-validator
- **SQL Injection Prevention**: Parameterized queries via pg library

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Customer dashboard functionality
- [ ] Professional dashboard functionality
- [ ] Service booking flow
- [ ] Job posting and application
- [ ] Messaging system
- [ ] Payment processing
- [ ] Review submission

### API Testing
Use tools like Postman or cURL to test API endpoints:
```bash
# Example: Login endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## 📝 Development Guidelines

### Code Style
- Follow existing code conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Git Workflow
1. Create a new branch for features
2. Commit changes with descriptive messages
3. Push to remote repository
4. Create pull request for review

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- Keep secrets secure and rotate regularly

### Database Changes
- Document schema changes in `schema.sql`
- Use migrations for production changes
- Test changes in development first

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check if port 3001 is available
- Verify environment variables are set
- Ensure database connection is working

**Frontend build errors**
- Clear node_modules and reinstall
- Check TypeScript configuration
- Verify all dependencies are installed

**Database connection issues**
- Verify Supabase credentials
- Check database is accessible
- Ensure schema is properly set up

**Authentication failures**
- Verify JWT secret is set
- Check token expiration
- Ensure user exists in database

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Contact the development team
- Check existing documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - User authentication
  - Service booking
  - Job posting
  - Messaging system
  - Payment processing
  - Review system

---

Built with ❤️ for the service marketplace community
