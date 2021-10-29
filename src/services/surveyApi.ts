import _ from 'lodash'
import axios from 'axios'
import { getDefaultSurvey } from 'utils/helper'
import { surveyFormatter } from 'utils/formatter'
import type { Mode, Survey } from 'common/types'

type CreateNewResponse = {
    id: string
    createdAt: number
}

type UploadMediaResponse = {
    files: string[]
}

const surveyApi = {
    createNew: async (mode: Mode): Promise<Survey> => {
        const url = `${process.env.REACT_APP_URL}/survey`
        const { data } = await axios.post<CreateNewResponse>(url)
        const survey = getDefaultSurvey({ ...data, mode })

        return survey
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
    createNewAnswer: async () => {},
}

export default surveyApi
