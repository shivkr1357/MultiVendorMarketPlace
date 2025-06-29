# Marketplace Frontend

A modern, responsive customer web application for the multi-vendor marketplace built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Firebase Authentication** - Secure login/register with email/password
- 🛍️ **Product Browsing** - Browse products with search and filtering
- 🛒 **Shopping Cart** - Add/remove items from cart
- 👤 **User Profile** - Manage account and preferences
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Built with Vite for optimal development experience

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Authentication and backend services
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **Zustand** - State management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your Firebase configuration in `.env`:

   ```env
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation bar
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Products.tsx    # Products listing
│   ├── ProductDetail.tsx # Product details
│   ├── Cart.tsx        # Shopping cart
│   └── Profile.tsx     # User profile
├── config/             # Configuration files
│   └── firebase.ts     # Firebase setup
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Copy your Firebase config to `.env` file
4. (Optional) Set up Firestore for additional features

## API Integration

The frontend is configured to proxy API requests to the backend gateway at `http://localhost:3000`. Make sure your backend services are running.

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
