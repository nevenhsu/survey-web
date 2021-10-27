import * as React from 'react'
import _ from 'lodash'
import Stack from '@mui/material/Stack'
import { QuizMode } from 'common/types'
import type {
    QuizType,
    SelectionQuiz,
    SliderQuiz,
    FillQuiz,
} from 'common/types'

const PageView = React.lazy(() => import('components/Survey/PageView'))
const SortView = React.lazy(() => import('components/Survey/SortView'))
const FillView = React.lazy(() => import('components/Survey/FillView'))
const SliderView = React.lazy(() => import('components/Survey/SliderView'))
const SelectionView = React.lazy(
    () => import('components/Survey/SelectionView')
)

type QuizViewProps = {
    quiz?: QuizType
}

export default function QuizView(props: QuizViewProps) {
    const { quiz } = props
    const { id: quizId } = quiz ?? {}

    const handleUpdateQuiz = (newValue: Partial<QuizType>) => {
        if (quizId) {
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

        switch (mode) {
            case QuizMode.page: {
                return <PageView title={title} buttonProps={buttonProps} />
            }
            case QuizMode.selection: {
                const {
                    choices = [],
                    values = [],
                    tagsId = [],
                    maxChoices = 1,
                    showImage = false,
                    direction,
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
                        buttonProps={buttonProps}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.sort: {
                const {
                    choices = [],
                    values = [],
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
                        buttonProps={buttonProps}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.fill: {
                const { value = '' } = quiz as FillQuiz
                return (
                    <FillView
                        title={title}
                        value={value}
                        buttonProps={buttonProps}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.slider: {
                const { value, min, max } = quiz as SliderQuiz
                return (
                    <SliderView
                        title={title}
                        slider={{ value, min, max }}
                        buttonProps={buttonProps}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
        }
    }

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
                {renderQuiz(quiz)}
            </React.Suspense>
        </Stack>
    )
}
