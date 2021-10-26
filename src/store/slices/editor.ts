import _ from 'lodash'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import surveyApi from 'services/surveyApi'
import User from 'utils/user'
import LocalForms from 'utils/forms'
import { EditorStep } from 'common/types'
import type {
    Mode,
    Form,
    Quiz,
    QuizType,
    Results,
    Result,
    Component,
    Final,
} from 'common/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store'

type Forms = {
    [key: string]: Form
}

interface EditorState {
    currentId: string
    forms: Forms
    step: EditorStep
    mode?: Mode
}

export const createNew = createAsyncThunk(
    'editor/createNew',
    async (mode: Mode) => {
        const data = await surveyApi.createNew(mode)
        return data
    }
)

const initialState: EditorState = {
    currentId: '',
    forms: {},
    step: EditorStep.pick,
}

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setCurrentId: (state, action: PayloadAction<string>) => {
            state.currentId = action.payload
        },
        setStep: (state, action: PayloadAction<EditorStep>) => {
            const user = User.getInstance()
            const step = action.payload
            user.setValue({ step })

            state.step = step
        },
        setMode: (state, action: PayloadAction<Mode>) => {
            const user = User.getInstance()
            const mode = action.payload
            user.setValue({ mode })

            state.mode = mode
        },
        setQuizzes: (
            state,
            action: PayloadAction<{ id: string; quizzes: QuizType[] }>
        ) => {
            const { id, quizzes } = action.payload
            const { forms } = state
            const form = forms[id]
            form.quizzes = quizzes

            updateLocalForm(id, form)
        },
        addQuiz: (
            state,
            action: PayloadAction<{
                id: string
                newValue: Partial<QuizType>
            }>
        ) => {
            const { id, newValue } = action.payload
            const { forms } = state
            const form = forms[id]
            form.quizzes.push(newValue as Quiz)
        },
        updateQuiz: (
            state,
            action: PayloadAction<{
                formId: string
                quizId: string
                newValue: Partial<QuizType>
            }>
        ) => {
            const { formId, quizId, newValue } = action.payload
            const { forms } = state
            const form = forms[formId]

            const quizzes = Array.from(form.quizzes).map((el) =>
                el.id === quizId
                    ? {
                          ...el,
                          ...newValue,
                      }
                    : el
            )

            form.quizzes = quizzes

            updateLocalForm(formId, form)
        },
        setResults: (
            state,
            action: PayloadAction<{
                formId: string
                newValue: Partial<Results>
            }>
        ) => {
            const { formId, newValue } = action.payload
            const { forms } = state
            const form = forms[formId]
            const newResults = {
                ...form.results,
                ...newValue,
            }

            form.results = newResults
            updateLocalForm(formId, form)
        },
        setResult: (
            state,
            action: PayloadAction<{
                formId: string
                resultId: string
                newValue: Partial<Result>
            }>
        ) => {
            const { formId, resultId, newValue } = action.payload
            const { forms } = state
            const form = forms[formId] ?? {}
            const { list = {} } = form.results ?? {}
            list[resultId] = {
                ...list[resultId],
                ...newValue,
            }

            updateLocalForm(formId, form)
        },
        updateComponent: (
            state,
            action: PayloadAction<{
                formId: string
                resultId: string
                idPath: string[]
                newValue: Component
                deleted?: boolean
            }>
        ) => {
            const {
                formId,
                resultId,
                idPath,
                newValue,
                deleted = false,
            } = action.payload

            const { forms } = state
            const form = forms[formId] ?? {}
            const { list } = form.results ?? {}
            const result = list[resultId]

            if (result) {
                setNewComponents(result, idPath, newValue, Boolean(deleted))
                updateLocalForm(formId, form)
            }
        },
        updateFinal: (
            state,
            action: PayloadAction<{
                formId: string
                newValue: Partial<Final>
            }>
        ) => {
            const { formId, newValue } = action.payload
            const { forms } = state

            const form = forms[formId]
            form.final = { ...form.final, ...newValue }

            updateLocalForm(formId, form)
        },
        updateFinalComponents: (
            state,
            action: PayloadAction<{
                formId: string
                idPath: string[]
                newValue: Component
                deleted?: boolean
            }>
        ) => {
            const { formId, idPath, newValue, deleted = false } = action.payload

            const { forms } = state
            const form = forms[formId] ?? {}

            if (form) {
                const { final } = form

                if (!final.components) {
                    final.components = []
                }

                setNewComponents(final, idPath, newValue, Boolean(deleted))
                updateLocalForm(formId, form)
            }
        },
        updateForm: (
            state,
            action: PayloadAction<{
                id: string
                newValue: Partial<Form>
            }>
        ) => {
            const { id, newValue } = action.payload
            const { forms } = state
            const form = forms[id]

            forms[id] = {
                ...form,
                ...newValue,
            }

            updateLocalForm(id, forms[id])
        },
        reloadFromLocal: (state, action: PayloadAction<void>) => {
            const localForms = LocalForms.getInstance()
            const currentId = localForms.getCurrentId() ?? ''
            const form = localForms.getFormById(currentId)

            if (!_.isEmpty(form)) {
                state.currentId = currentId
                state.forms[currentId] = form
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createNew.fulfilled, (state, action) => {
            const { forms } = state
            const form = action.payload
            const { id } = form

            const localForms = LocalForms.getInstance()
            localForms.setCurrentId(id)
            localForms.setFormsId(id)
            localForms.setFormById(id, form)

            forms[id] = form
            state.currentId = id
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
    setResults,
    setResult,
    updateComponent,
    updateFinal,
    updateFinalComponents,
    updateForm,
    reloadFromLocal,
} = editorSlice.actions

export const selectCurrentId = (state: RootState) => state.editor.currentId

export const selectCurrentForm = (state: RootState) => {
    const { forms, currentId } = state.editor
    return forms[currentId] || {}
}

export const selectForm = (state: RootState, id: string) =>
    state.editor.forms[id]

const updateLocalForm = (id: string, value: Form) => {
    const localForms = LocalForms.getInstance()

    localForms.setFormById(id, value)
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
