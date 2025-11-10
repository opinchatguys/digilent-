##  Features

-  **Modern Glassmorphism UI** - Stunning gradient backgrounds with frosted glass effects
-  **Product Catalog** - Browse products with beautiful cards and smooth animations
-  **Shopping Cart** - Add, remove, and manage cart items with localStorage persistence
-  **Responsive Design** - Mobile-first design that works on all devices
-  **Fast Performance** - Built with Next.js 16 and Turbopack for blazing fast development
-  **TypeScript** - Full type safety across frontend and backend
-  **Mock Data Fallback** - Works without backend for immediate testing
-  **Cart Persistence** - Cart data saved to localStorage, survives page refreshes

## Tech Stack

### Frontend
- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Context API** - Global state management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM

##  Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- MongoDB Atlas account (optional, mock data available)

### Frontend Setup

1. **Clone the repository**
```bash
cd ecommerce-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

### Backend Setup (Optional)

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
CORS_ORIGIN=http://localhost:3000
```

4. **Run the backend server**
```bash
npm run dev
```

5. **Seed the database (optional)**
```bash
npm run seed
```

##  Usage

### Running the Full Application

**Terminal 1 - Frontend:**
```bash
cd ecommerce-website
npm run dev
```

**Terminal 2 - Backend (Optional):**
```bash
cd ecommerce-website/backend
npm run dev
```

### Without Backend
The application works perfectly without the backend using mock data:
- 8 sample products available
- Full shopping cart functionality
- All UI features operational

##  Project Structure

```
ecommerce-website/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── products/            # Products pages
│   ├── cart/                # Cart page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── layout/              # Layout components (Navbar)
│   ├── products/            # Product components
│   └── cart/                # Cart components
├── context/                 # React Context providers
│   └── CartContext.tsx      # Shopping cart state
├── lib/                     # Utilities
│   ├── api.ts               # API endpoints
│   └── fetchHelpers.ts      # API helper functions
├── types/                   # TypeScript types
│   └── product.ts           # Product types
└── backend/                 # Express backend
    ├── src/
    │   ├── controllers/     # Route controllers
    │   ├── models/          # Mongoose models
    │   ├── routes/          # API routes
    │   ├── config/          # Configuration
    │   └── server.ts        # Server entry point
    └── package.json
```

## UI Features

### Glassmorphism Design
- Semi-transparent cards with backdrop blur
- Vibrant purple-to-pink gradient background
- Frosted glass effects throughout
- Smooth animations and transitions

### Interactive Elements
- Hover effects on all interactive elements
- Scale and lift animations on cards
- Gradient buttons with active states
- Mobile-responsive navigation menu

### Shopping Cart
- Real-time cart updates
- Quantity controls with validation
- Stock level indicators
- Persistent storage across sessions

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript
- `npm run seed` - Seed database with sample products

## Pages

- **Home (/)** - Product catalog with grid layout
- **/products** - Full product listing
- **/products/[id]** - Individual product details
- **/cart** - Shopping cart and checkout

##  API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear entire cart

## Key Features Explained

### Mock Data Fallback
The application automatically uses mock data if the backend is unavailable:
- 8 pre-defined products with real images
- Seamless fallback mechanism
- No configuration needed

### Cart Persistence
Shopping cart data is saved to browser localStorage:
- Survives page refreshes
- Works offline
- No login required

### Type Safety
Full TypeScript implementation:
- Type-safe API calls
- Validated data structures
- IDE autocomplete support

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)
```bash
cd backend
npm run build
# Deploy to your preferred platform
```

## License

This project is open source and available under the MIT License.

##  Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- UI inspiration from modern e-commerce platforms



**Made with ❤️ using Next.js and TypeScript**
