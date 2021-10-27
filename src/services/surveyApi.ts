import _ from 'lodash'
import axios from 'axios'
import { getDefaultForm } from 'utils/helper'
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
    getForm: async (id: string) => {
        if (id) {
            const url = `${process.env.REACT_APP_URL}/survey/${id}`
            const { data } = await axios.get<Form>(url)
            return data
        }
    },
    putForm: async (id: string, form: Form) => {
        if (id && form) {
            const url = `${process.env.REACT_APP_URL}/survey/${id}`
            const { data } = await axios.put<Form>(url, form)
            return data
        }
    },
}

export default surveyApi
