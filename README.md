# Welstory API Wrapper

A TypeScript/JavaScript library for interacting with the Samsung Welstory cafeteria API (as of 2025).

## Installation

### From npm Registry

```bash
npm install welstory-api-wrapper
```


### From GitHub Package Registry

```bash
# Configure npm to use GitHub Package Registry for @pmh-only packages
echo "@pmh-only:registry=https://npm.pkg.github.com" >> .npmrc

# Install the package
npm install @pmh-only/welstory-api-wrapper
```

Or using a one-time installation:

```bash
npm install @pmh-only/welstory-api-wrapper --registry=https://npm.pkg.github.com
```

### Environment Compatibility

This library works in all JavaScript/TypeScript environments:

- ✅ **Node.js 14+** (with undici fallback for older versions)
- ✅ **Node.js 18+** (uses built-in fetch)
- ✅ **Bun** (fast JavaScript runtime)
- ✅ **Modern Browsers** (uses built-in fetch)
- ✅ **Bundlers** (webpack, Vite, Rollup, etc.)
- ✅ **TypeScript** (full type definitions included)
- ✅ **CommonJS & ES Modules** (dual package exports)
- ✅ **Browser environments** (automatic polyfills)
- ✅ **XMLHttpRequest fallback** (for environments without fetch)
- ✅ **Node.js HTTP modules** (fallback for server environments)

### Additional Setup for Older Environments

For Node.js versions before 18, the library automatically uses `undici` as a fetch polyfill. If you're using Node.js 14-17, undici will be installed as an optional dependency.

For browser environments that don't support fetch (very old browsers), you may need to include a fetch polyfill:

```bash
npm install whatwg-fetch
```

## Quick Start


### Node.js (CommonJS)

```javascript
// From npm registry
const { WelstoryClient } = require('welstory-api-wrapper')


// From GitHub Package Registry
const { WelstoryClient } = require('@pmh-only/welstory-api-wrapper')

const client = new WelstoryClient()
await client.login({
  username: 'your_username',
  password: 'your_password'
})

const restaurants = await client.searchRestaurant('R5')
```

### Node.js/Browser (ES Modules)

```javascript
// From npm registry
import { WelstoryClient } from 'welstory-api-wrapper'


// From GitHub Package Registry
import { WelstoryClient } from '@pmh-only/welstory-api-wrapper'

const client = new WelstoryClient()
await client.login({
  username: 'your_username',
  password: 'your_password'
})

const restaurants = await client.searchRestaurant('R5')
```

### TypeScript

```typescript
// From npm registry
import { WelstoryClient, WelstoryUserInfo } from 'welstory-api-wrapper'


// From GitHub Package Registry
import { WelstoryClient, WelstoryUserInfo } from '@pmh-only/welstory-api-wrapper'

const client = new WelstoryClient()

const userInfo: WelstoryUserInfo = await client.login({
  username: 'your_username',
  password: 'your_password'
})

const restaurants = await client.searchRestaurant('R5')
```

### Browser (via CDN)

#### From jsDelivr (Recommended for production)

```html
<script type="module">
import { WelstoryClient } from 'https://cdn.jsdelivr.net/npm/welstory-api-wrapper@0.1.0/dist/esm/main.js'

const client = new WelstoryClient()
await client.login({
  username: 'your_username',
  password: 'your_password'
})

const restaurants = await client.searchRestaurant('R5')
</script>
```

#### From unpkg (Alternative CDN)

```html
<script type="module">
import { WelstoryClient } from 'https://unpkg.com/welstory-api-wrapper@0.1.0/dist/esm/main.js'

const client = new WelstoryClient()
// Use the client...
</script>
```

#### Self-hosted CDN files

