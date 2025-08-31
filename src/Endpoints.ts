/**
 * @fileoverview API endpoint definitions for the Welstory Plus service.
 */

/**
 * Collection of all API endpoints used by the Welstory client.
 * @namespace Endpoints
 */
export const Endpoints = {
  /**
   * Login endpoint for user authentication.
   */
  LOGIN: '/login',

  /**
   * Session refresh endpoint for token renewal.
   */
  SESSION_REFRESH: '/session',

  /**
   * Search for restaurants by name.
   * @param searchQuery - The restaurant name to search for
   * @returns The constructed search endpoint URL
   */
  SEARCH_RESTAURANT: (searchQuery: string) =>
    `/api/mypage/rest-list?restaurantName=${encodeURIComponent(searchQuery)}`,

  /**
   * Endpoint to list user's registered restaurants.
   */
  LIST_MY_RESTAURANT: '/api/mypage/rest-my-list',

  /**
   * Endpoint to register a restaurant to user's list.
   */
  REGISTER_MY_RESTAURANT: '/api/mypage/rest-regi',

  /**
   * Endpoint to remove a restaurant from user's list.
   */
  DELETE_MY_RESTAURANT: '/api/mypage/rest-delete',

  /**
   * Endpoint to get available meal times for a restaurant.
   */
  LIST_MEAL_TIME: '/api/menu/getMealTimeList',

  /**
   * Get meal information for a specific date, meal time, and restaurant.
   * @param date - Date in YYYYMMDD number format
   * @param mealTimeId - Meal time identifier (e.g., breakfast, lunch, dinner)
   * @param restaurantId - Restaurant identifier
   * @returns The constructed meal list endpoint URL
   */
  LIST_MEAL: (date: number, mealTimeId: string, restaurantId: string) =>
    `/api/meal?menuDt=${date}&menuMealType=${mealTimeId}&restaurantCode=${restaurantId}`,

  /**
   * Get detailed meal information including course details.
   * @param date - Date in YYYYMMDD number format
   * @param mealTimeId - Meal time identifier
   * @param hallNo - Hall number identifier
   * @param menuCourseType - Menu course type identifier
   * @param restaurantId - Restaurant identifier
   * @returns The constructed meal detail endpoint URL
   */
  LIST_MEAL_DETAIL: (date: number, mealTimeId: string, hallNo: string, menuCourseType: string, restaurantId: string) =>
    `/api/meal/detail?menuDt=${date}&hallNo=${hallNo}&menuCourseType=${menuCourseType}&menuMealType=${mealTimeId}&restaurantCode=${restaurantId}`,

  /**
   * Get nutritional information for a specific meal.
   * @param date - Date in YYYYMMDD number format
   * @param mealTimeId - Meal time identifier
   * @param hallNo - Hall number identifier
   * @param menuCourseType - Menu course type identifier
   * @param restaurantId - Restaurant identifier
   * @returns The constructed meal nutrient endpoint URL
   */
  LIST_MEAL_NUTRIENT: (date: number, mealTimeId: string, hallNo: string, menuCourseType: string, restaurantId: string) =>
    `/api/meal/detail/nutrient?menuDt=${date}&hallNo=${hallNo}&menuCourseType=${menuCourseType}&menuMealType=${mealTimeId}&restaurantCode=${restaurantId}`
}
