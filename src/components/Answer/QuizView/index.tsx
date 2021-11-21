import * as React from 'react'
import _ from 'lodash'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ImageBox from 'components/common/ImageBox'
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
    DraggerQuiz,
    OneInTwoQuiz,
    SelectionQuiz,
    SliderQuiz,
    FillQuiz,
    AnswerValue,
} from 'common/types'

const PageView = React.lazy(
    () => import('components/Answer/QuizView/Quiz/PageView')
)
const SortView = React.lazy(
    () => import('components/Answer/QuizView/Quiz/SortView')
)
const FillView = React.lazy(
    () => import('components/Answer/QuizView/Quiz/FillView')
)
const SliderView = React.lazy(
    () => import('components/Answer/QuizView/Quiz/SliderView')
)
const SelectionView = React.lazy(
    () => import('components/Answer/QuizView/Quiz/SelectionView')
)
const DraggerView = React.lazy(
    () => import('components/Answer/QuizView/Quiz/DraggerView')
)
const OneInTwoView = React.lazy(
    () => import('components/Answer/QuizView/Quiz/OneInTwoView')
)

type QuizViewProps = {
    quiz?: QuizType
}

export default function QuizView(props: QuizViewProps) {
    const dispatch = useAppDispatch()

    const { quiz } = props
    const {
        id: quizId,
        required,
        cover,
        backgroundImage,
        backgroundColor,
    } = quiz ?? {}

    const { image } = cover ?? {}

    const answerValue = useAppSelector(selectAnswerValue(quizId))
    const lastQuiz = useAppSelector((state) => state.answer.lastQuiz)

    const [time, setTime] = React.useState(Date.now())

    const validValue = checkValue({ ...quiz, ...answerValue } as any)

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

        const { mode } = quiz

        switch (mode) {
            case QuizMode.page: {
                return (
                    <PageView
                        quizProps={quiz}
                        buttonProps={{
                            onClick: handleNext,
                        }}
                    />
                )
            }
            case QuizMode.dragger: {
                return (
                    <DraggerView
                        quizProps={{ ...quiz, ...answerValue } as DraggerQuiz}
                        onChange={(event) => {
                            handleUpdateAnswer({
                                [event.target.name]: event.target.value,
                            })
                        }}
                        onDone={handleNext}
                    />
                )
            }
            case QuizMode.oneInTwo: {
                return (
                    <OneInTwoView
                        quizProps={{ ...quiz, ...answerValue } as OneInTwoQuiz}
                        onChange={(event) => {
                            handleUpdateAnswer({
                                [event.target.name]: event.target.value,
                            })
                        }}
                        onDone={handleNext}
                    />
                )
            }
            case QuizMode.selection: {
                return (
                    <SelectionView
                        quizProps={{ ...quiz, ...answerValue } as SelectionQuiz}
                        buttonProps={{
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
                return (
                    <SortView
                        quizProps={{ ...quiz, ...answerValue } as SelectionQuiz}
                        buttonProps={{
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
                        quizProps={{ ...quiz, ...answerValue } as FillQuiz}
                        buttonProps={{
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
                const { min } = (quiz ?? {}) as SliderQuiz
                return (
                    <SliderView
                        quizProps={
                            {
                                ...quiz,
                                value: toNumber(answerValue?.value) ?? min,
                            } as SliderQuiz
                        }
                        buttonProps={{
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
        <>
            <Box
                sx={{
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
                    top: 0,
                    left: 0,
                    background: backgroundImage
                        ? `center/cover no-repeat url(${backgroundImage})`
                        : '',
                    backgroundColor,
                }}
            />
            <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '100vh',
                    p: 1,
                    zIndex: 1,
                }}
            >
                <Box sx={{ height: 16 }} />

                {required && (
                    <>
                        <Typography variant="caption" color="GrayText">
                            必填
                        </Typography>
                        <Box />
                    </>
                )}

                {Boolean(image) && (
                    <ImageBox
                        imageUrl={image}
                        sx={{
                            width: cover?.width ?? 'auto',
                            height: cover?.height ?? 'auto',
                            mt: `0 !important`,
                        }}
                    />
                )}

                <React.Suspense fallback={<div />}>
                    {renderQuiz(quiz)}
                </React.Suspense>

                <Box sx={{ height: 16 }} />
            </Stack>
        </>
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
