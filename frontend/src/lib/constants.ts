// Menu category enum matching the backend
export enum MenuCategory {
  STARTERS = 'STARTERS',
  MAIN_COURSE = 'MAIN_COURSE',
  DRINKS = 'DRINKS',
  DESSERTS = 'DESSERTS',
  SIDES = 'SIDES',
  SNACKS = 'SNACKS',
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER'
}

// User-friendly category labels
export const categoryLabels: Record<MenuCategory, string> = {
  [MenuCategory.STARTERS]: 'Starters',
  [MenuCategory.MAIN_COURSE]: 'Main Course',
  [MenuCategory.DRINKS]: 'Drinks',
  [MenuCategory.DESSERTS]: 'Desserts',
  [MenuCategory.SIDES]: 'Sides',
  [MenuCategory.SNACKS]: 'Snacks',
  [MenuCategory.BREAKFAST]: 'Breakfast',
  [MenuCategory.LUNCH]: 'Lunch',
  [MenuCategory.DINNER]: 'Dinner'
} 