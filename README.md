# bazar-blot
Online Bazar Blot game MVP with ASP.NET Core backend and React (Vite) frontend.

## Project Structure

### Backend (ASP.NET Core)
- **API Endpoints**: Authentication (JWT) and Product management
- **Database**: SQLite (development) / SQL Server (production)
- **Features**: 
  - User registration and login with JWT authentication
  - CRUD operations for products
  - Armenian language support
  - Swagger API documentation

### Frontend (React + Vite)
- **UI Framework**: Material-UI (MUI) for modern, responsive design
- **Features**:
  - Armenian language interface
  - Product listing with search and filtering
  - User authentication (login/register)
  - Add/Edit/Delete products (authenticated users)
  - Responsive design suitable for marketplace
  - JWT token management

## Quick Start

### Backend Setup
1. Ensure you have .NET 8.0 SDK installed
2. Navigate to the root directory
3. Run the following commands:
```bash
dotnet restore
dotnet build
dotnet run
```
4. Backend will be available at `https://localhost:7001`
5. Swagger documentation at `https://localhost:7001` (development mode)

### Frontend Setup
1. Ensure you have Node.js 18+ installed
2. Navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
3. Frontend will be available at `http://localhost:5173`

### Development Configuration
- Backend API URL can be configured in `frontend/.env` file
- Default configuration connects to `https://localhost:7001`
- CORS is pre-configured for local development

## Features

### Implemented Features
- ✅ User registration and authentication with JWT
- ✅ Product listing with image, name, price, description, date
- ✅ Product search and filtering by category, price range
- ✅ Add/Edit/Delete products (authenticated users only)
- ✅ Responsive design with Armenian language support
- ✅ Modern UI with Material-UI components

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products (with filtering)
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/{id}` - Update product (auth required)
- `DELETE /api/products/{id}` - Delete product (auth required)
- `GET /api/products/categories` - Get product categories

### Frontend Pages
- **Home** (`/`) - Product listing with search and filters
- **Authentication** (`/auth`) - Login and registration forms
- **Add Product** (`/products/add`) - Add new product (authenticated)
- **Edit Product** (`/products/edit/:id`) - Edit existing product (authenticated)

## Technology Stack

### Backend
- ASP.NET Core 8.0
- Entity Framework Core
- SQLite / SQL Server
- JWT Authentication
- Swagger/OpenAPI

### Frontend
- React 19
- Vite (build tool)
- Material-UI (MUI)
- React Router DOM
- Axios (HTTP client)
- Armenian language support

## Folder Structure

```
/
├── Controllers/          # API Controllers
├── Data/                # Database context and migrations
├── Models/              # Data models
├── Properties/          # Launch settings
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── api/         # API service layer
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React contexts
│   │   ├── utils/       # Utility functions
│   │   └── assets/      # Static assets
│   ├── public/          # Public assets
│   └── dist/            # Built frontend files
├── wwwroot/             # Static files for backend
└── README.md
```

## Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test both backend and frontend
5. Submit a pull request

## License

This project is licensed under the MIT License.
