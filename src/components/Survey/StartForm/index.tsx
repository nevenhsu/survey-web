import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ImageBox from 'components/common/ImageBox'
import { useAppDispatch } from 'hooks'
import { setMode, setStep } from 'store/slices/survey'
import User from 'utils/user'
import { Mode, SurveyStep } from 'common/types'

export default function StartForm() {
    const dispatch = useAppDispatch()

    const handleClick = (mode: Mode) => {
        const user = User.getInstance()
        user.setValue({ mode })

        dispatch(setMode(mode))
        dispatch(setStep(SurveyStep.create))
    }

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100vw',
                height: 'calc(100vh - 64px)',
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
            <Box sx={{ py: 6, bgcolor: '#FFE5BF' }}>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box
                        sx={{
                            width: '100%',
                            textAlign: 'center',
                            px: 10,
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

                        <Typography
                            variant="body1"
                            sx={{ mb: 2, maxWidth: 328, mx: 'auto' }}
                        >
                            適合用來設計「心理測驗」般產出個人結果的測驗，像是：「從你的衣櫃偷窺你的戀愛性格」、「從你的飲食習慣推判你的健康狀態」
                        </Typography>

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
                        sx={{ flex: '0 0 1px', height: 'calc(100vh - 340px)' }}
                    />
                    <Box
                        sx={{
                            width: '100%',
                            textAlign: 'center',
                            px: 10,
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

                        <Typography
                            variant="body1"
                            sx={{ mb: 2, maxWidth: 328, mx: 'auto' }}
                        >
                            適合用來設計「挑戰型」測驗，像是：「測測看假新聞判讀你能拿幾分？」、「這些垃圾，你能丟對多少？」
                        </Typography>

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
