# E-Commerce Backend API

Node.js/Express backend API for the E-Commerce platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Validation**: Express-validator

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # MongoDB connection
│   │   ├── env.ts       # Environment variables
│   │   └── cors.ts      # CORS configuration
│   ├── models/          # Mongoose models
│   │   ├── Product.ts
│   │   ├── Cart.ts
│   │   └── index.ts
│   ├── controllers/     # Route controllers
│   │   ├── productController.ts
│   │   └── index.ts
│   ├── routes/          # API routes
│   │   ├── productRoutes.ts
│   │   └── index.ts
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── utils/           # Utility functions
│   │   ├── helpers.ts
│   │   └── constants.ts
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── .env.example         # Example environment file
├── .gitignore
├── package.json
├── tsconfig.json
└── nodemon.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   
   Create a `.env` file in the backend directory:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   CORS_ORIGIN=http://localhost:3000
   ```

### Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check API status

### Products
- **GET** `/api/products` - Get all products (with pagination)
- **GET** `/api/products/:id` - Get single product by ID
- **POST** `/api/products` - Create new product (Admin)
- **PUT** `/api/products/:id` - Update product (Admin)
- **DELETE** `/api/products/:id` - Delete product (Admin)

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Database Models

### Product Model
```typescript
{
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: Review[];
  specifications: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}
```

### Cart Model
```typescript
{
  userId?: string;
  sessionId?: string;
  items: [{
    productId: ObjectId;
    quantity: number;
  }];
  createdAt: Date;
  updatedAt: Date;
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Error Handling

The API uses centralized error handling with custom error responses for:
- Validation errors (400)
- Resource not found (404)
- Server errors (500)
- Invalid ObjectId format (400)
- Duplicate entries (400)

## Development Notes

- All TypeScript files are in the `src/` directory
- Compiled JavaScript output goes to `dist/` directory
- Nodemon watches for changes in development mode
- MongoDB connection is established before server starts
- CORS is configured to accept requests from the frontend

## Testing

API endpoints can be tested using:
- Postman
- Thunder Client (VS Code extension)
- curl commands

Example curl request:
```bash
curl http://localhost:5000/api/health
```

## Next Steps

1. ✅ Basic server setup
2. ✅ MongoDB connection
3. ✅ Models defined
4. ✅ Routes structure
5. ⏳ Implement controller logic
6. ⏳ Add input validation
7. ⏳ Implement authentication
8. ⏳ Add seed data
9. ⏳ Write tests
10. ⏳ Deploy to production

## License

ISC
