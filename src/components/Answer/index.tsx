import * as React from 'react'
import _ from 'lodash'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import { useAppSelector, useAppDispatch } from 'hooks'
import {
    getSurvey,
    selectStep,
    selectSurvey,
    selectQuizId,
} from 'store/slices/answer'
import { AnswerStep } from 'common/types'

type Params = {
    id?: string
}

const QuizView = React.lazy(() => import('components/Answer/QuizView'))

export default function Survey() {
    const dispatch = useAppDispatch()
    const { id } = useParams<Params>()

    const step = useAppSelector(selectStep)
    const { id: surveyId, quizzes = [] } = useAppSelector(selectSurvey) ?? {}
    const quizId = useAppSelector(selectQuizId)

    const quiz = _.find(quizzes, { id: quizId })
    const { backgroundColor, backgroundImage } = quiz ?? {}

    React.useEffect(() => {
        if (id) {
            dispatch(getSurvey(id))
        }
    }, [id])

    const renderView = () => {
        if (!surveyId) {
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
