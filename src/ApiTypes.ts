/**
 * @fileoverview Type definitions for Welstory API responses and data structures.
 */

/**
 * Raw restaurant data from the API search response.
 * @interface RawRestaurantData
 */
export interface RawRestaurantData {
  /**
   * Restaurant code identifier.
   */
  restaurantCode: string

  /**
   * Restaurant name.
   */
  restaurantName: string

  /**
   * Restaurant description.
   */
  restaurantDesc: string
}

/**
 * API response for restaurant search.
 * @interface RestaurantSearchResponse
 */
export interface RestaurantSearchResponse {
  /**
   * Array of restaurant data.
   */
  data: RawRestaurantData[]
}

/**
 * Registered restaurant data from my restaurant list API.
 * @interface RegisteredRestaurantData
 */
export interface RegisteredRestaurantData {
  /**
   * Restaurant identifier.
   */
  restaurantId: string

  /**
   * Additional restaurant properties.
   */
  [key: string]: unknown
}

/**
 * API response for registered restaurants list.
 * @interface RegisteredRestaurantsResponse
 */
export interface RegisteredRestaurantsResponse {
  /**
   * Array of registered restaurant data.
   */
  data: RegisteredRestaurantData[]
}

/**
 * Meal time data from the API.
 * @interface MealTimeData
 */
export interface MealTimeData {
  /**
   * Meal time code.
   */
  code: string

  /**
   * Meal time display name.
   */
  codeNm: string
}

/**
 * API response for meal times list.
 * @interface MealTimeResponse
 */
export interface MealTimeResponse {
  /**
   * Array of meal time data.
   */
  data: MealTimeData[]
}

/**
 * Raw meal data from the API.
 * @interface RawMealData
 */
export interface RawMealData {
  /**
   * Hall number identifier.
   */
  hallNo: string

  /**
   * Menu name.
   */
  menuName: string

  /**
   * Course description text.
   */
  courseTxt: string

  /**
   * Menu course type identifier.
   */
  menuCourseType: string

  /**
   * Set menu name, if applicable.
   */
  setMenuName?: string | null

  /**
   * Sub-menu description text, if applicable.
   */
  subMenuTxt?: string | null

  /**
   * Photo URL base path.
   */
  photoUrl: string

  /**
   * Photo code/filename.
   */
  photoCd: string
}

/**
 * API response for meal list.
 * @interface MealListResponse
 */
export interface MealListResponse {
  /**
   * Response data containing meal list.
   */
  data: {
    /**
     * Array of meal data.
     */
    mealList: RawMealData[]
  }
}

/**
 * Raw meal menu item data with nutritional information.
 * @interface RawMealMenuData
 */
export interface RawMealMenuData {
  /**
   * Menu item name.
   */
  menuName: string

  /**
   * Whether this is a typical/main menu item ('Y' or 'N').
   */
  typicalMenu: 'Y' | 'N'

  /**
   * Caloric content in kcal.
   */
  kcal: string

  /**
   * Total carbohydrate content in grams (as string).
   */
  totCho: string

  /**
   * Total sugar content in grams (as string).
   */
  totSugar: string

  /**
   * Total fiber content in grams (as string).
   */
  totFib: string

  /**
   * Total fat content in grams (as string).
   */
  totFat: string

  /**
   * Total protein content in grams (as string).
   */
  totProtein: string
}

/**
 * API response for meal nutritional data.
 * @interface MealNutrientResponse
 */
export interface MealNutrientResponse {
  /**
   * Array of meal menu nutritional data.
   */
  data: RawMealMenuData[]
}

/**
 * Session refresh response data.
 * @interface SessionRefreshResponse
 */
export interface SessionRefreshResponse {
  /**
   * New access token.
   */
  data?: string
}

/**
 * JWT token payload structure.
 * @interface JwtPayload
 */
export interface JwtPayload {
  /**
   * Token expiration timestamp (seconds since epoch).
   */
  exp: number

  /**
   * Additional JWT payload properties.
   */
  [key: string]: unknown
}

/**
 * Generic API error response.
 * @interface ApiErrorResponse
 */
export interface ApiErrorResponse {
  /**
   * Error message.
   */
  message?: string

  /**
   * Error code.
   */
  code?: string | number

  /**
   * Additional error properties.
   */
  [key: string]: unknown
}

/**
 * Type guard to check if a value is a valid restaurant data object.
 * @param value - Value to check
 * @returns True if value is valid restaurant data
 */
export function isValidRestaurantData (value: unknown): value is RawRestaurantData {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as RawRestaurantData).restaurantCode === 'string' &&
    typeof (value as RawRestaurantData).restaurantName === 'string' &&
    typeof (value as RawRestaurantData).restaurantDesc === 'string'
  )
}

/**
 * Type guard to check if a value is a valid meal data object.
 * @param value - Value to check
 * @returns True if value is valid meal data
 */
export function isValidMealData (value: unknown): value is RawMealData {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as RawMealData).hallNo === 'string' &&
    typeof (value as RawMealData).menuName === 'string' &&
    typeof (value as RawMealData).courseTxt === 'string' &&
    typeof (value as RawMealData).menuCourseType === 'string' &&
    typeof (value as RawMealData).photoUrl === 'string' &&
    typeof (value as RawMealData).photoCd === 'string'
  )
}
