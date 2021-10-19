import _ from 'lodash'
import axios from 'axios'
import { setId, getDefaultForm } from 'utils/helper'
import { QuizMode } from 'common/types'
import type { Mode, Form } from 'common/types'

type CreateNewResponse = {
    id: string
    createdAt: number
}

type UploadMediaResponse = {
    files: string[]
}

const surveyApi = {
    createNew: async (mode: Mode): Promise<Form> => {
        const url = `${process.env.REACT_APP_URL}/survey`
        const { data } = await axios.post<CreateNewResponse>(url)
        const form = getDefaultForm({ ...data, mode })

        return form
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
}

export default surveyApi
