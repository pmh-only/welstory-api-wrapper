import { WelstoryClient } from './WelstoryClient'
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
}
