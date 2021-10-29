import { combineReducers } from '@reduxjs/toolkit'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { userDefaultSlice } from 'store/slices/userDefault'
import { surveySlice } from 'store/slices/survey'
import { answerSlice } from 'store/slices/answer'

const createRootReducer = (history: History) =>
    combineReducers({
        router: connectRouter(history),
        // ... rest of your reducers
        userDefault: userDefaultSlice.reducer,
        [surveySlice.name]: surveySlice.reducer,
        [answerSlice.name]: answerSlice.reducer,
    })

export default createRootReducer

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>
