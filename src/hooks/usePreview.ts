import * as React from 'react'
import { VariantType, useSnackbar } from 'notistack'
import { getAnswerURL } from 'utils/helper'
import { useAppDispatch } from 'hooks'
import { saveSurvey } from 'store/slices/survey'
import type { Survey } from 'common/types'

export default function usePreview(survey?: Survey) {
    const { id: surveyId } = survey ?? {}

    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()
    const [uploading, setUploading] = React.useState(false)

    const { openWindow } = getAnswerURL(surveyId ?? '')

    const notify = (message: string, variant: VariantType) => {
        enqueueSnackbar(message, { variant })
    }

    const handlePreview = () => {
        if (!uploading && survey) {
            setUploading(true)
            dispatch(saveSurvey(survey))
                .unwrap()
                .then(() => {
                    openWindow()
                    setUploading(false)
                })
                .catch((err) => {
                    console.error(err)
                    notify('Oops! 請檢查網路連線狀態', 'error')
                    setUploading(false)
                })
        }
    }

    return {
        uploading,
        handlePreview,
    }
}
