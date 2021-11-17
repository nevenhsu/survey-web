import * as React from 'react'
import _ from 'lodash'
import { VariantType, useSnackbar } from 'notistack'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import { useAppSelector, useAppDispatch } from 'hooks'
import {
    getSurvey,
    createNewAnswer,
    selectStep,
    selectSurvey,
    selectAnswer,
    selectQuizId,
} from 'store/slices/answer'
import { AnswerStep } from 'common/types'

type Params = {
    id?: string
}

const QuizView = React.lazy(() => import('components/Answer/QuizView/index'))
const ResultView = React.lazy(
    () => import('components/Answer/ResultView/index')
)
const FinalView = React.lazy(() => import('components/Answer/FinalView/index'))

export default function Survey() {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const { id } = useParams<Params>()

    const step = useAppSelector(selectStep)
    const {
        id: surveyId,
        quizzes = [],
        enable,
        setting,
    } = useAppSelector(selectSurvey) ?? {}

    const { showProgress } = setting ?? {}

    const { id: answerId } = useAppSelector(selectAnswer) ?? {}
    const quizId = useAppSelector(selectQuizId)

    const [progress, setProgress] = React.useState(0)

    const quiz = _.find(quizzes, { id: quizId })
    const { backgroundColor, backgroundImage } = quiz ?? {}

    const notify = (message: string, variant: VariantType) => {
        enqueueSnackbar(message, { variant })
    }

    React.useEffect(() => {
        if (id) {
            dispatch(getSurvey(id))
                .unwrap()
                .catch((err) => {
                    console.error(err)
                    notify('Oops! 請檢查網路連線狀態', 'error')
                })
        }
    }, [id])

    React.useEffect(() => {
        if (id && enable) {
            dispatch(createNewAnswer(id))
                .unwrap()
                .catch((err) => {
                    console.error(err)
                    notify('Oops! 請檢查網路連線狀態', 'error')
                })
        }
    }, [id, enable])

    React.useEffect(() => {
        if (quizId && quizzes.length) {
            const num = _.findIndex(quizzes, { id: quizId }) + 1
            const val = _.round((num / quizzes.length) * 100)
            setProgress(val)
            return
        }
        setProgress(0)
    }, [quizId, quizzes])

    const renderView = () => {
        if (!surveyId) {
            return <div />
        }

        switch (step) {
            case AnswerStep.quiz: {
                return (
                    <>
                        {showProgress && (
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    width: '100%',
                                }}
                            />
                        )}
                        <QuizView quiz={quiz} />
                    </>
                )
            }
            case AnswerStep.result: {
                return <ResultView />
            }
            case AnswerStep.final: {
                return <FinalView />
            }
        }
    }

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                minHeight: '100vh',
                pb: 4,
                backgroundColor,
                background: backgroundImage
                    ? `center / cover no-repeat url(${backgroundImage})`
                    : '',
            }}
        >
            <React.Suspense fallback={<div />}>{renderView()}</React.Suspense>
            {Boolean(surveyId) && !enable && (
                <Typography
                    variant="subtitle1"
                    sx={{
                        position: 'absolute',
                        left: 4,
                        top: 4,
                        color: 'primary.main',
                    }}
                >
                    預覽模式
                </Typography>
            )}
        </Box>
    )
}