Download CDN files from the [GitHub releases](https://github.com/pmh-only/welstory-api-wrapper/releases) and host them yourself:

```html
<script type="module">
import { WelstoryClient } from './js/welstory-api-wrapper.min.js'

const client = new WelstoryClient()
// Use the client...
</script>
```

## Features

- 🔐 **Authentication** - Login and session management
- 🏢 **Restaurant Management** - Search, register, and manage restaurants
- 🍽️ **Meal Information** - Retrieve detailed meal and nutritional data
- 📊 **Nutritional Data** - Access detailed nutritional information for meals
- 🔄 **Session Refresh** - Automatic token refresh capabilities
- 📱 **TypeScript Support** - Full TypeScript definitions included
- 🌐 **Universal Compatibility** - Works in any JavaScript environment
- 🔧 **Utility Functions** - Cross-platform UUID generation and HTTP requests

## API Documentation

### WelstoryClient

The main client class for interacting with the Welstory API.

#### Constructor

```javascript
const client = new WelstoryClient({
  baseUrl: 'https://welplus.welstory.com/', // Optional, defaults to official URL
  deviceId: 'custom-device-id' // Optional, generates UUID by default
})
```

#### Authentication Methods

**`login(options: WelstoryClientLoginOptions): Promise<WelstoryUserInfo>`**

Authenticates with the Welstory API.

```javascript
const userInfo = await client.login({
  username: 'your_username',
  password: 'your_password'
})
console.log(`Logged in as: ${userInfo.bizName}`)
```

**`refreshSession(): Promise<number>`**

Refreshes the current session and returns milliseconds until token expiration.

```javascript
const timeUntilExpiry = await client.refreshSession()
console.log(`Session valid for ${timeUntilExpiry / 1000} seconds`)
```

#### Restaurant Methods

**`searchRestaurant(searchQuery: string): Promise<WelstoryRestaurant[]>`**

Searches for restaurants by name.

```javascript
const restaurants = await client.searchRestaurant('R5')
for (const restaurant of restaurants) {
  console.log(`${restaurant.name} (${restaurant.id})`)
}
```

### WelstoryRestaurant

Represents a restaurant in the Welstory system.

#### Properties

- `id: string` - Unique restaurant identifier
- `name: string` - Restaurant name
- `description: string` - Restaurant description

#### Methods

**`checkIsRegistered(): Promise<boolean>`**

Checks if the restaurant is registered to the user's account.

```javascript
const isRegistered = await restaurant.checkIsRegistered()
```

**`register(): Promise<void>`**

Registers the restaurant to the user's account.

```javascript
await restaurant.register()
```

**`unregister(): Promise<void>`**

Removes the restaurant from the user's registered restaurants.

```javascript
await restaurant.unregister()
```

**`listMealTimes(): Promise<Array<{id: string, name: string}>>`**

Lists available meal times for the restaurant.

```javascript
const mealTimes = await restaurant.listMealTimes()
// Example: [{ id: '1', name: '조식' }, { id: '2', name: '중식' }, { id: '3', name: '석식' }]
```

**`listMeal(date: number, mealTimeId: string): Promise<WelstoryMeal[]>`**

Lists meals for a specific date and meal time.

```javascript
const meals = await restaurant.listMeal(20250830, '2') // YYYYMMDD format
```

### WelstoryMeal

Represents a meal offering at a restaurant.

#### Properties

- `restaurant: WelstoryRestaurant` - The restaurant this meal belongs to
- `hallNo: string` - Hall number identifier
- `date: number` - Date in YYYYMMDD format
- `mealTimeId: string` - Meal time identifier
- `name: string` - Meal name
- `menuCourseName: string` - Course name description
- `menuCourseType: string` - Course type identifier
- `setName: string | null` - Set menu name, if applicable
- `subMenuTxt: string | null` - Sub-menu description, if applicable
- `photoUrl: string` - URL to meal photo

#### Methods

**`listMealMenus(): Promise<WelstoryMealMenu[]>`**

Retrieves detailed nutritional information for the meal.

```javascript
const nutritionalInfo = await meal.listMealMenus()
for (const item of nutritionalInfo) {
  console.log(`${item.name}: ${item.protein}g protein, ${item.calorie} kcal`)
}
```

### WelstoryMealMenu

Interface representing nutritional information for a meal menu item.

#### Properties

- `name: string` - Menu item name
- `isMain: boolean` - Whether this is a main course
- `calorie: number` - Caloric content in kcal
- `carbohydrate: number` - Carbohydrate content in grams
- `sugar: number` - Sugar content in grams
- `fiber: number` - Fiber content in grams
- `fat: number` - Fat content in grams
- `protein: number` - Protein content in grams

## Examples

### Basic Restaurant Search and Meal Listing

```javascript
const { WelstoryClient } = require('welstory-api-wrapper')

const client = new WelstoryClient()

await client.login({
  username: process.env.WELSTORY_USERNAME,
  password: process.env.WELSTORY_PASSWORD
})

const restaurant = (await client.searchRestaurant('R5 B1F'))[0]
const mealTime = (await restaurant.listMealTimes())[1] // Usually lunch

// Register restaurant if not already registered
const isRegistered = await restaurant.checkIsRegistered()
if (!isRegistered) {
  await restaurant.register()
}

// Get meals for a specific date
const meals = await restaurant.listMeal(20250830, mealTime.id)
console.log("Today's menu:")
for (const meal of meals) {
  console.log(`${meal.menuCourseName}) ${meal.name}`)
}

// Clean up - unregister if we registered it
if (!isRegistered) {
  await restaurant.unregister()
}
```

