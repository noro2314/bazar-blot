# Բազար Բլոտ Frontend

React-based frontend application for Bazar Blot marketplace with Armenian language support.

## Features

- 🏠 **Product Listing**: Browse products with search and filtering
- 🔐 **Authentication**: Login and registration with JWT
- ➕ **Product Management**: Add, edit, and delete products
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🇦🇲 **Armenian Language**: Full Armenian language interface
- 🎨 **Modern UI**: Material-UI components for clean design

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env file to set VITE_API_URL to your backend URL
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/                 # API service layer
│   ├── auth.js         # Authentication API
│   ├── products.js     # Products API
│   ├── client.js       # Axios configuration
│   └── config.js       # API configuration
├── components/         # Reusable components
│   ├── Layout/         # Main layout component
│   ├── ProductCard/    # Product display card
│   ├── ProductForm/    # Add/edit product form
│   └── AuthForm/       # Login/register form
├── pages/              # Page components
│   ├── Home/           # Product listing page
│   ├── Auth/           # Authentication page
│   └── Products/       # Product management pages
├── context/            # React contexts
│   └── AuthContext.jsx # Authentication state management
├── utils/              # Utility functions
│   └── ProtectedRoute.jsx # Route protection
└── assets/             # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Configuration

The application connects to the backend API. Configure the API URL in `.env`:

```env
VITE_API_URL=https://localhost:7001
```

## Technology Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Material-UI** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## Features Overview

### Authentication
- User registration with email validation
- Login with email and password
- JWT token management
- Automatic token refresh
- Protected routes

### Product Management
- View all products with pagination
- Search products by name and description
- Filter by category and price range
- Add new products (authenticated users)
- Edit own products
- Delete own products
- Image upload support

### User Interface
- Responsive design for all screen sizes
- Armenian language throughout the interface
- Loading states and error handling
- Form validation
- Confirmation dialogs

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://localhost:7001` |

## Contributing

1. Follow Armenian language conventions for user-facing text
2. Use Material-UI components consistently
3. Maintain responsive design principles
4. Add proper error handling
5. Include loading states for async operations

## License

MIT License
