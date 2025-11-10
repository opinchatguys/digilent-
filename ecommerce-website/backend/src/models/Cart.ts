import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    userId?: string;
    sessionId?: string;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        default: 1,
    },
});

const CartSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            sparse: true, // Allows null for guest users
        },
        sessionId: {
            type: String,
            sparse: true,
        },
        items: {
            type: [CartItemSchema],
            default: [],
            validate: {
                validator: function (items: ICartItem[]) {
                    // Ensure no duplicate products in cart
                    const productIds = items.map(item => item.productId.toString());
                    return productIds.length === new Set(productIds).size;
                },
                message: 'Cart cannot contain duplicate products',
            },
        },
    },
    {
        timestamps: true,
    }
);

// Ensure either userId or sessionId is provided
CartSchema.index({ userId: 1 }, { unique: true, sparse: true });
CartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });

// Validate that at least one identifier exists
CartSchema.pre('save', function (next) {
    if (!this.userId && !this.sessionId) {
        next(new Error('Either userId or sessionId must be provided'));
    } else {
        next();
    }
});

export default mongoose.model<ICart>('Cart', CartSchema);
