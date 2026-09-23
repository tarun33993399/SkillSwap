// ============================================================
// SKILLSWAP — Seed / Mock Data
// ============================================================

import type { User, Gig, Category, Booking } from '@/types';
import { storageSet, storageGet, storageClear } from '@/lib/storage';

const SEED_VERSION = 'v2_realistic';

export const CATEGORIES: Category[] = [
  { id: 'cat_design', slug: 'design', name: 'Design & Creative', icon: 'Palette', description: 'Logos, brand identity, UI/UX.', gigCount: 0 },
  { id: 'cat_dev', slug: 'development', name: 'Development & Tech', icon: 'Code2', description: 'Web, mobile, APIs.', gigCount: 0 },
  { id: 'cat_writing', slug: 'writing', name: 'Writing & Translation', icon: 'PenLine', description: 'Copywriting, SEO content.', gigCount: 0 },
  { id: 'cat_marketing', slug: 'marketing', name: 'Digital Marketing', icon: 'TrendingUp', description: 'SEO, social media, ads.', gigCount: 0 },
  { id: 'cat_video', slug: 'video', name: 'Video & Animation', icon: 'Video', description: 'Editing, motion graphics.', gigCount: 0 },
  { id: 'cat_music', slug: 'music', name: 'Music & Audio', icon: 'Music', description: 'Music production, voiceover.', gigCount: 0 },
  { id: 'cat_business', slug: 'business', name: 'Business', icon: 'Briefcase', description: 'Consulting, virtual assistance.', gigCount: 0 },
  { id: 'cat_ai', slug: 'ai', name: 'AI Services', icon: 'Cpu', description: 'Prompt engineering, AI generation.', gigCount: 0 },
];

export const MOCK_USERS: User[] = [
  {
    id: 'usr_demo_seller',
    name: 'Aria Chen',
    email: 'aria@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Aria+Chen&background=F7F4EF&color=1C1F26&bold=true',
    role: 'seller',
    bio: 'Award-winning UI/UX designer and illustrator focusing on clean, modern digital experiences.',
    location: 'Toronto, Canada',
    memberSince: '2023-03-15T00:00:00Z',
    isVerified: true,
    stats: { totalOrders: 145, completionRate: 98, avgRating: 4.9, reviewCount: 112 },
  },
  {
    id: 'usr_demo_buyer',
    name: 'James Rivera',
    email: 'james@example.com',
    avatar: 'https://ui-avatars.com/api/?name=James+Rivera&background=F7F4EF&color=1C1F26&bold=true',
    role: 'buyer',
    bio: 'Startup founder looking for top-tier freelancers to grow my brand.',
    location: 'Austin, TX',
    memberSince: '2024-01-10T00:00:00Z',
    isVerified: false,
    stats: { totalOrders: 12, completionRate: 100, avgRating: 0, reviewCount: 0 },
  },
  {
    id: 'usr_seller_2',
    name: 'Luca Moretti',
    email: 'luca@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Luca+Moretti&background=F7F4EF&color=1C1F26&bold=true',
    role: 'seller',
    bio: 'Full-stack developer specialising in React, Node.js, and scalable cloud architecture.',
    location: 'Milan, Italy',
    memberSince: '2023-07-22T00:00:00Z',
    isVerified: true,
    stats: { totalOrders: 89, completionRate: 96, avgRating: 4.8, reviewCount: 82 },
  },
  {
    id: 'usr_seller_3',
    name: 'Priya Nair',
    email: 'priya@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Nair&background=F7F4EF&color=1C1F26&bold=true',
    role: 'both',
    bio: 'SEO strategist, videographer, and content marketer helping brands rank and convert.',
    location: 'Bangalore, India',
    memberSince: '2023-11-05T00:00:00Z',
    isVerified: true,
    stats: { totalOrders: 203, completionRate: 99, avgRating: 4.95, reviewCount: 198 },
  },
];

