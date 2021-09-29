import { combineReducers } from '@reduxjs/toolkit'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { userDefaultSlice } from 'store/slices/userDefault'
import { editorSlice } from 'store/slices/editor'

const createRootReducer = (history: History) =>
    combineReducers({
        router: connectRouter(history),
        // ... rest of your reducers
        userDefault: userDefaultSlice.reducer,
        editor: editorSlice.reducer,
    })
export default createRootReducer

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>
