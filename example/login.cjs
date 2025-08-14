const { WelstoryClient } = require('..')

;(async () => {
  const client = new WelstoryClient()

  await client.login({
    username: process.env.WELSTORY_USERNAME,
    password: process.env.WELSTORY_PASSWORD
  })

  const refreshAfter = await client.refreshSession()
  console.log(`Session needed to be refreshed after ${refreshAfter}s`)
})()
