export const STUDENT_ID = 'BIT240029';
export const STORAGE_KEY = `${STUDENT_ID}_FoodManager`;

export const seedCategories = [
  { id: 'category-main', name: 'Main courses', description: 'Hearty meals and signature dishes' },
  { id: 'category-soup', name: 'Soups', description: 'Warm bowls made fresh' },
  { id: 'category-dessert', name: 'Desserts', description: 'A sweet finish' },
];

export const seedDishes = [
  { id: 'dish-pho', name: 'Beef Pho', price: 65000, preparationTime: 20, isAvailable: true, description: 'Vietnamese noodle soup with slow-simmered beef broth.', dishCategoryId: 'category-soup', dishImage: [{ imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=900', isThumbnail: true }] },
  { id: 'dish-buncha', name: 'Bun Cha', price: 55000, preparationTime: 18, isAvailable: true, description: 'Grilled pork served with noodles, herbs and dipping sauce.', dishCategoryId: 'category-main', dishImage: [{ imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900', isThumbnail: true }] },
  { id: 'dish-rolls', name: 'Fresh Spring Rolls', price: 35000, preparationTime: 12, isAvailable: true, description: 'Rice paper rolls with fresh herbs and a light dipping sauce.', dishCategoryId: 'category-main', dishImage: [{ imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=900', isThumbnail: true }] },
  { id: 'dish-pumpkin', name: 'Pumpkin Soup', price: 42000, preparationTime: 15, isAvailable: false, description: 'Creamy pumpkin soup with toasted seeds.', dishCategoryId: 'category-soup', dishImage: [{ imageUrl: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=900', isThumbnail: true }] },
  { id: 'dish-mango', name: 'Mango Sticky Rice', price: 45000, preparationTime: 10, isAvailable: true, description: 'Sweet coconut sticky rice with ripe mango.', dishCategoryId: 'category-dessert', dishImage: [{ imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900', isThumbnail: true }] },
];
