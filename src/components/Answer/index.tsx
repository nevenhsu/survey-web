import * as React from 'react'
import _ from 'lodash'
import { VariantType, useSnackbar } from 'notistack'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
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

const QuizView = React.lazy(() => import('components/Answer/QuizView'))

export default function Survey() {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const { id } = useParams<Params>()

    const step = useAppSelector(selectStep)
    const { id: surveyId, quizzes = [] } = useAppSelector(selectSurvey) ?? {}
    const { id: answerId } = useAppSelector(selectAnswer) ?? {}
    const quizId = useAppSelector(selectQuizId)

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
            dispatch(createNewAnswer(id))
                .unwrap()
                .catch((err) => {
                    console.error(err)
                    notify('Oops! 請檢查網路連線狀態', 'error')
                })
        }
    }, [id])

    React.useEffect(() => {}, [])

    const renderView = () => {
        if (!surveyId || !answerId) {
            return <div />
        }

        switch (step) {
            case AnswerStep.quiz: {
                return <QuizView quiz={quiz} />
            }
            case AnswerStep.result:
            case AnswerStep.final: {
            }
        }
    }

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                minHeight: '100vh',
                backgroundColor,
                background: backgroundImage
                    ? `center / cover no-repeat url(${backgroundImage})`
                    : '',
            }}
        >
            <React.Suspense fallback={<div />}>{renderView()}</React.Suspense>
        </Box>
    )
}
