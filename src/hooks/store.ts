import { configureStore } from '@reduxjs/toolkit'
import reducerOfUser from './slices/user'
import reducerOfTicTacToe from './slices/ticTacToe'
export const store = configureStore({
    reducer: {
        ticTacToe: reducerOfTicTacToe,
        user: reducerOfUser
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch