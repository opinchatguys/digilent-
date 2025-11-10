# API Testing Guide

This guide provides examples for testing all E-Commerce API endpoints using curl or any HTTP client (Postman, Thunder Client, etc.).

## Base URL
```
http://localhost:5000/api
```

---

## Product Endpoints

### 1. Get All Products
```bash
# Get all products (default pagination)
curl http://localhost:5000/api/products

# Get products with pagination
curl "http://localhost:5000/api/products?page=1&limit=5"

# Filter by category
curl "http://localhost:5000/api/products?category=Electronics"

# Sort by price (ascending)
curl "http://localhost:5000/api/products?sort=price&order=asc"

# Sort by price (descending)
curl "http://localhost:5000/api/products?sort=price&order=desc"

# Combined filters
curl "http://localhost:5000/api/products?category=Electronics&sort=price&order=asc&page=1&limit=10"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Wireless Bluetooth Headphones",
      "description": "...",
      "price": 99.99,
      "category": "Electronics",
      "imageUrl": "...",
      "stock": 50,
      "rating": 4.5,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 10,
    "itemsPerPage": 20
  }
}
```

---

### 2. Get Product by ID
```bash
# Replace {productId} with actual product ID from the database
curl http://localhost:5000/api/products/{productId}
```

**Expected Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Wireless Bluetooth Headphones",
    "description": "...",
    "price": 99.99,
    "category": "Electronics",
    "imageUrl": "...",
    "stock": 50,
    "rating": 4.5
  }
}
```

**Expected Response (Not Found):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 3. Create Product (Admin)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "A great new product",
    "price": 29.99,
    "category": "Electronics",
    "imageUrl": "https://example.com/image.jpg",
    "stock": 100
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "...",
    "name": "New Product",
    "price": 29.99,
    ...
  }
}
```

---

### 4. Update Product (Admin)
```bash
curl -X PUT http://localhost:5000/api/products/{productId} \
  -H "Content-Type: application/json" \
  -d '{
    "price": 24.99,
    "stock": 150
  }'
```

---

### 5. Delete Product (Admin)
```bash
curl -X DELETE http://localhost:5000/api/products/{productId}
```

---

## Cart Endpoints

### 1. Get Cart
```bash
curl http://localhost:5000/api/cart
```

**Expected Response (Empty Cart):**
```json
{
  "success": true,
  "data": {
    "items": [],
    "totalItems": 0,
    "subtotal": 0
  }
}
```

**Expected Response (With Items):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "...",
        "name": "Wireless Bluetooth Headphones",
        "price": 99.99,
        "imageUrl": "...",
        "quantity": 2,
        "subtotal": 199.98,
        "inStock": true
      }
    ],
    "totalItems": 2,
    "subtotal": 199.98
  }
}
```

---

### 2. Add Item to Cart
```bash
# Add product to cart (replace {productId} with actual ID)
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "{productId}",
    "quantity": 2
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "data": {
    "_id": "...",
    "sessionId": "defaultCart",
    "items": [
      {
        "productId": {
          "_id": "...",
          "name": "Wireless Bluetooth Headphones",
          "price": 99.99,
          ...
        },
        "quantity": 2
      }
    ]
  }
}
```

**Error Response (Insufficient Stock):**
```json
{
  "success": false,
  "message": "Insufficient stock available",
  "error": "Only 10 items available in stock"
}
```

---

### 3. Update Cart Item Quantity
```bash
# Update quantity of item in cart
curl -X PUT http://localhost:5000/api/cart/{productId} \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }'
```

---

### 4. Remove Item from Cart
```bash
# Remove item from cart
curl -X DELETE http://localhost:5000/api/cart/{productId}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    ...
  }
}
```

---

### 5. Clear Cart (Bonus)
```bash
# Clear all items from cart
curl -X DELETE http://localhost:5000/api/cart
```

---

## Testing Workflow

### Step-by-Step Testing Process

1. **Seed the Database**
   ```bash
   npm run seed
   ```

2. **Start the Server**
   ```bash
   npm run dev
   ```

3. **Get All Products**
   - Copy a product ID from the response

4. **Get Single Product**
   - Use the product ID to fetch details

5. **Add to Cart**
   - Add the product to cart with a specific quantity

6. **View Cart**
   - Check that the item appears in the cart

7. **Update Cart Item**
   - Change the quantity of the item

8. **Remove from Cart**
   - Remove the item from the cart

---

## Error Scenarios to Test

### Invalid Product ID
```bash
curl http://localhost:5000/api/products/invalid-id
```
**Response:** 400 Bad Request - "Invalid ID format"

### Product Not Found
```bash
curl http://localhost:5000/api/products/507f1f77bcf86cd799439011
```
**Response:** 404 Not Found - "Product not found"

### Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'
```
**Response:** 400 Bad Request - Validation error

### Insufficient Stock
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "{productId}",
    "quantity": 999999
  }'
```
**Response:** 400 Bad Request - "Insufficient stock available"

---

## Testing with Postman

1. Import the following as a Postman collection
2. Set base URL as environment variable: `{{baseUrl}} = http://localhost:5000/api`
3. Create requests for each endpoint
4. Use product IDs from GET requests in subsequent requests

---

## Health Check

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-11-10T..."
}
```
