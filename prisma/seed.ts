// File: prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  // Clear existing data
  console.log('Deleting existing data...');
  await prisma.user.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.siteSettings.deleteMany({});
  await prisma.contentBlock.deleteMany({});
  await prisma.course.deleteMany({});

  // Create Admin User
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  await prisma.user.create({
    data: { email: adminEmail, hashedPassword: hashedPassword },
  });
  console.log('Created admin user.');

  // Create default Site Settings
  await prisma.siteSettings.create({ data: {} });
  console.log('Created default site settings.');

  // Create default Services
  await prisma.service.createMany({
    data: [
      { name: "Soul Session", description: "Deep spiritual conversation", duration: "60min", price: 75, popular: true, icon: "Heart" },
      { name: "Creative Guidance", description: "Find your authentic voice", duration: "45min", price: 60, popular: false, icon: "Zap" },
      { name: "Life Philosophy", description: "Authentic living philosophy", duration: "75min", price: 90, popular: true, icon: "Shield" },
      { name: "Music & Soul", description: "Music connects to divine", duration: "60min", price: 75, popular: false, icon: "Star" },
    ],
  });
  console.log('Created default services.');

  // Create default Content Blocks
  await prisma.contentBlock.createMany({
    data: [
      { key: 'home_subtitle', value: "Pittsburgh's greatest freestyle rapper & beat maker. Making real music with my heart. Been battling \"I don't Give A F*ck\" all my life. It feels good." },
      { key: 'music_title', value: 'Music Universe' },
      { key: 'music_subtitle', value: 'All my beats, freestyles, and tracks. Made from scratch with pure heart. Real music for the world.' },
      { key: 'gallery_title', value: 'Picture Gallery' },
      { key: 'gallery_subtitle', value: 'Visual moments from the journey. Life through my lens, beats through my soul.' },
      { key: 'texts_title', value: 'Text Gallery' },
      { key: 'texts_subtitle', value: 'Raw thoughts, real stories. Words straight from the soul of a Pittsburgh beat maker.' },
      { key: 'courses_title', value: 'Courses' },
      { key: 'courses_subtitle', value: 'Learn the craft, from beatmaking fundamentals to advanced freestyle techniques.' },
      { key: 'seo_title', value: 'Fiz - Freestyle & Beats' },
      { key: 'seo_description', value: "Pittsburgh's finest freestyle rapper and beat maker. Real music for the world." },
      { key: 'seo_music_title', value: 'Music | Fiz' },
      { key: 'seo_music_description', value: 'Listen to beats, freestyles, and tracks from Fiz - Pittsburgh freestyle rapper and beat maker.' },
      { key: 'seo_gallery_title', value: 'Gallery | Fiz' },
      { key: 'seo_gallery_description', value: 'Visual moments from the journey of Fiz - Pittsburgh freestyle rapper and beat maker.' },
      { key: 'seo_texts_title', value: 'Texts | Fiz' },
      { key: 'seo_texts_description', value: 'Raw thoughts and real stories from Fiz - Pittsburgh freestyle rapper and beat maker.' },
      { key: 'seo_courses_title', value: 'Courses | Fiz' },
      { key: 'seo_courses_description', value: 'Learn beatmaking and freestyle techniques from Fiz.' },
      { key: 'seo_consultation_title', value: 'Spiritual Sessions | Fiz' },
      { key: 'seo_consultation_description', value: 'Book a spiritual consultation session with Fiz.' },
      { key: 'footer_email', value: 'brendan89890@yahoo.com' },
      { key: 'footer_youtube_url', value: 'https://www.youtube.com/@snapcracklefizzle9954' },
    ],
  });
  console.log('Created default content blocks.');

  // Create default Courses
  await prisma.course.createMany({
    data: [
      {
        title: 'Intro to Beatmaking',
        description: 'A free course covering the basics of creating your first beat.',
        isPremium: false,
      },
      {
        title: 'Advanced Freestyle Techniques',
        description: 'Unlock the secrets to complex rhyme schemes and storytelling in your freestyles.',
        isPremium: true,
        price: 50,
        unlockCode: 'FIZZLEFLOW',
      },
    ],
  });
  console.log('Created default courses.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });