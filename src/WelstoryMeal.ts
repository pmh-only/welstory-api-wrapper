import { Endpoints } from './Endpoints'
import { WelstoryClient } from './WelstoryClient'
import { WelstoryMealMenu } from './WelstoryMealMenu'
import { WelstoryRestaurant } from './WelstoryRestaurant'

export class WelstoryMeal {
  constructor (
    private readonly client: WelstoryClient,
    public readonly restaurant: WelstoryRestaurant,
    public readonly hallNo: string,
    public readonly date: number,
    public readonly mealTimeId: string,
    public readonly name: string,
    public readonly menuCourseName: string,
    public readonly menuCourseType: string,
    public readonly setName: string | null,
    public readonly subMenuTxt: string | null,
    public readonly photoUrl: string
  ) {}

  public async listMealMenus (): Promise<WelstoryMealMenu[]> {
    const response = await this.client.request(Endpoints.LIST_MEAL_NUTRIENT(this.date, this.mealTimeId, this.hallNo, this.menuCourseType, this.restaurant.id), {
      headers: {
        Cookie: `cafeteriaActiveId=${this.restaurant.id}`
      }
    }).then(async (res) => await res.json())
      .catch((err) => err) as any

    if (response instanceof Error) {
      throw new Error(`Failed to list meal menu: ${response.message}`)
    }

    return response
      ?.data
      ?.map?.((menu: any) => ({
        name: menu.menuName,
        isMain: menu.typicalMenu === 'Y',
        calorie: menu.kcal,
        carbohydrate: parseFloat(menu.totCho),
        sugar: parseFloat(menu.totSugar),
        fiber: parseFloat(menu.totFib),
        fat: parseFloat(menu.totFat),
        protein: parseFloat(menu.totProtein)
      })) ?? []
  }
}
