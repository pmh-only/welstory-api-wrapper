const { WelstoryClient } = require('..')

;(async () => {
  const client = new WelstoryClient()

  await client.login({
    username: process.env.WELSTORY_USERNAME,
    password: process.env.WELSTORY_PASSWORD
  })

  const restaurant = (await client.searchRestaurant('R5 B1F'))[0]
  const mealTime = (await restaurant.listMealTimes())[1]

  const isRegistered = await restaurant.checkIsRegistered()
  console.log(`Restaurant is ${isRegistered ? '' : 'not '}registered`)

  if (!isRegistered) {
    await restaurant.register()
  }

  const meals = await restaurant.listMeal(20250814, mealTime.id)
  console.log("R5 B1F's menu")
  for (const meal of meals) {
    console.log(`${meal.menuCourseName}) ${meal.name} (${meal.setName})`)
  }

  if (!isRegistered) {
    await restaurant.unregister()
  }
})()
