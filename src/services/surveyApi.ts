import _ from 'lodash'
import axios from 'axios'
import { getDefaultSurvey } from 'utils/helper'
import { surveyFormatter, answerFormatter } from 'utils/formatter'
import { Mode } from 'common/types'
import type { Survey, Answer } from 'common/types'

type CreateNewResponse = {
    id: string
    createdAt: number
}

type UploadMediaResponse = {
    files: string[]
}

type AnswerResponse = {
    id: string
    surveyId: string
    createdAt: number
}

const surveyApi = {
    createNew: async (mode: Mode): Promise<Survey> => {
        const url = `${process.env.REACT_APP_URL}/survey`
        const { data } = await axios.post<CreateNewResponse>(url)

        const survey = getDefaultSurvey({ ...data, mode })

        const isOneInTwo = mode === Mode.oneInTwo
        const templateId = isOneInTwo ? '-one-in-two-mode' : '-dragger-mode'
        const templateData = await surveyApi.getSurvey(templateId)
        const template = _.omit(templateData, [
            'id',
            'createdAt',
            'updatedAt',
            'enable',
        ])

        const value = { ...survey, ...template }

        return value
    },
    uploadMedia: async (file?: string): Promise<string> => {
        if (file) {
            const url = `${process.env.REACT_APP_URL}/media`
            const formData = new FormData()
            formData.append('file', file)

            const { data } = await axios.post<UploadMediaResponse>(
                url,
                formData
            )
            const [img] = data.files ?? []

            return img ?? ''
        }

        return ''
    },
    getSurvey: async (id: string): Promise<Survey | undefined> => {
        if (id) {
            const url = `${process.env.REACT_APP_URL}/survey/${id}`
            const { data } = await axios.get<Survey>(url)
            return surveyFormatter(data)
        }
    },
    putSurvey: async (id: string, survey: Survey) => {
        if (id && survey) {
            const url = `${process.env.REACT_APP_URL}/survey/${id}`
            const { data } = await axios.put<Survey>(url, survey)
            return surveyFormatter(data)
        }
    },
    createNewAnswer: async (id: string) => {
        if (id) {
            const url = `${process.env.REACT_APP_URL}/survey/${id}/answer`
            const { data } = await axios.post<AnswerResponse>(url)
            return data
        }
    },
    putAnswer: async (surveyId: string, answerId: string, answer: Answer) => {
        if (surveyId && answerId && answer) {
            const url = `${process.env.REACT_APP_URL}/survey/${surveyId}/answer/${answerId}`
            const { data } = await axios.put<Answer>(url, answer)
            return answerFormatter(data)
        }
    },
}

export default surveyApi
