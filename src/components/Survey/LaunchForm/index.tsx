import * as React from 'react'
import _ from 'lodash'
import { VariantType, useSnackbar } from 'notistack'
import formUrlEncoded from 'form-urlencoded'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'
import { styled } from '@mui/material/styles'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import { getAnswerURL } from 'utils/helper'
import { useAppSelector, useAppDispatch } from 'hooks'
import usePreview from 'hooks/usePreview'
import {
    selectCurrentSurvey,
    updateSurvey,
    saveSurvey,
} from 'store/slices/survey'
import type { OnChangeInput } from 'common/types'

const StyledTextField = styled(TextField)({
    width: '50vw',
    maxWidth: '600',
    '& .MuiInputBase-input': { padding: '8px 6px' },
})

export default function LaunchForm() {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const [uploading, setUploading] = React.useState(false)
    const [copied, setCopied] = React.useState<number>()
    const [qrCode, setQrCode] = React.useState<string>()
    const open = Boolean(qrCode)

    const survey = useAppSelector(selectCurrentSurvey)
    const { id, trackingId = [], enable } = survey ?? {}

    const { uploading: previewUploading, handlePreview } = usePreview(survey)

    const { url } = getAnswerURL(id)

    const notify = (message: string, variant: VariantType) => {
        enqueueSnackbar(message, { variant })
    }

    const handleAdd = () => {
        const newValue = { trackingId: [...trackingId, ''] }
        dispatch(updateSurvey({ id, newValue }))
    }

    const handleChange: OnChangeInput = (event) => {
        const { name, value } = event.target
        const newTrackingId = [...trackingId]
        _.set(newTrackingId, [Number(name)], value)

        const newValue = { trackingId: newTrackingId }
        dispatch(updateSurvey({ id, newValue }))
    }

    const handleDeploy = () => {
        if (!uploading) {
            toggleEnable()
        }
    }

    const toggleEnable = async () => {
        if (id) {
            setUploading(true)
            dispatch(saveSurvey({ ...survey, enable: !enable }))
                .unwrap()
                .then((data) => {
                    const { enable } = data ?? {}
                    setUploading(false)
                    notify(enable ? '發布成功!' : '取消成功！', 'success')
                })
                .catch((err) => {
                    console.error(err)
                    setUploading(false)
                    notify('Oops! 請檢查網路連線狀態', 'error')
                })
        }
    }

    const encodeUrl = (trackingId: string) => formUrlEncoded({ trackingId })

    return (
        <>
            <Box sx={{ px: 3, mb: 12 }}>
                <Box sx={{ pt: 12, mb: 6 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {enable
                                ? '恭喜！測驗發布完成！'
                                : '恭喜！測驗設定完成！'}
                        </Typography>
                        <Typography variant="body1">
                            你好棒，建議先完成預覽再正式發佈測驗
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ mb: 12 }}
                    >
                        <LoadingButton
                            variant="outlined"
                            loading={previewUploading}
                            disabled={previewUploading}
                            onClick={handlePreview}
                        >
                            {enable ? '開始測驗' : '預覽測驗'}
                        </LoadingButton>

                        <LoadingButton
                            variant="contained"
                            loading={uploading}
                            disabled={uploading}
                            onClick={handleDeploy}
                        >
                            {enable ? '取消發布' : '發布測驗'}
                        </LoadingButton>
                    </Stack>

                    <Divider />
                </Box>

                {enable && (
                    <>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            分享你的測驗
                        </Typography>

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={3}
                            sx={{ mb: 4 }}
                        >
                            <Typography variant="body1" sx={{ width: 120 }}>
                                測驗網址
                            </Typography>
                            <StyledTextField variant="outlined" value={url} />

                            <CopyToClipboard
                                text={url}
                                onCopy={() => setCopied(-1)}
                            >
                                <Button
                                    variant="contained"
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    {copied === -1 ? '已複製' : '複製'}
                                </Button>
                            </CopyToClipboard>

                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => setQrCode(url)}
                            >
                                QR Code
                            </Button>
                        </Stack>

                        <Typography variant="h6" gutterBottom>
                            設定其他流量的連結
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2 }}>
                            你將在分析報告中看到各連結的流量、填答率和轉換率
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            {trackingId.map((el, index) => {
                                const encodedUrl: string = `${url}?${encodeUrl(
                                    el
                                )}`

                                return (
                                    <Stack
                                        key={`${index}`}
                                        direction="row"
                                        alignItems="center"
                                        spacing={3}
                                        sx={{ mb: 2 }}
                                    >
                                        <StyledTextField
                                            name={`${index}`}
                                            value={el}
                                            onChange={handleChange}
                                            variant="filled"
                                            placeholder="輸入追蹤標記"
                                            sx={{ width: 120 }}
                                        />
                                        <StyledTextField
                                            variant="outlined"
                                            value={`${url}?trackingId=${el}`}
                                        />

                                        <CopyToClipboard
                                            text={encodedUrl}
                                            onCopy={() => setCopied(index)}
                                        >
                                            <Button
                                                variant="contained"
                                                sx={{ whiteSpace: 'nowrap' }}
                                            >
                                                {copied === index
                                                    ? '已複製'
                                                    : '複製'}
                                            </Button>
                                        </CopyToClipboard>

                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() =>
                                                setQrCode(encodedUrl)
                                            }
                                        >
                                            QR Code
                                        </Button>
                                    </Stack>
                                )
                            })}
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAdd}
                        >
                            新增
                        </Button>
                    </>
                )}
            </Box>

            <Modal open={open} onClose={() => setQrCode(undefined)}>
                <Box
                    className="absolute-center"
                    sx={{
                        width: 320,
                        height: 320,
                        bgcolor: 'background.paper',
                        boxShadow: 8,
                    }}
                >
                    <QRCode
                        className="absolute-center"
                        value={qrCode ?? url}
                        size={240}
                    />
                </Box>
            </Modal>
        </>
    )
}
