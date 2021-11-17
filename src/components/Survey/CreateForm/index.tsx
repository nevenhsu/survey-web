import * as React from 'react'
import _ from 'lodash'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import ImageBox from 'components/common/ImageBox'
import { createNew, setStep } from 'store/slices/survey'
import { useAppDispatch, useAppSelector } from 'hooks'
import { Mode, SurveyStep } from 'common/types'
import AddIcon from 'mdi-react/AddIcon'
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon'

const OneInTwo = React.lazy(
    () => import('components/Survey/CreateForm/OneInTwo')
)
const Dragger = React.lazy(() => import('components/Survey/CreateForm/Dragger'))

export default function CreateForm() {
    const dispatch = useAppDispatch()

    const mode = useAppSelector((state) => state.survey.mode ?? '')

    const [loading, setLoading] = React.useState(false)

    const handleClick = () => {
        if (!loading && mode) {
            setLoading(true)
            handleCreate(mode)
        }
    }

    const handleClickBack = () => {
        dispatch(setStep(SurveyStep.start))
    }

    const handleCreate = (mode: Mode) => {
        dispatch(createNew(mode))
            .unwrap()
            .then((result) => {
                // handle result here
                setLoading(false)
                dispatch(setStep(SurveyStep.quiz))
            })
            .catch((error) => {
                console.error(error)
                setLoading(false)
            })
    }

    const renderView = () => {
        switch (mode) {
            case Mode.oneInTwo:
                return <OneInTwo />
            case Mode.dragger:
                return <Dragger />
        }
    }

    return (
        <Box sx={{ p: 4, pt: 2, bgcolor: 'grey.100' }}>
            <Box sx={{ mb: 2 }}>
                <Button startIcon={<ArrowLeftIcon />} onClick={handleClickBack}>
                    重新選擇
                </Button>
            </Box>

            <Box sx={{ p: 3, bgcolor: 'white' }}>
                <Typography variant="body1" fontWeight="bold">
                    測驗範本推薦
                </Typography>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={3}
                    sx={{
                        position: 'relative',
                        height: 'calc(100vh - 180px)',
                        '& *': {
                            position: 'relative',
                            zIndex: 1,
                        },
                    }}
                >
                    <ImageBox
                        className="absolute-center"
                        imageUrl="images/survey-cover.png"
                        objectFit="contain"
                        sx={{
                            height: '100%',
                            width: '100%',
                            zIndex: 0,
                        }}
                        noBg
                    />

                    <Typography variant="h4" fontWeight="bold">
                        洞察品牌受眾類型
                    </Typography>
                    <Typography variant="body1">
                        運用範本的題庫來建立客群標籤，並針對不同類型的填答者推送客製化問卷結果！
                    </Typography>

                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={2}
                    >
                        <Button
                            variant="contained"
                            color="inherit"
                            size="large"
                        >
                            預覽測驗
                        </Button>

                        <LoadingButton
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<AddIcon />}
                            onClick={handleClick}
                            disabled={!mode}
                            variant="contained"
                            color="secondary"
                            size="large"
                        >
                            建立測驗
                        </LoadingButton>
                    </Stack>
                </Stack>
                <React.Suspense fallback={<div />}>
                    {renderView()}
                </React.Suspense>
            </Box>
        </Box>
    )
}
