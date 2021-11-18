import _ from 'lodash'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import surveyApi from 'services/surveyApi'
import User from 'utils/user'
import LocalSurveys from 'utils/surveys'
import { SurveyStep, Mode } from 'common/types'
import { surveyFormatter } from 'utils/formatter'
import type {
    Survey,
    Quiz,
    QuizType,
    Results,
    Result,
    Component,
    Final,
    FinalInfo,
} from 'common/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store'

type Surveys = {
    [key: string]: Survey
}

interface EditorState {
    currentId: string
    surveys: Surveys
    step: SurveyStep
    lastEditingAt: number
    mode?: Mode
}

export const modes = [Mode.oneInTwo, Mode.dragger]

export const createNew = createAsyncThunk(
    'survey/createNew',
    async (mode: Mode) => {
        const data = await surveyApi.createNew(mode)
        return data
    }
)

export const getSurvey = createAsyncThunk(
    'survey/getSurvey',
    async (id: string) => {
        const data = await surveyApi.getSurvey(id)
        return data
    }
)

export const saveSurvey = createAsyncThunk(
    'survey/saveSurvey',
    async (survey: Survey) => {
        const { id } = survey

        const data = await surveyApi.putSurvey(id, survey)
        return data
    }
)

export const reloadFromCloud = createAsyncThunk(
    'survey/reloadFromCloud',
    async () => {
        const localSurveys = LocalSurveys.getInstance()
        const id = localSurveys.getCurrentId() ?? ''

        const data = await surveyApi.getSurvey(id)
        return data
    }
)

const initialState: EditorState = {
    currentId: '',
    surveys: {},
    step: SurveyStep.start,
    lastEditingAt: 0,
}

export const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        setCurrentId: (state, action: PayloadAction<string>) => {
            state.currentId = action.payload
        },
        setStep: (state, action: PayloadAction<SurveyStep>) => {
            const user = User.getInstance()
            const step = action.payload
            user.setValue({ step })

            state.step = step
        },
        setMode: (state, action: PayloadAction<Mode>) => {
            const mode = action.payload
            state.mode = mode
        },
        setQuizzes: (
            state,
            action: PayloadAction<{ id: string; quizzes: QuizType[] }>
        ) => {
            const { id, quizzes } = action.payload
            const { surveys } = state
            const survey = surveys[id]
            survey.quizzes = quizzes

            updateLocalSurvey(id, survey)

            state.lastEditingAt = Date.now()
        },
        addQuiz: (
            state,
            action: PayloadAction<{
                id: string
                newValue: Partial<QuizType>
            }>
        ) => {
            const { id, newValue } = action.payload
            const { surveys } = state
            const survey = surveys[id]
            survey.quizzes.push(newValue as Quiz)

            state.lastEditingAt = Date.now()
        },
        updateQuiz: (
            state,
            action: PayloadAction<{
                surveyId: string
                quizId: string
                newValue: Partial<QuizType>
            }>
        ) => {
            const { surveyId, quizId, newValue } = action.payload
            const { surveys } = state
            const survey = surveys[surveyId]

            const quizzes = Array.from(survey.quizzes).map((el) =>
                el.id === quizId
                    ? {
                          ...el,
                          ...newValue,
                      }
                    : el
            )

            survey.quizzes = quizzes

            updateLocalSurvey(surveyId, survey)

            state.lastEditingAt = Date.now()
        },
        deleteQuiz: (
            state,
            action: PayloadAction<{
                surveyId: string
                quizId: string
            }>
        ) => {
            const { surveyId, quizId } = action.payload
            const { surveys } = state
            const survey = surveys[surveyId]

            const { quizzes = [] } = survey ?? {}
            const newValue = quizzes.filter((el) => el.id !== quizId)
            survey.quizzes = newValue

            updateLocalSurvey(surveyId, survey)

            state.lastEditingAt = Date.now()
        },
        setResults: (
            state,
            action: PayloadAction<{
                surveyId: string
                newValue: Partial<Results>
            }>
        ) => {
            const { surveyId, newValue } = action.payload
            const { surveys } = state
            const survey = surveys[surveyId]
            const newResults = {
                ...survey.results,
                ...newValue,
            }

            survey.results = newResults
            updateLocalSurvey(surveyId, survey)

            state.lastEditingAt = Date.now()
        },
        setResult: (
            state,
            action: PayloadAction<{
                surveyId: string
                resultId: string
                newValue: Partial<Result>
            }>
        ) => {
            const { surveyId, resultId, newValue } = action.payload
            const { surveys } = state
            const survey = surveys[surveyId] ?? {}
            const { list = {} } = survey.results ?? {}
            list[resultId] = {
                ...list[resultId],
                ...newValue,
            }

            updateLocalSurvey(surveyId, survey)

            state.lastEditingAt = Date.now()
        },
        updateComponent: (
            state,
            action: PayloadAction<{
                surveyId: string
                resultId: string
                idPath: string[]
                newValue: Component
                deleted?: boolean
            }>
        ) => {
            const {
                surveyId,
                resultId,
                idPath,
                newValue,
                deleted = false,
            } = action.payload

            const { surveys } = state
            const survey = surveys[surveyId] ?? {}
            const { list } = survey.results ?? {}
            const result = list[resultId]

            if (result) {
                setNewComponents(result, idPath, newValue, Boolean(deleted))
                updateLocalSurvey(surveyId, survey)
            }

            state.lastEditingAt = Date.now()
        },
        updateFinal: (
            state,
            action: PayloadAction<{
                surveyId: string
                newValue: Partial<Final>
            }>
        ) => {
            const { surveyId, newValue } = action.payload
            const { surveys } = state

            const survey = surveys[surveyId]
            survey.final = { ...survey.final, ...newValue }

            updateLocalSurvey(surveyId, survey)

            state.lastEditingAt = Date.now()
        },
        updateFinalData: (
            state,
            action: PayloadAction<{
                surveyId: string
                newValue: Partial<FinalInfo>
            }>
        ) => {
            const { surveyId, newValue } = action.payload
            const { surveys } = state

            const survey = surveys[surveyId]
            const { final } = survey ?? {}
            const { data } = final ?? {}

            final.data = {
                ...data,
                ...newValue,
            }
        },
        updateFinalComponents: (
            state,
            action: PayloadAction<{
                surveyId: string
                idPath: string[]
                newValue: Component
                deleted?: boolean
            }>
        ) => {
            const {
                surveyId,
                idPath,
                newValue,
                deleted = false,
            } = action.payload

            const { surveys } = state
            const survey = surveys[surveyId] ?? {}

            if (survey) {
                const { final } = survey

                if (!final.components) {
                    final.components = []
                }

                setNewComponents(final, idPath, newValue, Boolean(deleted))
                updateLocalSurvey(surveyId, survey)

                state.lastEditingAt = Date.now()
            }
        },
        updateSurvey: (
            state,
            action: PayloadAction<{
                id: string
                newValue: Partial<Survey>
            }>
        ) => {
            const { id, newValue } = action.payload
            const { surveys } = state
            const survey = surveys[id]

            surveys[id] = {
                ...survey,
                ...newValue,
            }

            updateLocalSurvey(id, surveys[id])

            state.lastEditingAt = Date.now()
        },
        reloadFromLocal: (state, action: PayloadAction<void>) => {
            const localSurveys = LocalSurveys.getInstance()
            const currentId = localSurveys.getCurrentId() ?? ''
            const surveyData = localSurveys.getSurveyById(currentId)

            if (surveyData && _.includes(modes, surveyData.mode)) {
                const survey = surveyFormatter(surveyData)
                const { id, updatedAt, mode } = survey
                state.currentId = id
                state.surveys[id] = survey
                state.lastEditingAt = updatedAt
                state.mode = mode
            } else {
                state.step = SurveyStep.start
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createNew.fulfilled, (state, action) => {
            const { surveys } = state
            const survey = action.payload
            const { id } = survey

            const localSurveys = LocalSurveys.getInstance()
            localSurveys.setCurrentId(id)
            localSurveys.setSurveyId(id)
            localSurveys.setSurveyById(id, survey)

            surveys[id] = survey
            state.currentId = id
        })
        builder.addCase(getSurvey.fulfilled, (state, action) => {
            const survey = action.payload
            if (survey) {
                const { id, updatedAt } = survey

                const { surveys } = state
                surveys[id] = survey

                updateLocalSurvey(id, survey)

                state.currentId = id
                state.lastEditingAt = updatedAt
            }
        })
        builder.addCase(saveSurvey.fulfilled, (state, action) => {
            const survey = action.payload
            if (survey) {
                const { surveys } = state

                const { id, updatedAt } = survey
                state.lastEditingAt = updatedAt

                surveys[id] = survey
            }
        })
        builder.addCase(reloadFromCloud.fulfilled, (state, action) => {
            const survey = action.payload
            if (survey && _.includes(modes, survey.mode)) {
                const { surveys } = state

                const { id, updatedAt, mode } = survey
                const oldSurvey = surveys[id]

                if (_.isEmpty(oldSurvey) || updatedAt > oldSurvey.updatedAt) {
                    surveys[id] = survey

                    updateLocalSurvey(id, survey)

                    state.currentId = id
                    state.lastEditingAt = updatedAt
                    state.mode = mode
                } else {
                    state.lastEditingAt = Date.now()
                }
            } else {
                state.step = SurveyStep.start
            }
        })
    },
})

