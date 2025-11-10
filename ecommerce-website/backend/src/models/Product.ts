import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    images?: string[];
    stock: number;
    rating?: number;
    reviews?: IReview[];
    specifications?: Map<string, string>;
    createdAt: Date;
    updatedAt: Date;
    inStock: boolean;
}

interface IReview {
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Name cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
            validate: {
                validator: function (v: number) {
                    return /^\d+(\.\d{1,2})?$/.test(v.toString());
                },
                message: 'Price must have at most 2 decimal places',
            },
        },
        category: {
            type: String,
            required: [true, 'Product category is required'],
            enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'],
            default: 'Other',
        },
        imageUrl: {
            type: String,
            required: [true, 'Product image URL is required'],
            validate: {
                validator: function (v: string) {
                    return /^https?:\/\/.+/.test(v);
                },
                message: 'Please provide a valid URL',
            },
        },
        images: {
            type: [String],
            default: [],
        },
        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        reviews: {
            type: [
                {
                    userId: { type: String, required: true },
                    userName: { type: String, required: true },
                    rating: { type: Number, required: true, min: 1, max: 5 },
                    comment: { type: String, maxlength: 500 },
                    createdAt: { type: Date, default: Date.now },
                },
            ],
            default: [],
        },
        specifications: {
            type: Map,
            of: String,
            default: {},
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

// Virtual for availability status
ProductSchema.virtual('inStock').get(function (this: IProduct) {
    return this.stock > 0;
});

export default mongoose.model<IProduct>('Product', ProductSchema);
