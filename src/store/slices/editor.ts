import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store'
import surveyApi from 'services/surveyApi'
import { setId } from 'utils/helper'
import type { Mode, QuizType } from 'types/customTypes'

type Form = {
    id: string
    createdAt: number
    mode: Mode
    quizzes: QuizType[]
}

interface EditorState {
    forms: {
        [key: string]: Form
    }
}

const createNew = createAsyncThunk('editor/createNew', async () => {
    const data = await surveyApi.createNew()
    return data
})

const initialState = {} as EditorState

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        temp: (state, action: PayloadAction<void>) => {},
    },
    extraReducers: (builder) => {
        builder.addCase(createNew.fulfilled, (state, action) => {
            // both `state` and `action` are now correctly typed
            // based on the slice state and the `pending` action creator
        })
    },
})

export const { temp } = editorSlice.actions
export const selector = (state: RootState) => ({})
