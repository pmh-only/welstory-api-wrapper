import { Endpoints } from './Endpoints'
import { WelstoryClient } from './WelstoryClient'
import { WelstoryMeal } from './WelstoryMeal'

export class WelstoryRestaurant {
  constructor (
    private readonly client: WelstoryClient,
    public readonly id: string,
    public readonly name: string,
    public readonly description: string
  ) {}

  public async checkIsRegistered (): Promise<boolean> {
    const response = await this.client.request(Endpoints.LIST_MY_RESTAURANT)
      .then(async (res) => await res.json())
      .catch((err) => err) as any

    if (response instanceof Error) {
      throw new Error(`Failed to check if restaurant is registered: ${response.message}`)
    }

    return (response?.data?.filter?.((r: any) => r.restaurantId === this.id)?.length ?? 0) > 0
  }

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

  public async listMealTimes (): Promise<Array<{ id: string, name: string }>> {
    const response = await this.client.request(Endpoints.LIST_MEAL_TIME, {
      headers: {
        Cookie: `cafeteriaActiveId=${this.id}`
      }
    }).then(async (res) => await res.json())
      .catch((err) => err) as any

    if (response instanceof Error) {
      throw new Error(`Failed to list meal times: ${response.message}`)
    }

    return response
      ?.data
      ?.map?.((time: any) => ({
        id: time.code,
        name: time.codeNm
      })) ?? []
  }

  public async listMeal (date: number, mealTimeId: string): Promise<WelstoryMeal[]> {
    const response = await this.client.request(Endpoints.LIST_MEAL(date, mealTimeId, this.id))
      .then(async (res) => await res.json())
      .catch((err) => err) as any

    if (response instanceof Error) {
      throw new Error(`Failed to list meal: ${response.message}`)
    }

    return response.data.mealList.map((meal: any) => {
      if (typeof meal.hallNo !== 'string' ||
          typeof meal.menuName !== 'string' ||
          typeof meal.courseTxt !== 'string' ||
          typeof meal.menuCourseType !== 'string' ||
          typeof meal.photoUrl !== 'string' ||
          typeof meal.photoCd !== 'string') {
        throw new Error('Invalid restaurant data format: ' + JSON.stringify(meal))
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
        meal.setMenuName,
        meal.subMenuTxt,
        `${meal.photoUrl as string}${meal.photoCd as string}`
      )
    })
  }
}
