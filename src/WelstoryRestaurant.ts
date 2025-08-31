/**
 * @fileoverview Restaurant management functionality for the Welstory API.
 */

import { Endpoints } from './Endpoints.js'
import { WelstoryClient } from './WelstoryClient.js'
import { WelstoryMeal } from './WelstoryMeal.js'
import {
  type RegisteredRestaurantsResponse,
  type MealTimeResponse,
  type MealListResponse,
  isValidMealData
} from './ApiTypes.js'

/**
 * Represents a restaurant in the Welstory system.
 * Provides functionality for registration, meal time listing, and meal information retrieval.
 * @class WelstoryRestaurant
 */
export class WelstoryRestaurant {
  /**
   * Creates a new WelstoryRestaurant instance.
   * @param client - The WelstoryClient instance for API requests
   * @param id - Unique restaurant identifier
   * @param name - Restaurant name
   * @param description - Restaurant description
   */
  constructor (
    private readonly client: WelstoryClient,
    /**
     * Unique restaurant identifier.
     */
    public readonly id: string,
    /**
     * Restaurant name.
     */
    public readonly name: string,
    /**
     * Restaurant description.
     */
    public readonly description: string
  ) {}

  /**
   * Checks if this restaurant is registered to the user's account.
   * @returns Promise resolving to true if registered, false otherwise
   * @throws Error if the check fails
   */
  public async checkIsRegistered (): Promise<boolean> {
    const response = await this.client.request<RegisteredRestaurantsResponse>(Endpoints.LIST_MY_RESTAURANT)
      .then(async (res) => await res.json())
      .catch((err: Error) => err)

    if (response instanceof Error) {
      throw new Error(`Failed to check if restaurant is registered: ${response.message}`)
    }

    return (response?.data?.filter?.(r => r.restaurantId === this.id)?.length ?? 0) > 0
  }

  /**
   * Registers this restaurant to the user's account.
   * @returns Promise that resolves when registration is complete
   * @throws Error if restaurant is already registered or registration fails
   */
  public async register (): Promise<void> {
    if (await this.checkIsRegistered()) {
      throw new Error(`Restaurant ${this.id} is already registered`)
    }

    const response = await this.client.request(Endpoints.REGISTER_MY_RESTAURANT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        {
          mainDiv: 'N',
          restaurantId: this.id,
          orderSeq: 10000 * Math.floor(Math.random() * 9999)
        }
      ])
    }).catch((err: Error) => err)

    if (response instanceof Error) {
      throw new Error(`Failed to register restaurant: ${response.message}`)
    }

    if (!response.ok) {
      throw new Error(`Failed to register restaurant: ${response.statusText}, response: ${JSON.stringify(await response.text())}`)
    }
  }

  /**
   * Removes this restaurant from the user's registered restaurants.
   * @returns Promise that resolves when unregistration is complete
   * @throws Error if restaurant is not registered or unregistration fails
   */
  public async unregister (): Promise<void> {
    if (!(await this.checkIsRegistered())) {
      throw new Error(`Restaurant ${this.id} is not registered`)
    }

    const response = await this.client.request(Endpoints.DELETE_MY_RESTAURANT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        hcId: '',
        restaurantId: this.id
      }])
    }).catch((err: Error) => err)

    if (response instanceof Error) {
      throw new Error(`Failed to unregister restaurant: ${response.message}`)
    }

    if (!response.ok) {
      throw new Error(`Failed to unregister restaurant: ${response.statusText}, response: ${JSON.stringify(await response.text())}`)
    }
  }

  /**
   * Lists available meal times for this restaurant.
   * @returns Promise resolving to array of meal time objects with id and name
   * @throws Error if listing meal times fails
   */
  public async listMealTimes (): Promise<Array<{ id: string, name: string }>> {
    const response = await this.client.request<MealTimeResponse>(Endpoints.LIST_MEAL_TIME, {
      headers: {
        Cookie: `cafeteriaActiveId=${this.id}`
      }
    }).then(async (res) => await res.json())
      .catch((err: Error) => err)

    if (response instanceof Error) {
      throw new Error(`Failed to list meal times: ${response.message}`)
    }

    return response
      ?.data
      ?.map?.(time => ({
        id: time.code,
        name: time.codeNm
      })) ?? []
  }

  /**
   * Lists meals available at this restaurant for a specific date and meal time.
   * @param date - Date in YYYYMMDD number format
   * @param mealTimeId - Meal time identifier
   * @returns Promise resolving to array of available meals
   * @throws Error if listing meals fails or data format is invalid
   */
  public async listMeal (date: number, mealTimeId: string): Promise<WelstoryMeal[]> {
    const response = await this.client.request<MealListResponse>(Endpoints.LIST_MEAL(date, mealTimeId, this.id))
      .then(async (res) => await res.json())
      .catch((err: Error) => err)

    if (response instanceof Error) {
      throw new Error(`Failed to list meal: ${response.message}`)
    }

    return response.data.mealList.map((meal) => {
      if (!isValidMealData(meal)) {
        throw new Error('Invalid meal data format: ' + JSON.stringify(meal))
      }

      return new WelstoryMeal(
        this.client,
        this,
        meal.hallNo,
        date,
        mealTimeId,
        meal.menuName,
        meal.courseTxt,
        meal.menuCourseType,
        meal.setMenuName ?? null,
        meal.subMenuTxt ?? null,
        `${meal.photoUrl}${meal.photoCd}`
      )
    })
  }
}
