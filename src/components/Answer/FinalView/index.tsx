import * as React from 'react'
import _ from 'lodash'
import { VariantType, useSnackbar } from 'notistack'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'
import Typography from '@mui/material/Typography'
import InfoForm from 'components/common/InfoForm'
import { ComponentList } from 'components/common/Component/View'
import ArrowUpCircleIcon from 'mdi-react/ArrowUpCircleIcon'
import { useAppSelector, useAppDispatch } from 'hooks'
import { selectSurvey, selectAnswer, updateFinal } from 'store/slices/answer'
import surveyApi from 'services/surveyApi'
import type { OnChangeInput } from 'common/types'

export default function FinalView() {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const answer = useAppSelector(selectAnswer)
    const { id: answerId } = answer

    const survey = useAppSelector(selectSurvey)
    const { id: surveyId, final, enable } = survey ?? {}
    const { components = [], bgcolor, setting } = final ?? {}
    const { info } = setting ?? {}

    const [uploading, setUploading] = React.useState(false)
    const [done, setDone] = React.useState(false)

    const handleChangeData: OnChangeInput = (event) => {
        const { name, value } = event.target
        const newValue = {
            [name]: value,
        }

        dispatch(updateFinal(newValue))
    }

    const handleSubmit = () => {
        if (enable && !done && !uploading) {
            submit()
        }
    }

    const submit = async () => {
        if (surveyId) {
            setUploading(true)

            try {
                await surveyApi.putAnswer(surveyId, answerId, answer)
                setUploading(false)
                setDone(true)
                notify('恭喜! 完成問券!', 'success')
            } catch (err) {
                console.error(err)
                notify('Oops! 請檢查網路連線狀態', 'error')
                setUploading(false)
            }
        }
    }

    const notify = (message: string, variant: VariantType) => {
        enqueueSnackbar(message, { variant })
    }

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    bgcolor,
                }}
            />

            <ComponentList components={components} />
            <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto', my: 4 }}>
                <InfoForm
                    data={answer?.final ?? {}}
                    setting={info}
                    onChange={handleChangeData}
                />
            </Box>

            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <LoadingButton
                    variant="contained"
                    loadingPosition="end"
                    endIcon={<ArrowUpCircleIcon />}
                    loading={uploading}
                    disabled={uploading}
                    onClick={() => handleSubmit()}
                    sx={{ mb: 2 }}
                >
                    {done ? '完成' : '提交'}
                </LoadingButton>

                {!enable && (
                    <Typography
                        variant="caption"
                        display="block"
                        sx={{ color: 'grey.500' }}
                    >
                        預覽模式不支援提交
                    </Typography>
                )}
            </Box>
        </Box>
    )
}
