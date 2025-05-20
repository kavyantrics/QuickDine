// Menu category enum matching the backend
export enum MenuCategory {
  STARTER = 'STARTER',
  MAIN_COURSE = 'MAIN_COURSE',
  DRINKS = 'DRINKS',
  DESSERT = 'DESSERT',
  SIDES = 'SIDES',
  SNACKS = 'SNACKS',
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER'
}

// User-friendly category labels
export const categoryLabels: Record<MenuCategory, string> = {
  [MenuCategory.STARTER]: 'Starter',
  [MenuCategory.MAIN_COURSE]: 'Main Course',
  [MenuCategory.DRINKS]: 'Drinks',
  [MenuCategory.DESSERT]: 'Dessert',
  [MenuCategory.SIDES]: 'Sides',
  [MenuCategory.SNACKS]: 'Snacks',
  [MenuCategory.BREAKFAST]: 'Breakfast',
  [MenuCategory.LUNCH]: 'Lunch',
  [MenuCategory.DINNER]: 'Dinner'
} 