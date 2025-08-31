/**
 * @fileoverview Type definition for meal menu items with nutritional information.
 */

/**
 * Represents a meal menu item with detailed nutritional information.
 * @interface WelstoryMealMenu
 */
export interface WelstoryMealMenu {
  /**
   * Name of the menu item.
   */
  name: string

  /**
   * Whether this is a main course item.
   */
  isMain: boolean

  /**
   * Caloric content in kcal.
   */
  calorie: number

  /**
   * Carbohydrate content in grams.
   */
  carbohydrate: number

  /**
   * Sugar content in grams.
   */
  sugar: number

  /**
   * Fiber content in grams.
   */
  fiber: number

  /**
   * Fat content in grams.
   */
  fat: number

  /**
   * Protein content in grams.
   */
  protein: number
}
