import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { ComponentList } from 'components/common/ComponentView/View'
import InfoForm from 'components/Final/InfoForm'
import ArrowUpCircleIcon from 'mdi-react/ArrowUpCircleIcon'
import { useAppSelector, useAppDispatch } from 'hooks'
import { selectSurvey, selectAnswer, updateFinal } from 'store/slices/answer'
import type { OnChangeInput } from 'common/types'

export default function FinalView() {
    const dispatch = useAppDispatch()

    const answer = useAppSelector(selectAnswer)

    const survey = useAppSelector(selectSurvey)
    const { id: surveyId, final, enable } = survey ?? {}
    const { components = [], data } = final ?? {}

    const [uploading, setUploading] = React.useState(false)

    const handleDataChange: OnChangeInput = (event) => {
        const { name, value } = event.target
        const newValue = {
            [name]: value,
        }

        dispatch(updateFinal(newValue))
    }

    const handleSubmit = () => {
        if (surveyId && enable && !uploading) {
            // TODO: submit answer
        }
    }

    return (
        <>
            <ComponentList components={components} />
            <InfoForm data={answer?.final ?? {}} onChange={handleDataChange} />
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <LoadingButton
                    variant="contained"
                    loadingPosition="end"
                    endIcon={<ArrowUpCircleIcon />}
                    loading={uploading}
                    disabled={uploading}
                    onClick={() => handleSubmit()}
                >
                    儲存
                </LoadingButton>
            </Box>
        </>
    )
}
