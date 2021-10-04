import axios from 'axios'

type CreateNewResponse = {
    id: string
    createdAt: number
}

const surveyApi = {
    createNew: async (): Promise<CreateNewResponse> => {
        const url = `${process.env.REACT_APP_URL}/survey`
        const { data } = await axios.post<CreateNewResponse>(url)

        return data
    },
}

export default surveyApi
