
import { Product, Review } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'w1',
    title: 'Seiko Men\'s Essentials Stainless Steel Watch',
    price: 245.00,
    rating: 4.8,
    reviewCount: 450,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400&h=400',
    description: 'A classic stainless steel chronograph. Features a sapphire crystal and 100m water resistance. Perfect for both formal and casual wear.',
    category: 'Watch',
    isPrime: true
  },
  {
    id: 'g1',
    title: 'Ray-Ban Classic Aviator Sunglasses',
    price: 163.00,
    rating: 4.9,
    reviewCount: 2100,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400&h=400',
    description: 'The iconic Aviator design. High-quality metal frame with polarized G-15 lenses for superior clarity and protection.',
    category: 'Eyewear',
    isPrime: true
  },
  {
    id: '1',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 348.00,
    rating: 4.8,
    reviewCount: 1250,
    image: 'https://picsum.photos/id/1/400/400',
    images: ['https://picsum.photos/id/6/400/400', 'https://picsum.photos/id/7/400/400'],
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
    images: ['https://picsum.photos/id/48/400/400', 'https://picsum.photos/id/180/400/400'],
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
    images: ['https://picsum.photos/id/250/400/400'],
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
    images: ['https://picsum.photos/id/225/400/400', 'https://picsum.photos/id/292/400/400', 'https://picsum.photos/id/366/400/400'],
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
    images: ['https://picsum.photos/id/100/400/400'],
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
