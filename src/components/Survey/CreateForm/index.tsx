import * as React from 'react'
import _ from 'lodash'
import Stack from '@mui/material/Stack'
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
        setLoading(true)
    }

    const handleClickBack = () => {
        dispatch(setStep(SurveyStep.start))
    }

    React.useEffect(() => {
        if (loading && mode) {
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
        } else {
            setLoading(false)
        }
    }, [loading])

    const renderView = () => {
        switch (mode) {
            case Mode.oneInTwo:
                return <OneInTwo />
            case Mode.dragger:
                return <Dragger />
        }
    }

    return (
        <>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                spacing={3}
                sx={{
                    position: 'relative',
                    p: 3,
                    height: 'calc(100vh - 64px)',
                }}
            >
                <ImageBox
                    className="absolute-center"
                    imageUrl="images/survey-cover.png"
                    objectFit="contain"
                    sx={{
                        height: '100%',
                        width: '100%',
                    }}
                    noBg
                />
                <Button
                    startIcon={<ArrowLeftIcon />}
                    sx={{ position: 'absolute', top: 0, left: 24 }}
                    onClick={handleClickBack}
                >
                    重新選擇
                </Button>
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
                    <Button variant="outlined" size="large">
                        預覽測驗
                    </Button>

                    <LoadingButton
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<AddIcon />}
                        onClick={handleClick}
                        disabled={!mode}
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        建立測驗
                    </LoadingButton>
                </Stack>
            </Stack>

            <React.Suspense fallback={<div />}>{renderView()}</React.Suspense>
        </>
    )
}