### Nutritional Analysis

```javascript
const { WelstoryClient } = require('welstory-api-wrapper')

const client = new WelstoryClient()
await client.login({
  username: process.env.WELSTORY_USERNAME,
  password: process.env.WELSTORY_PASSWORD
})

const targetRestaurants = ['R5 B1F', 'R5 B2F', 'R3 하모니', 'R4 레인보우']
const allMenus = []

for (const restaurantName of targetRestaurants) {
  const restaurant = (await client.searchRestaurant(restaurantName))[0]
  const mealTime = (await restaurant.listMealTimes())[1] // Lunch
  
  // Temporary registration for data access
  const wasRegistered = await restaurant.checkIsRegistered()
  if (!wasRegistered) await restaurant.register()
  
  const meals = await restaurant.listMeal(20250830, mealTime.id)
  for (const meal of meals) {
    const menuItems = await meal.listMealMenus()
    allMenus.push(...menuItems)
  }
  
  // Clean up registration
  if (!wasRegistered) await restaurant.unregister()
}

// Sort by protein content
allMenus.sort((a, b) => b.protein - a.protein)
console.log('Highest protein meals:', allMenus.slice(0, 10))
```

### Session Management

```javascript
const client = new WelstoryClient()

await client.login({
  username: process.env.WELSTORY_USERNAME,
  password: process.env.WELSTORY_PASSWORD
})

// Check session status
const timeUntilExpiry = await client.refreshSession()
console.log(`Session expires in ${Math.floor(timeUntilExpiry / 1000)} seconds`)
```

## Environment Variables

For security, store your credentials in environment variables:

```bash
# .env file
WELSTORY_USERNAME=your_username
WELSTORY_PASSWORD=your_password
```

## Error Handling

The library throws descriptive errors for various failure scenarios:

```javascript
try {
  await client.login({ username: 'invalid', password: 'invalid' })
} catch (error) {
  console.error('Login failed:', error.message)
}

try {
  const restaurants = await client.searchRestaurant('nonexistent')
  if (restaurants.length === 0) {
    console.log('No restaurants found')
  }
} catch (error) {
  console.error('Search failed:', error.message)
}
```

## TypeScript Support

The library includes full TypeScript definitions:

```typescript
import { WelstoryClient, WelstoryUserInfo, WelstoryMealMenu } from 'welstory-api-wrapper'

const client: WelstoryClient = new WelstoryClient()

const userInfo: WelstoryUserInfo = await client.login({
  username: 'username',
  password: 'password'
})

const nutritionalData: WelstoryMealMenu[] = await meal.listMealMenus()
```

## Utility Functions

The library also exports utility functions that can be used independently:

### generateUUID()

Cross-platform UUID generation function.

```typescript
// From npm registry
import { generateUUID } from 'welstory-api-wrapper'


// From GitHub Package Registry
import { generateUUID } from '@pmh-only/welstory-api-wrapper'

const id = generateUUID()
console.log(id) // e.g., "123e4567-e89b-12d3-a456-426614174000"
```

### universalFetch(url, options)

