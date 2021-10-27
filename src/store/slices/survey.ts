import _ from 'lodash'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import surveyApi from 'services/surveyApi'
import { SurveyStep } from 'common/types'
import type { Form } from 'common/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store'

export const getForm = createAsyncThunk(
    'survey/getForm',
    async (id: string) => {
        const data = await surveyApi.getForm(id)
        return data
    }
)

interface SurveyState {
    step: SurveyStep
    form?: Form
    quizId?: string
}

const initialState: SurveyState = {
    step: SurveyStep.quiz,
}

export const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getForm.fulfilled, (state, action) => {
            const form = action.payload
            state.form = form
            state.quizId = _.get(form, ['quizzes', 0, 'id'])
        })
    },
})

export const selectForm = (state: RootState) => {
    const { form } = state.survey
    return form
}

export const selectQuizId = (state: RootState) => {
    const { quizId } = state.survey
    return quizId
}

export const selectStep = (state: RootState) => {
    const { step } = state.survey
    return step
}
