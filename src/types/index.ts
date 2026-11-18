export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'FCFA';

export interface Currency {
    code: CurrencyCode;
    symbol: string;
    rate: number; // relative to USD
}

export interface ProductTheme {
    background: string;
    surface: string;
    accent: string;
    title: string;
    text: string;
    glow: string;
}

export interface ProductAppreciation {
    id: string;
    author: string;
    rating: number;
    quote: string;
    highlight: string;
}

export interface ProductComment {
    id: string;
    user: string;
    chapter: string;
    text: string;
    rating: number;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    brand: string;
    price: number; // in USD
    originalPrice?: number;
    rating: number;
    reviewsCount: number;
    images: string[];
    backgroundImage?: string;
    theme?: ProductTheme;
    preview?: string;
    relatedBookIds?: string[];
    userAppreciations?: ProductAppreciation[];
    comments?: ProductComment[];
    colors: { name: string; hex: string }[];
    description: string;
    specifications: string;
    isNewIn?: boolean;
    isBestSeller?: boolean;
    isHidden?: boolean;
    productType?: string;
    ebookStoragePath?: string;
    ebookFormat?: 'pdf' | 'html' | 'json';
}

export interface CartItem {
    product: Product;
    selectedColor: { name: string; hex: string };
    quantity: number;
}

export interface FilterState {
    category: string;
    searchQuery: string;
    sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
    productType: string;
    selectedColor: string;
    maxPrice: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    provider: 'google' | 'email';
    role: 'customer' | 'admin';
    savedAddress?: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        phone: string;
    };
}

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    currency: CurrencyCode;
    shippingAddress?: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        phone: string;
    };
    paymentMethod: 'card' | 'apple-pay' | 'paypal' | 'cod' | 'tmoney' | 'flooz' | 'paydunya';
    status: 'placed' | 'processing' | 'shipped' | 'delivered';
    paymentStatus: 'initiating' | 'pending' | 'paid' | 'failed' | 'unverified';
    paymentVerified: boolean;
    estimatedDelivery?: string;
}