Cross-platform HTTP request function with multiple fallback strategies.

```typescript
// From npm registry
import { universalFetch, type HttpResponse } from 'welstory-api-wrapper'


// From GitHub Package Registry
import { universalFetch, type HttpResponse } from '@pmh-only/welstory-api-wrapper'

const response: HttpResponse = await universalFetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ key: 'value' })
})

const data = await response.json()
```

**Fallback Strategy:**
1. **Global fetch** (modern browsers, Node.js 18+)
2. **Undici** (Node.js 14-17)  
3. **XMLHttpRequest** (older browsers)
4. **Node.js HTTP modules** (server environments)

## CDN Usage

### Available CDN Providers

The library is available on multiple CDN providers for easy browser integration:

| CDN Provider | URL Pattern | Notes |
|--------------|-------------|-------|
| **jsDelivr** | `https://cdn.jsdelivr.net/npm/welstory-api-wrapper@{version}/dist/esm/main.js` | ✅ Recommended for production |
| **unpkg** | `https://unpkg.com/welstory-api-wrapper@{version}/dist/esm/main.js` | ✅ Good alternative |

### Complete Browser Example

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welstory API Demo</title>
</head>
<body>
    <div id="app">
        <h1>Welstory Menu</h1>
        <div id="output"></div>
    </div>

    <script type="module">
        import { WelstoryClient } from 'https://cdn.jsdelivr.net/npm/welstory-api-wrapper@0.1.0/dist/esm/main.js'

        async function loadMenu() {
            const output = document.getElementById('output')
            
            try {
                const client = new WelstoryClient()
                
                await client.login({
                    username: 'your_username',
                    password: 'your_password'
                })
                
                const restaurants = await client.searchRestaurant('R5')
                const restaurant = restaurants[0]
                
                if (restaurant) {
                    const mealTimes = await restaurant.listMealTimes()
                    const meals = await restaurant.listMeal(20250830, mealTimes[1].id)
                    
                    output.innerHTML = meals.map(meal => 
                        `<div>
                            <h3>${meal.name}</h3>
                            <p>${meal.menuCourseName}</p>
                            <img src="${meal.photoUrl}" alt="${meal.name}" style="max-width: 200px;">
                        </div>`
                    ).join('')
                }
            } catch (error) {
                output.innerHTML = `<p>Error: ${error.message}</p>`
            }
        }

        // Load menu when page loads
        loadMenu()
    </script>
</body>
</html>
```

### Legacy Browser Support

For older browsers that don't support ES modules, use the CommonJS build:

```html
<script src="https://cdn.jsdelivr.net/npm/welstory-api-wrapper@0.1.0/dist/cjs/main.js"></script>
<script>
    const { WelstoryClient } = require('welstory-api-wrapper')
    
    const client = new WelstoryClient()
    // Use the client...
</script>
```

### TypeScript Support in Browser

Include the type definitions for TypeScript support:

```html
<!-- For TypeScript projects -->
<script type="importmap">
{
  "imports": {
    "welstory-api-wrapper": "https://cdn.jsdelivr.net/npm/welstory-api-wrapper@0.1.0/dist/esm/main.js"
  }
}
</script>

<script type="module">
import type { WelstoryClient, WelstoryUserInfo } from 'welstory-api-wrapper'
import { WelstoryClient } from 'welstory-api-wrapper'

const client: WelstoryClient = new WelstoryClient()
</script>
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting: `npm run lint`
6. Submit a pull request

## CDN Availability

The library is available via multiple CDN providers:

### CDN Providers
- **jsDelivr**: `https://cdn.jsdelivr.net/npm/welstory-api-wrapper@latest/dist/esm/main.js`
- **unpkg**: `https://unpkg.com/welstory-api-wrapper@latest/dist/esm/main.js`


These CDNs update automatically when new versions are published, requiring no additional setup.

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## License

MIT License - see LICENSE file for details.

## Author

Minhyeok Park (pmh_only@pmh.codes)

## Disclaimer

This library is not officially affiliated with Samsung Welstory. It's a community-created wrapper for educational and convenience purposes. Please respect the terms of service of the Welstory Plus platform.