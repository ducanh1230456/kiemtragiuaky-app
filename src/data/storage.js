import AsyncStorage from '@react-native-async-storage/async-storage';
import { seedCategories, seedDishes, STORAGE_KEY } from './seed';

const prefix = 'BIT240029_';

export function toRemoteCategory(category) {
  return {
    BIT240029_ClientId: category.id,
    BIT240029_Id: category.id,
    BIT240029_Name: category.name,
    BIT240029_Description: category.description || '',
  };
}

export function fromRemoteCategory(row) {
  return {
    id: row.BIT240029_ClientId || row.BIT240029_Id || row.id,
    name: row.BIT240029_Name ?? row.name ?? '',
    description: row.BIT240029_Description ?? row.description ?? '',
  };
}

export function toRemoteDish(dish) {
  return {
    BIT240029_ClientId: dish.id,
    BIT240029_Id: dish.id,
    BIT240029_Name: dish.name,
    BIT240029_Price: Number(dish.price),
    BIT240029_PreparationTime: Number(dish.preparationTime),
    BIT240029_IsAvailable: Boolean(dish.isAvailable),
    BIT240029_Description: dish.description || '',
    BIT240029_DishCategoryId: dish.dishCategoryId,
    BIT240029_DishImage: (dish.dishImage || []).map(image => ({
      BIT240029_ImageUrl: image.imageUrl,
      BIT240029_IsThumbnail: Boolean(image.isThumbnail),
    })),
  };
}

export function fromRemoteDish(row) {
  const images = row.BIT240029_DishImage || row.dishImage || [];
  return {
    id: row.BIT240029_ClientId || row.BIT240029_Id || row.id,
    name: row.BIT240029_Name ?? row.name ?? '',
    price: Number(row.BIT240029_Price ?? row.price ?? 0),
    preparationTime: Number(row.BIT240029_PreparationTime ?? row.preparationTime ?? 0),
    isAvailable: Boolean(row.BIT240029_IsAvailable ?? row.isAvailable),
    description: row.BIT240029_Description ?? row.description ?? '',
    dishCategoryId: row.BIT240029_DishCategoryId ?? row.dishCategoryId ?? '',
    dishImage: images.map(image => ({
      imageUrl: image.BIT240029_ImageUrl ?? image.imageUrl ?? '',
      isThumbnail: Boolean(image.BIT240029_IsThumbnail ?? image.isThumbnail),
    })),
  };
}

function normalize(data) {
  const settings = data?.BIT240029_Settings || {};
  const categories = data?.categories || data?.BIT240029_DishCategory;
  const dishes = data?.dishes || data?.BIT240029_Dish;
  return {
    categories: Array.isArray(categories) ? categories.map(fromRemoteCategory) : seedCategories,
    dishes: Array.isArray(dishes) ? dishes.map(fromRemoteDish) : seedDishes,
    lang: (data?.lang || settings.BIT240029_Language) === 'vi' ? 'vi' : 'en',
    dishEndpoint: data?.dishEndpoint || settings.BIT240029_DishEndpoint || '',
    categoryEndpoint: data?.categoryEndpoint || settings.BIT240029_CategoryEndpoint || '',
    pendingDishDeletes: data?.pendingDishDeletes || data?.BIT240029_PendingDishDeletes || [],
    pendingCategoryDeletes: data?.pendingCategoryDeletes || data?.BIT240029_PendingCategoryDeletes || [],
  };
}

export async function loadState() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return normalize({ categories: seedCategories, dishes: seedDishes });
    return normalize(JSON.parse(raw));
  } catch {
    return normalize({ categories: seedCategories, dishes: seedDishes });
  }
}

export async function saveState(state) {
  const payload = {
    BIT240029_DishCategory: state.categories.map(toRemoteCategory),
    BIT240029_Dish: state.dishes.map(toRemoteDish),
    BIT240029_Settings: {
      BIT240029_Language: state.lang,
      BIT240029_DishEndpoint: state.dishEndpoint || '',
      BIT240029_CategoryEndpoint: state.categoryEndpoint || '',
    },
    BIT240029_PendingDishDeletes: state.pendingDishDeletes || [],
    BIT240029_PendingCategoryDeletes: state.pendingCategoryDeletes || [],
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function resetLocalData() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export { prefix };
