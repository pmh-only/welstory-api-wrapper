/**
 * @fileoverview Meal information and menu details for the Welstory API.
 */

import { Endpoints } from './Endpoints.js'
import { WelstoryClient } from './WelstoryClient.js'
import { WelstoryMealMenu } from './WelstoryMealMenu.js'
import { WelstoryRestaurant } from './WelstoryRestaurant.js'
import { type MealNutrientResponse } from './ApiTypes.js'

/**
 * Represents a meal offering at a Welstory restaurant.
 * Provides functionality to retrieve detailed nutritional information.
 * @class WelstoryMeal
 */
export class WelstoryMeal {
  /**
   * Creates a new WelstoryMeal instance.
   * @param client - The WelstoryClient instance for API requests
   * @param restaurant - The restaurant this meal belongs to
   * @param hallNo - Hall number identifier
   * @param date - Date in YYYYMMDD number format
   * @param mealTimeId - Meal time identifier
   * @param name - Meal name
   * @param menuCourseName - Course name description
   * @param menuCourseType - Course type identifier
   * @param setName - Set menu name, if applicable
   * @param subMenuTxt - Sub-menu text description, if applicable
   * @param photoUrl - URL to meal photo
   */
  constructor (
    private readonly client: WelstoryClient,
    /**
     * The restaurant this meal belongs to.
     */
    public readonly restaurant: WelstoryRestaurant,
    /**
     * Hall number identifier.
     */
    public readonly hallNo: string,
    /**
     * Date in YYYYMMDD number format.
     */
    public readonly date: number,
    /**
     * Meal time identifier.
     */
    public readonly mealTimeId: string,
    /**
     * Meal name.
     */
    public readonly name: string,
    /**
     * Course name description.
     */
    public readonly menuCourseName: string,
    /**
     * Course type identifier.
     */
    public readonly menuCourseType: string,
    /**
     * Set menu name, if applicable.
     */
    public readonly setName: string | null,
    /**
     * Sub-menu text description, if applicable.
     */
    public readonly subMenuTxt: string | null,
    /**
     * URL to meal photo.
     */
    public readonly photoUrl: string
  ) {}

  /**
   * Retrieves detailed nutritional information for this meal.
   * @returns Promise resolving to array of meal menu items with nutritional data
   * @throws Error if retrieving meal menu fails
   */
  public async listMealMenus (): Promise<WelstoryMealMenu[]> {
    const response = await this.client.request<MealNutrientResponse>(Endpoints.LIST_MEAL_NUTRIENT(this.date, this.mealTimeId, this.hallNo, this.menuCourseType, this.restaurant.id), {
      headers: {
        Cookie: `cafeteriaActiveId=${this.restaurant.id}`
      }
    }).then(async (res) => await res.json())
      .catch((err: Error) => err)

    if (response instanceof Error) {
      throw new Error(`Failed to list meal menu: ${response.message}`)
    }

    return response
      ?.data
      ?.map?.(menu => ({
        name: menu.menuName,
        isMain: menu.typicalMenu === 'Y',
        calorie: parseFloat(menu.kcal.replace(/,/g, '')),
        carbohydrate: parseFloat(menu.totCho),
        sugar: parseFloat(menu.totSugar),
        fiber: parseFloat(menu.totFib),
        fat: parseFloat(menu.totFat),
        protein: parseFloat(menu.totProtein)
      })) ?? []
  }
}
