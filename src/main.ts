/**
 * @fileoverview Main entry point for the Welstory API wrapper library.
 * Exports all public classes and types for interacting with the Welstory Plus API.
 */

/**
 * Re-export all WelstoryClient functionality
 * @see {@link WelstoryClient}
 */
export * from './WelstoryClient.js'

/**
 * Re-export all client types
 * @see {@link WelstoryClientOptions}
 * @see {@link WelstoryClientLoginOptions}
 * @see {@link WelstoryUserInfo}
 */
export type * from './WelstoryClientTypes.js'

/**
 * Re-export all restaurant functionality
 * @see {@link WelstoryRestaurant}
 */
export * from './WelstoryRestaurant.js'

/**
 * Re-export all meal functionality
 * @see {@link WelstoryMeal}
 */
export * from './WelstoryMeal.js'

/**
 * Re-export all meal menu types
 * @see {@link WelstoryMealMenu}
 */
export type * from './WelstoryMealMenu.js'

/**
 * Re-export utility functions and types
 * @see {@link generateUUID}
 * @see {@link universalFetch}
 * @see {@link HttpResponse}
 * @see {@link HttpRequestOptions}
 */
export * from './utils.js'

/**
 * Re-export API types and type guards
 * @see {@link RawRestaurantData}
 * @see {@link RestaurantSearchResponse}
 * @see {@link MealListResponse}
 * @see {@link MealNutrientResponse}
 * @see {@link isValidRestaurantData}
 * @see {@link isValidMealData}
 */
export type * from './ApiTypes.js'
export { isValidRestaurantData, isValidMealData } from './ApiTypes.js'
