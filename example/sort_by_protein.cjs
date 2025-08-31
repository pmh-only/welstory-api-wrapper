const { WelstoryClient } = require('..')

;(async () => {
  const client = new WelstoryClient()

  await client.login({
    username: process.env.WELSTORY_USERNAME,
    password: process.env.WELSTORY_PASSWORD
  })

  const targetRestaurant = ['R5 B1F', 'R5 B2F', 'R3 하모니', 'R4 레인보우', 'R4 오아시스']
  const menus = []

  for (const restaurantName of targetRestaurant) {
    const restaurant = (await client.searchRestaurant(restaurantName))[0]
    const mealTime = (await restaurant.listMealTimes())[1]

    const isRegistered = await restaurant.checkIsRegistered()

    if (!isRegistered) {
      await restaurant.register()
    }

    const meals = await restaurant.listMeal(20250830, mealTime.id)
    for (const meal of meals) {
      menus.push(...await meal.listMealMenus())
    }

    if (!isRegistered) {
      await restaurant.unregister()
    }
  }

  menus.sort((a, b) => b.protein - a.protein)

  console.log(menus)
})()