export const MOCK_GIGS: Gig[] = [
  {
    id: 'gig_001',
    sellerId: 'usr_demo_seller',
    categoryId: 'cat_design',
    title: 'Premium YouTube Thumbnail Design',
    slug: 'premium-youtube-thumbnail-design',
    description: 'Catchy, high-CTR YouTube thumbnails that drive views. I analyze your niche and competitors to design thumbnails that stand out in the feed. Perfect for creators serious about growth.',
    shortDescription: 'Catchy, high-CTR YouTube thumbnails that drive views.',
    tags: ['youtube', 'thumbnail', 'graphic design'],
    images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'],
    packages: [{ tier: 'basic', title: 'Single Thumbnail', description: 'One high-quality thumbnail', price: 800, deliveryDays: 2, revisions: 1, features: ['1 Thumbnail', 'Source file'] }],
    avgRating: 4.9, reviewCount: 117, orderCount: 124, isFeatured: true, status: 'active',
    createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'gig_002',
    sellerId: 'usr_seller_2',
    categoryId: 'cat_dev',
    title: 'Responsive React Landing Page',
    slug: 'responsive-react-landing-page',
    description: 'I will build a blazing fast, responsive landing page using React, TypeScript, and Tailwind CSS. Clean code, perfect lighthouse scores, and smooth animations included.',
    shortDescription: 'Fast, responsive React landing pages with clean code.',
    tags: ['react', 'web dev', 'landing page'],
    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80'],
    packages: [{ tier: 'basic', title: 'Standard Page', description: 'Up to 5 sections', price: 3500, deliveryDays: 5, revisions: 2, features: ['Responsive', 'Source code'] }],
    avgRating: 4.8, reviewCount: 42, orderCount: 50, isFeatured: true, status: 'active',
    createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-06-15T00:00:00Z',
  },
  {
    id: 'gig_003',
    sellerId: 'usr_seller_3',
    categoryId: 'cat_video',
    title: 'Short-form Reels & Shorts Editing',
    slug: 'short-form-reels-shorts-editing',
    description: 'Engaging, fast-paced edits for TikTok, Instagram Reels, and YouTube Shorts. I add captions, sound effects, B-roll, and dynamic transitions to keep viewer retention high.',
    shortDescription: 'Engaging edits for TikTok, Reels, and Shorts.',
    tags: ['video editing', 'reels', 'tiktok'],
    images: ['https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&q=80'],
    packages: [{ tier: 'basic', title: '1 Reel Edit', description: 'Up to 60s video edit', price: 1200, deliveryDays: 2, revisions: 1, features: ['Captions', 'SFX'] }],
    avgRating: 5.0, reviewCount: 88, orderCount: 95, isFeatured: false, status: 'active',
    createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-06-20T00:00:00Z',
  },
  {
    id: 'gig_004',
    sellerId: 'usr_demo_seller',
    categoryId: 'cat_design',
    title: 'Modern Figma UI/UX Design',
    slug: 'modern-figma-ui-ux-design',
    description: 'Complete UI/UX design for your web or mobile app in Figma. I focus on user-centric design principles, clean aesthetics, and conversion-optimized layouts.',
    shortDescription: 'Complete UI/UX design for web or mobile apps.',
    tags: ['ui/ux', 'figma', 'design'],
    images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80'],
    packages: [{ tier: 'basic', title: 'App UI Design', description: 'Up to 3 screens', price: 2500, deliveryDays: 7, revisions: 2, features: ['Figma source', 'Wireframes'] }],
    avgRating: 4.9, reviewCount: 56, orderCount: 60, isFeatured: true, status: 'unavailable',
    createdAt: '2024-03-15T00:00:00Z', updatedAt: '2024-06-25T00:00:00Z',
  },
  {
    id: 'gig_005',
    sellerId: 'usr_seller_3',
    categoryId: 'cat_writing',
    title: 'SEO Blog Writing for Tech Brands',
    slug: 'seo-blog-writing-tech-brands',
    description: 'Well-researched, SEO-optimized blog posts tailored for SaaS and tech companies. I write engaging content that ranks on Google and speaks directly to your target audience.',
    shortDescription: 'SEO-optimized blog posts for SaaS and tech companies.',
    tags: ['writing', 'seo', 'blog'],
    images: ['https://images.unsplash.com/photo-1455390582262-044cdead2708?w=800&q=80'],
    packages: [{ tier: 'basic', title: '1000 Words', description: 'One SEO blog post', price: 1000, deliveryDays: 3, revisions: 1, features: ['SEO optimization', 'Topic research'] }],
    avgRating: 4.7, reviewCount: 34, orderCount: 40, isFeatured: false, status: 'active',
    createdAt: '2024-04-01T00:00:00Z', updatedAt: '2024-06-30T00:00:00Z',
  },
  {
    id: 'gig_006',
    sellerId: 'usr_seller_3',
    categoryId: 'cat_video',
    title: 'Professional Product Photography',
    slug: 'professional-product-photography',
    description: 'High-end product photography for e-commerce and social media. I provide studio-quality lighting, lifestyle setups, and flawless retouching to make your products shine.',
    shortDescription: 'High-end product photography for e-commerce.',
    tags: ['photography', 'product', 'e-commerce'],
    images: ['https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80'],
    packages: [{ tier: 'basic', title: '5 Photos', description: 'White background or lifestyle', price: 2000, deliveryDays: 5, revisions: 1, features: ['Retouching', 'High-res'] }],
    avgRating: 4.9, reviewCount: 22, orderCount: 25, isFeatured: false, status: 'active',
    createdAt: '2024-04-10T00:00:00Z', updatedAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'gig_007',
    sellerId: 'usr_seller_3',
    categoryId: 'cat_marketing',
    title: 'Instagram Content & Strategy',
    slug: 'instagram-content-strategy',
    description: 'A full month of Instagram content planning, including post designs, captions, and hashtag strategy to grow your organic reach and build a loyal community.',
    shortDescription: 'Full month Instagram content planning and strategy.',
    tags: ['instagram', 'social media', 'marketing'],
    images: ['https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80'],
    packages: [{ tier: 'basic', title: 'Starter Plan', description: '12 posts + strategy', price: 1500, deliveryDays: 7, revisions: 2, features: ['Content calendar', 'Custom designs'] }],
    avgRating: 4.8, reviewCount: 75, orderCount: 80, isFeatured: false, status: 'active',
    createdAt: '2024-04-20T00:00:00Z', updatedAt: '2024-07-05T00:00:00Z',
  },
  {
    id: 'gig_008',
    sellerId: 'usr_demo_seller',
    categoryId: 'cat_design',
    title: 'Custom Digital Illustrations',
    slug: 'custom-digital-illustrations',
    description: 'Unique, hand-drawn digital illustrations for your website, book, or editorial piece. I work in multiple styles from minimalist vectors to detailed textured art.',
    shortDescription: 'Unique, hand-drawn digital illustrations.',
    tags: ['illustration', 'art', 'design'],
    images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80'],
    packages: [{ tier: 'basic', title: 'Single Illustration', description: 'One full-color illustration', price: 1800, deliveryDays: 4, revisions: 2, features: ['Source file', 'Commercial use'] }],
    avgRating: 5.0, reviewCount: 41, orderCount: 45, isFeatured: false, status: 'active',
    createdAt: '2024-05-01T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z',
  },
  {
    id: 'gig_009',
    sellerId: 'usr_seller_2',
    categoryId: 'cat_dev',
    title: 'Full-Stack Node.js API Development',
    slug: 'full-stack-nodejs-api',
    description: 'Secure, scalable REST or GraphQL APIs built with Node.js and Express/NestJS. Includes database design (PostgreSQL/MongoDB) and comprehensive API documentation.',
    shortDescription: 'Secure, scalable APIs with Node.js.',
    tags: ['backend', 'api', 'node.js'],
    images: ['https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80'],
    packages: [{ tier: 'basic', title: 'Basic API', description: 'Up to 5 endpoints', price: 3000, deliveryDays: 7, revisions: 2, features: ['Database setup', 'Documentation'] }],
    avgRating: 4.9, reviewCount: 15, orderCount: 18, isFeatured: false, status: 'active',
    createdAt: '2024-05-15T00:00:00Z', updatedAt: '2024-07-15T00:00:00Z',
  },
  {
    id: 'gig_010',
    sellerId: 'usr_seller_3',
    categoryId: 'cat_business',
    title: 'Virtual Assistant & Data Entry',
    slug: 'virtual-assistant-data-entry',
    description: 'Reliable virtual assistance for your daily operations. I handle inbox management, data entry, basic research, and scheduling to free up your valuable time.',
    shortDescription: 'Reliable virtual assistance and data entry.',
    tags: ['virtual assistant', 'admin', 'business'],
    images: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'],
    packages: [{ tier: 'basic', title: '10 Hours', description: '10 hours of VA work', price: 900, deliveryDays: 5, revisions: 0, features: ['Data entry', 'Email management'] }],
    avgRating: 4.8, reviewCount: 62, orderCount: 70, isFeatured: false, status: 'active',
    createdAt: '2024-06-01T00:00:00Z', updatedAt: '2024-07-20T00:00:00Z',
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk_001', gigId: 'gig_001', creatorId: 'usr_demo_seller', clientId: 'usr_demo_buyer',
    clientName: 'James Rivera', clientEmail: 'james@example.com',
    requirements: 'Need a catchy thumbnail for my new vlog about productivity apps. Bold text, professional vibe.',
    deadline: '2024-08-01', rate: 800, status: 'accepted',
    createdAt: '2024-07-25T10:00:00Z', updatedAt: '2024-07-25T11:00:00Z',
  },
  {
    id: 'bk_002', gigId: 'gig_004', creatorId: 'usr_demo_seller', clientId: 'usr_demo_buyer',
    clientName: 'James Rivera', clientEmail: 'james@example.com',
    requirements: 'Looking for a UI redesign of our onboarding flow (3 screens). We want it to look like the references attached.',
    deadline: '2024-08-10', rate: 2500, status: 'pending',
    createdAt: '2024-07-28T09:00:00Z', updatedAt: '2024-07-28T09:00:00Z',
  },
  {
    id: 'bk_003', gigId: 'gig_008', creatorId: 'usr_demo_seller', clientId: 'usr_demo_buyer',
    clientName: 'James Rivera', clientEmail: 'james@example.com',
    requirements: 'Need a custom mascot illustration for our new landing page. Something playful but professional.',
    rate: 1800, status: 'declined',
    createdAt: '2024-07-29T14:00:00Z', updatedAt: '2024-07-29T15:00:00Z',
  },
  {
    id: 'bk_004', gigId: 'gig_002', creatorId: 'usr_seller_2', clientId: 'usr_demo_buyer',
    clientName: 'James Rivera', clientEmail: 'james@example.com',
    requirements: 'Build a quick waitlist landing page. Need email capture hooked up to our API.',
    deadline: '2024-08-05', rate: 3500, status: 'pending',
    createdAt: '2024-07-30T10:00:00Z', updatedAt: '2024-07-30T10:00:00Z',
  },
  {
    id: 'bk_005', gigId: 'gig_005', creatorId: 'usr_seller_3', clientId: 'usr_demo_buyer',
    clientName: 'James Rivera', clientEmail: 'james@example.com',
    requirements: 'SEO article on "Top 10 React UI Libraries in 2024".',
    deadline: '2024-08-02', rate: 1000, status: 'accepted',
    createdAt: '2024-07-26T08:00:00Z', updatedAt: '2024-07-26T09:00:00Z',
  },
];

export function seedDatabase() {
  const currentVersion = storageGet<string>('seed_version');
  
  // If version mismatch or missing, clear everything and re-seed
  if (currentVersion !== SEED_VERSION) {
    storageClear();
    storageSet('seed_version', SEED_VERSION);
    storageSet('users', MOCK_USERS);
    storageSet('gigs', MOCK_GIGS);
    storageSet('bookings', MOCK_BOOKINGS);
    
    // Always default to buyer role on fresh seed
    storageSet('auth_user_id', 'usr_demo_buyer');
    console.log('[SkillSwap] Database seeded with V2 realistic data.');
  }
}
