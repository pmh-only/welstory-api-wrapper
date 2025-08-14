export const Endpoints = {
  LOGIN: '/login',
  SESSION_REFRESH: '/session',

  SEARCH_RESTAURANT: (searchQuery: string) =>
    `/api/mypage/rest-list?restaurantName=${encodeURIComponent(searchQuery)}`,

  LIST_MY_RESTAURANT: '/api/mypage/rest-my-list',
  REGISTER_MY_RESTAURANT: '/api/mypage/rest-regi',
  DELETE_MY_RESTAURANT: '/api/mypage/rest-delete',

  LIST_MEAL_TIME: '/api/menu/getMealTimeList',
  LIST_MEAL: (date: number, mealTimeId: string, restaurantId: string) =>
    `/api/meal?menuDt=${date}&menuMealType=${mealTimeId}&restaurantCode=${restaurantId}`,

  LIST_MEAL_DETAIL: (date: number, mealTimeId: string, hallNo: string, menuCourseType: string, restaurantId: string) =>
    `/api/meal/detail?menuDt=${date}&hallNo=${hallNo}&menuCourseType=${menuCourseType}&menuMealType=${mealTimeId}&restaurantCode=${restaurantId}`,

  LIST_MEAL_NUTRIENT: (date: number, mealTimeId: string, hallNo: string, menuCourseType: string, restaurantId: string) =>
    `/api/meal/detail/nutrient?menuDt=${date}&hallNo=${hallNo}&menuCourseType=${menuCourseType}&menuMealType=${mealTimeId}&restaurantCode=${restaurantId}`
}
