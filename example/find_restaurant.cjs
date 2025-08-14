const { WelstoryClient } = require('..')

;(async () => {
  const client = new WelstoryClient()

  await client.login({
    username: process.env.WELSTORY_USERNAME,
    password: process.env.WELSTORY_PASSWORD
  })

  const restaurants = await client.searchRestaurant('R5')

  for (const res of restaurants) {
    console.log(`Found restaurant: ${res.name} (${res.id})`)
  }

  console.log(`${restaurants[0].name}'s time table:`)
  const mealTimes = await restaurants[0].listMealTimes()

  for (const time of mealTimes) {
    console.log(`${time.id}) ${time.name}`)
  }
})()
