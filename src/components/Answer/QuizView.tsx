import * as React from 'react'
import _ from 'lodash'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useAppSelector, useAppDispatch } from 'hooks'
import {
    nextQuiz,
    updateAnswerValue,
    selectAnswerValue,
    updateStep,
} from 'store/slices/answer'
import { toNumber } from 'utils/helper'
import { QuizMode, AnswerStep } from 'common/types'
import type {
    QuizType,
    SelectionQuiz,
    SliderQuiz,
    AnswerValue,
} from 'common/types'

const PageView = React.lazy(() => import('components/Answer/PageView'))
const SortView = React.lazy(() => import('components/Answer/SortView'))
const FillView = React.lazy(() => import('components/Answer/FillView'))
const SliderView = React.lazy(() => import('components/Answer/SliderView'))
const SelectionView = React.lazy(
    () => import('components/Answer/SelectionView')
)

type QuizViewProps = {
    quiz?: QuizType
}

export default function QuizView(props: QuizViewProps) {
    const dispatch = useAppDispatch()

    const { quiz } = props
    const { id: quizId, required } = quiz ?? {}

    const validValue = checkValue(quiz)

    const answerValue = useAppSelector(selectAnswerValue(quizId))
    const lastQuiz = useAppSelector((state) => state.answer.lastQuiz)

    const [time, setTime] = React.useState(Date.now())

    const handleUpdateAnswer = (newValue: Partial<AnswerValue>) => {
        if (quizId && newValue) {
            dispatch(updateAnswerValue({ quizId, newValue }))
        }
    }

    const handleNext = () => {
        if (quizId && validValue) {
            const dwellTime = Date.now() - time
            const newValue = { dwellTime }

            dispatch(updateAnswerValue({ quizId, newValue }))
            dispatch(nextQuiz())
        }
    }

    const renderQuiz = (quiz?: QuizType) => {
        if (!quiz) {
            return <div />
        }

        const {
            mode,
            title,
            buttonColor,
            buttonText,
            buttonTextColor,
            buttonVariant,
        } = quiz

        const buttonProps = {
            buttonColor,
            buttonText,
            buttonTextColor,
            buttonVariant,
        }

        const { value, values = [] } = answerValue ?? {}

        switch (mode) {
            case QuizMode.page: {
                return (
                    <PageView
                        title={title}
                        quizButtonProps={{ buttonProps, onClick: handleNext }}
                    />
                )
            }
            case QuizMode.selection: {
                const {
                    choices = [],
                    tagsId = [],
                    maxChoices = 1,
                    showImage = false,
                    direction = 'column',
                } = quiz as SelectionQuiz

                return (
                    <SelectionView
                        title={title}
                        selectionProps={{
                            choices,
                            values,
                            tagsId,
                            maxChoices,
                            showImage,
                            direction,
                        }}
                        quizButtonProps={{
                            buttonProps,
                            disabled: !validValue,
                            onClick: handleNext,
                        }}
                        onChange={(event) => {
                            handleUpdateAnswer({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.sort: {
                const {
                    choices = [],
                    tagsId = [],
                    maxChoices = 4,
                    showImage = false,
                    direction,
                } = quiz as SelectionQuiz

                return (
                    <SortView
                        title={title}
                        selectionProps={{
                            choices,
                            values,
                            tagsId,
                            maxChoices,
                            showImage,
                            direction,
                        }}
                        quizButtonProps={{
                            buttonProps,
                            disabled: !validValue,
                            onClick: handleNext,
                        }}
                        onChange={(event) => {
                            handleUpdateAnswer({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.fill: {
                return (
                    <FillView
                        title={title}
                        value={`${value ?? ''}`}
                        quizButtonProps={{
                            buttonProps,
                            disabled: !validValue,
                            onClick: handleNext,
                        }}
                        onChange={(event) => {
                            handleUpdateAnswer({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.slider: {
                const { min, max } = quiz as SliderQuiz
                const val = toNumber(value) ?? min
                return (
                    <SliderView
                        title={title}
                        slider={{ value: val, min, max }}
                        quizButtonProps={{
                            buttonProps,
                            disabled: !validValue,
                            onClick: handleNext,
                        }}
                        onChange={(event) => {
                            handleUpdateAnswer({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
        }
    }

    React.useEffect(() => {
        if (quizId) {
            setTime(Date.now())
        }
    }, [quizId])

    React.useEffect(() => {
        if (lastQuiz) {
            dispatch(updateStep(AnswerStep.result))
        }
    }, [lastQuiz])

    return (
        <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{
                width: '100%',
                minHeight: '100vh',
                p: 1,
            }}
        >
            <React.Suspense fallback={<div />}>
                <Typography variant="caption" color="GrayText">
                    {required ? '必填' : ''}
                </Typography>
                {renderQuiz(quiz)}
            </React.Suspense>
        </Stack>
    )
}

function checkValue(quiz?: QuizType) {
    if (_.isEmpty(quiz)) {
        return false
    }

    const { mode, required } = quiz as QuizType

    if (required) {
        if (_.includes([QuizMode.slider, QuizMode.fill], mode)) {
            const { value } = quiz as SliderQuiz
            if (_.isNil(value) || `${value}` === '') {
                return false
            }
        }
        if (_.includes([QuizMode.sort, QuizMode.selection], mode)) {
            const { values } = quiz as SelectionQuiz
            if (_.isEmpty(values)) {
                return false
            }
        }
    }

    return true
}
