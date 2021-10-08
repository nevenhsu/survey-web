import _ from 'lodash'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import surveyApi from 'services/surveyApi'
import User from 'utils/user'
import LocalForms from 'utils/forms'
import { EditorStep } from 'common/types'
import type { Mode, Form, Quiz, QuizType } from 'common/types'
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

            updateLocalForm(id, { ...form, quizzes })

            form.quizzes = quizzes
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

            updateLocalForm(formId, { ...form, quizzes })

            form.quizzes = quizzes
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
