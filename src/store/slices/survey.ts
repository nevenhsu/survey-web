import _ from 'lodash'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import surveyApi from 'services/surveyApi'
import { SurveyStep, QuizMode } from 'common/types'
import type { Form, SelectionQuiz, QuizType } from 'common/types'
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
    reducers: {
        updateQuiz: (
            state,
            action: PayloadAction<{
                quizId: string
                newValue: Partial<QuizType>
            }>
        ) => {
            const { form } = state
            const { quizId, newValue } = action.payload

            if (form && quizId) {
                const { quizzes = [] } = form
                const index = _.findIndex(quizzes, { id: quizId })
                quizzes[index] = {
                    ...quizzes[index],
                    ...newValue,
                }
            }
        },
        nextQuiz: (state, action: PayloadAction<void>) => {
            const { quizId, form } = state
            const { quizzes = [] } = form ?? {}

            if (!quizId) {
                state.quizId = quizzes[0]?.id
                return
            }

            const index = _.findIndex(quizzes, { id: quizId })

            if (index === -1) {
                return
            }

            const quiz = quizzes[index]
            const { mode } = quiz

            if (_.includes([QuizMode.sort, QuizMode.selection], mode)) {
                const next = getNextByChoice(quiz as SelectionQuiz)
                if (next) {
                    state.quizId = next
                    return
                }
            }

            const nextIndex = index + 1
            const nextQuiz = quizzes[nextIndex]

            if (nextQuiz) {
                state.quizId = nextQuiz.id
                return
            }

            state.step = SurveyStep.result
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getForm.fulfilled, (state, action) => {
            const form = action.payload
            state.form = form
            state.quizId = _.get(form, ['quizzes', 0, 'id'])
        })
    },
})

export const { nextQuiz, updateQuiz } = surveySlice.actions

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

function getNextByChoice(quiz: SelectionQuiz) {
    const { maxChoices, values = [], choices = [] } = quiz
    const value = values[0]
    const choice = _.find(choices, { id: value })
    const { next } = choice ?? {}

    if (maxChoices === 1 && value && choice && next) {
        return next
    }
}
