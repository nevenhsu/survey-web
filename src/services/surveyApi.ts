import axios from 'axios'
import { setId } from 'utils/helper'
import { QuizMode } from 'common/types'
import type { Mode, Form } from 'common/types'

type CreateNewResponse = {
    id: string
    createdAt: number
}

const surveyApi = {
    createNew: async (mode: Mode): Promise<Form> => {
        const url = `${process.env.REACT_APP_URL}/survey`
        const { data } = await axios.post<CreateNewResponse>(url)

        const form: Form = {
            ...data,
            mode,
            quizzes: [
                {
                    id: setId(),
                    mode: QuizMode.page,
                    title: '測驗標題',
                },
            ],
            tags: {},
            updatedAt: data.createdAt,
        }

        return form
    },
}

export default surveyApi
