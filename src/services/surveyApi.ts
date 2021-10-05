import axios from 'axios'
import { setId } from 'utils/helper'
import { QuizMode } from 'types/customTypes'
import type { Mode, Form } from 'types/customTypes'

type CreateNewResponse = {
    id: string
    createdAt: number
}

const surveyApi = {
    createNew: async (mode: Mode): Promise<Form> => {
        const url = `${process.env.REACT_APP_URL}/survey`
        const { data } = await axios.post<CreateNewResponse>(url)

        return {
            ...data,
            mode,
            quizzes: [
                {
                    id: setId(),
                    mode: QuizMode.cover,
                    title: '測驗標題',
                },
            ],
            updatedAt: data.createdAt,
        }
    },
}

export default surveyApi
