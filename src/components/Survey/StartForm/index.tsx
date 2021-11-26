import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ImageBox from 'components/common/ImageBox'
import { useAppDispatch } from 'hooks'
import { setMode, setStep } from 'store/slices/survey'
import { Mode, SurveyStep } from 'common/types'

export default function StartForm() {
    const dispatch = useAppDispatch()

    const handleClick = (mode: Mode) => {
        dispatch(setMode(mode))
        dispatch(setStep(SurveyStep.create))
    }

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100vw',
                height: 'calc(100vh - 64px)',
                bgcolor: 'white',
                overflow: 'auto',
            }}
        >
            <Box sx={{ textAlign: 'center', py: 3, height: 180 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    用好玩的測驗
                    <br />
                    提升品牌知名度＆好感度！
                </Typography>
                <Typography variant="body1">
                    透過測驗模組讓測驗製作更簡單、省時
                </Typography>
            </Box>
            <Box sx={{ minHeight: 'calc(100vh - 244px)', bgcolor: '#FFE5BF' }}>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                    sx={{
                        py: 3,
                    }}
                >
                    <Box
                        sx={{
                            width: '50%',
                            height: '100%',
                            textAlign: 'center',
                            p: 4,
                        }}
                    >
                        <ImageBox
                            imageUrl="images/one-in-two/cover.png"
                            objectFit="contain"
                            sx={{ height: 232, mb: 2 }}
                        />

                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            二選一
                        </Typography>

                        <Box
                            sx={{
                                px: 10,
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{ mb: 2, px: { lg: 6 } }}
                            >
                                適合用來設計「心理測驗」般產出個人結果的測驗，像是：「從你的衣櫃偷窺你的戀愛性格」、「從你的飲食習慣推判你的健康狀態」
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => handleClick(Mode.oneInTwo)}
                        >
                            選擇測驗
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            width: '50%',
                            textAlign: 'center',
                            p: 4,
                        }}
                    >
                        <ImageBox
                            imageUrl="images/dragger/cover.png"
                            objectFit="contain"
                            sx={{ height: 232, mb: 2 }}
                        />

                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            左右拖曳
                        </Typography>

                        <Box
                            sx={{
                                px: 10,
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{ mb: 2, px: { lg: 6 } }}
                            >
                                適合用來設計「挑戰型」測驗，像是：「測測看假新聞判讀你能拿幾分？」、「這些垃圾，你能丟對多少？」
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => handleClick(Mode.dragger)}
                        >
                            選擇測驗
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}
