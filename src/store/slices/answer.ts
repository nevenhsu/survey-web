import _ from 'lodash'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import surveyApi from 'services/surveyApi'
import { AnswerStep, QuizMode } from 'common/types'
import type {
    Answer,
    SelectionQuiz,
    Survey,
    AnswerValue,
    FinalInfo,
} from 'common/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store'

export const getSurvey = createAsyncThunk(
    'answer/getSurvey',
    async (id: string) => {
        const data = await surveyApi.getSurvey(id)
        return data
    }
)

export const createNewAnswer = createAsyncThunk(
    'answer/createNewAnswer',
    async (id: string) => {
        const data = await surveyApi.createNewAnswer(id)
        return data
    }
)

interface AnswerState {
    step: AnswerStep
    answer: Answer
    survey?: Survey
    quizId?: string
    lastQuiz: boolean
}

const initialState: AnswerState = {
    step: AnswerStep.quiz,
    answer: {
        id: '',
        answers: {},
        final: {},
    },
    lastQuiz: false,
}

export const answerSlice = createSlice({
    name: 'answer',
    initialState,
    reducers: {
        updateAnswerValue: (
            state,
            action: PayloadAction<{
                quizId: string
                newValue: Partial<AnswerValue>
            }>
        ) => {
            const { answer } = state
            const { quizId, newValue } = action.payload

            if (answer && quizId) {
                const { answers } = answer
                const answerValue = answers[quizId]

                answers[quizId] = {
                    ...answerValue,
                    ...newValue,
                    quizId,
                }
            }
        },
        nextQuiz: (state, action: PayloadAction<void>) => {
            const { quizId, survey } = state
            const { quizzes = [] } = survey ?? {}

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

            state.lastQuiz = true
        },
        updateStep: (state, action: PayloadAction<AnswerStep>) => {
            state.step = action.payload
        },
        updateFinal: (state, action: PayloadAction<FinalInfo>) => {
            const { answer } = state
            const { final } = answer ?? {}
            answer.final = {
                ...final,
                ...action.payload,
            }
        },
        updateAnswerData: (state, action: PayloadAction<Partial<Answer>>) => {
            state.answer = {
                ...state.answer,
                ...action.payload,
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getSurvey.fulfilled, (state, action) => {
            const survey = action.payload
            state.survey = survey
            state.quizId = _.get(survey, ['quizzes', 0, 'id'])
        })

        builder.addCase(createNewAnswer.fulfilled, (state, action) => {
            if (action.payload) {
                const answer: Answer = {
                    ...action.payload,
                    answers: {},
                }
                state.answer = answer
            }
        })
    },
})

export const {
    nextQuiz,
    updateAnswerValue,
    updateStep,
    updateFinal,
    updateAnswerData,
} = answerSlice.actions

export const selectSurvey = (state: RootState) => {
    const { survey } = state.answer
    return survey
}

export const selectAnswer = (state: RootState) => {
    const { answer } = state.answer
    return answer
}

export const selectAnswerValue =
    (quizId?: string) =>
    (state: RootState): AnswerValue | undefined => {
        const { answer, survey } = state.answer
        if (quizId && survey && answer) {
            const { answers } = answer
            return answers[quizId]
        }
    }

export const selectQuizId = (state: RootState) => {
    const { quizId } = state.answer
    return quizId
}

export const selectStep = (state: RootState) => {
    const { step } = state.answer
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
