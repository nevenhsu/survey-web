import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAppDispatch } from 'hooks'
import { setMode, setStep } from 'store/slices/survey'
import { Mode, SurveyStep } from 'common/types'
import DraggerModeImage from 'assets/images/DraggerModeImage'
import OneInTwoModeImage from 'assets/images/OneInTwoModeImage'

export default function StartForm() {
    const dispatch = useAppDispatch()

    const handleClick = (mode: Mode) => {
        dispatch(setMode(mode))
        dispatch(setStep(SurveyStep.create))
    }

    return (
        <>
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Yo! 創建測驗的人生面臨十字路口了嗎？
                </Typography>
                <Typography variant="body1">
                    運用模組來建立客群標籤，並針對不同類型的填答者推送客製化問卷結果！
                </Typography>
            </Box>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                    height: 'calc(100vh - 224px)',
                    bgcolor: (theme) => theme.palette.grey[50],
                }}
            >
                <Box
                    sx={{
                        width: '50%',
                        textAlign: 'center',
                        p: 6,
                    }}
                >
                    <Box sx={{ height: 250, mb: 4 }}>
                        <OneInTwoModeImage
                            style={{ width: 'auto', height: '100%' }}
                        />
                    </Box>

                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        二選一
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 4 }}>
                        Description Sentences Description SentencesDescription
                        Sentences Description SentencesDescription Sentences
                        Description SentencesDescription Sentences Description
                        Sentences
                    </Typography>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleClick(Mode.oneInTwo)}
                    >
                        選擇測驗
                    </Button>
                </Box>
                <Box
                    sx={{
                        width: '50%',
                        textAlign: 'center',
                        p: 6,
                    }}
                >
                    <Box sx={{ height: 250, mb: 4 }}>
                        <DraggerModeImage
                            style={{ width: 'auto%', height: '100%' }}
                        />
                    </Box>

                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        拖曳
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 4 }}>
                        Description Sentences Description SentencesDescription
                        Sentences Description SentencesDescription Sentences
                        Description SentencesDescription Sentences Description
                        Sentences
                    </Typography>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleClick(Mode.dragger)}
                    >
                        選擇測驗
                    </Button>
                </Box>
            </Stack>
        </>
    )
}
