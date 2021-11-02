import * as React from 'react'
import _ from 'lodash'
import formurlencoded from 'form-urlencoded'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'
import { styled } from '@mui/material/styles'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import { getAnswerURL } from 'utils/helper'
import { useAppSelector, useAppDispatch } from 'hooks'
import { selectCurrentSurvey, updateSurvey } from 'store/slices/survey'
import type { OnChangeInput } from 'common/types'

const StyledTextField = styled(TextField)({
    width: '50vw',
    maxWidth: '600',
    '& .MuiInputBase-input': { padding: '8px 6px' },
})

export default function LaunchForm() {
    const dispatch = useAppDispatch()

    const [copied, setCopied] = React.useState<number>()
    const [qrCode, setQrCode] = React.useState<string>()
    const open = Boolean(qrCode)

    const survey = useAppSelector(selectCurrentSurvey)
    const { id, trackingId = [] } = survey ?? {}

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

    const { url, openWindow } = getAnswerURL(id)

    const encodeUrl = (trackingId: string) => formurlencoded({ trackingId })

    return (
        <>
            <Box sx={{ px: 3, mb: 12 }}>
                <Box sx={{ pt: 12, mb: 6 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            恭喜！測驗設定完成！
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
                        <Button variant="outlined">預覽測驗</Button>
                        <Button variant="contained">發布測驗</Button>
                    </Stack>

                    <Divider />
                </Box>

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

                    <CopyToClipboard text={url} onCopy={() => setCopied(-1)}>
                        <Button
                            variant="contained"
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            {copied === -1 ? '已複製' : '複製'}
                        </Button>
                    </CopyToClipboard>
                </Stack>

                <Typography variant="h6" gutterBottom>
                    設定其他流量的連結
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                    你將在分析報告中看到各連結的流量、填答率和轉換率
                </Typography>

                <Box sx={{ mb: 3 }}>
                    {trackingId.map((el, index) => {
                        const encodedUrl: string = `${url}?${encodeUrl(el)}`

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
                                        {copied === index ? '已複製' : '複製'}
                                    </Button>
                                </CopyToClipboard>

                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => setQrCode(encodedUrl)}
                                >
                                    QR Code
                                </Button>
                            </Stack>
                        )
                    })}
                </Box>

                <Button variant="contained" color="primary" onClick={handleAdd}>
                    新增
                </Button>
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