export const {
    setCurrentId,
    setStep,
    setMode,
    setQuizzes,
    updateQuiz,
    addQuiz,
    deleteQuiz,
    setResults,
    setResult,
    updateComponent,
    updateFinal,
    updateFinalData,
    updateFinalComponents,
    updateSurvey,
    reloadFromLocal,
} = surveySlice.actions

export const selectCurrentId = (state: RootState) => state.survey.currentId

export const selectLastEditingAt = (state: RootState) =>
    state.survey.lastEditingAt

export const selectCurrentSurvey = (state: RootState) => {
    const { surveys, currentId } = state.survey
    return surveys[currentId] || {}
}

const updateLocalSurvey = (id: string, value: Survey) => {
    const localSurveys = LocalSurveys.getInstance()

    localSurveys.setSurveyById(id, value)
}

function setNewComponents(
    data: { components: Component[] },
    idPath: string[],
    newValue: Component,
    deleted: boolean = false
) {
    let i = 0
    let components = data.components
    let component: Component | undefined = undefined

    while (i < idPath.length) {
        const id = idPath[i]
        const index = _.findIndex(components, { id })

        if (index === -1) {
            console.error(new Error(`no component ${id}`))
            return
        }

        component = components[index]

        if (_.isNil(component.components)) {
            console.error(new Error(`no components ${id}`))
            return
        }

        components = component.components
        i += 1
    }

    if (deleted) {
        _.remove(components, { id: newValue.id })
        return
    }

    const targetIndex = _.findIndex(components, { id: newValue.id })

    if (targetIndex > -1) {
        components[targetIndex] = { ...components[targetIndex], ...newValue }
    } else {
        components.push(newValue)
    }
}
