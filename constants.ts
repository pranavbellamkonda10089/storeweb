import { Product, Review } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 348.00,
    rating: 4.8,
    reviewCount: 1250,
    image: 'https://picsum.photos/id/1/400/400',
    description: 'Industry-leading noise cancellation optimized to you. Magnificent Sound, engineered to perfection. Crystal clear hands-free calling.',
    category: 'Electronics',
    isPrime: true
  },
  {
    id: '2',
    title: 'Apple MacBook Air 15-inch Laptop - M2 Chip',
    price: 1299.00,
    rating: 4.9,
    reviewCount: 890,
    image: 'https://picsum.photos/id/2/400/400',
    description: 'Impossibly thin and incredibly fast. The 15-inch MacBook Air with M2 chip features a spacious Liquid Retina display.',
    category: 'Computers',
    isPrime: true
  },
  {
    id: '3',
    title: 'DeWalt 20V MAX Cordless Drill Combo Kit',
    price: 99.00,
    rating: 4.7,
    reviewCount: 3400,
    image: 'https://picsum.photos/id/3/400/400',
    description: 'Compact, lightweight design fits into tight areas. High performance motor delivers 300 unit watts out (UWO) of power ability.',
    category: 'Tools',
    isPrime: false
  },
  {
    id: '4',
    title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    price: 79.95,
    rating: 4.6,
    reviewCount: 12000,
    image: 'https://picsum.photos/id/4/400/400',
    description: '7-IN-1 FUNCTIONALITY: Pressure cook, slow cook, rice cooker, yogurt maker, steamer, sauté pan and food warmer.',
    category: 'Home & Kitchen',
    isPrime: true
  },
  {
    id: '5',
    title: 'Generic Men\'s Cotton T-Shirt Pack of 5',
    price: 25.50,
    rating: 4.3,
    reviewCount: 560,
    image: 'https://picsum.photos/id/5/400/400',
    description: 'Soft, breathable cotton. Perfect for everyday wear. Machine washable.',
    category: 'Clothing',
    isPrime: true
  }
];

export const MOCK_REVIEWS: Record<string, Review[]> = {
  '1': [
    {
      id: 'r1',
      userId: 'u2',
      userName: 'John Doe',
      rating: 5,
      title: 'Best headphones ever!',
      text: 'The noise cancellation is absolutely top tier. I use these on flights and I hear nothing.',
      date: '2023-10-15',
      verifiedPurchase: true,
      images: ['https://picsum.photos/id/101/100/100']
    },
    {
      id: 'r2',
      userId: 'u3',
      userName: 'Jane Smith',
      rating: 4,
      title: 'Great sound, bit pricey',
      text: 'Sound quality is amazing, but the plastic feels a bit cheap for the price point.',
      date: '2023-10-10',
      verifiedPurchase: true,
      video: 'https://www.w3schools.com/html/mov_bbb.mp4' // Dummy video URL
    }
  ]
};
