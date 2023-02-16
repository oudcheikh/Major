import { configureStore } from '@reduxjs/toolkit'
import pendingCoursReducer from './features/counter/counterSlice'
export default configureStore({
  reducer: { pendingCours: pendingCoursReducer,},
})