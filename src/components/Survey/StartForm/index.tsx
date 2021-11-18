import * as React from 'react'
import _ from 'lodash'
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
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 'tooltip',
                bgcolor: 'white',
            }}
        >
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    用好玩的測驗提升品牌知名度＆好感度！
                </Typography>
                <Typography variant="body1">
                    透過測驗模組讓測驗製作更簡單、省時
                </Typography>
            </Box>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                    height: 'calc(100vh - 172px)',
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
                    
                        <ImageBox imageUrl="images/one-in-two/cover.svg" objectFit="contain" sx={{ height: 300, mb: 4 }} />
                 

                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        二選一
                    </Typography>

                    <Box sx={{
                        px: 10}}
                    >
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            適合用來設計「心理測驗」般產出個人結果的測驗，像是：「從你的衣櫃偷窺你的戀愛性格」、「從你的飲食習慣推判你的健康狀態」
                        </Typography>
                    </Box>

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
                  
                    <ImageBox imageUrl="images/dragger/cover.svg" objectFit="contain" sx={{ height: 300, mb: 4 }} />
                 

                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        左右拖曳
                    </Typography>

                    <Box sx={{
                        px: 10}}
                    >
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            適合用來設計「挑戰型」測驗，像是：「測測看假新聞判讀你能拿幾分？」、「這些垃圾，你能丟對多少？」
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleClick(Mode.dragger)}
                    >
                        選擇測驗
                    </Button>
                </Box>
            </Stack>
        </Box>
    )
}
