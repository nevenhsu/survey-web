import * as React from 'react'
import _ from 'lodash'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import { useAppSelector, useAppDispatch } from 'hooks'
import {
    getForm,
    selectStep,
    selectForm,
    selectQuizId,
} from 'store/slices/survey'
import { SurveyStep } from 'common/types'

type Params = {
    id?: string
}

const QuizView = React.lazy(() => import('components/Survey/QuizView'))

export default function Survey() {
    const dispatch = useAppDispatch()
    const { id } = useParams<Params>()

    const step = useAppSelector(selectStep)
    const { id: formId, quizzes = [] } = useAppSelector(selectForm) ?? {}
    const quizId = useAppSelector(selectQuizId)

    const quiz = _.find(quizzes, { id: quizId })
    const { backgroundColor, backgroundImage } = quiz ?? {}

    React.useEffect(() => {
        if (id) {
            dispatch(getForm(id))
        }
    }, [id])

    const renderView = () => {
        if (!formId) {
            return <div />
        }

        switch (step) {
            case SurveyStep.quiz: {
                return <QuizView quiz={quiz} />
            }
            case SurveyStep.result:
            case SurveyStep.final: {
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
