import * as React from 'react'
import _ from 'lodash'
import { useAppDispatch } from 'hooks'
import { updateQuiz } from 'store/slices/survey'
import Stack from '@mui/material/Stack'
import {
    FillView,
    SliderView,
    SelectionView,
    PageView,
    OneInTwoView,
} from 'components/Survey/QuizForm/Quiz'
import ImageUploader from 'components/common/ImageUploader'
import ThemeProvider from 'theme/ThemeProvider'
import { QuizMode } from 'common/types'
import type {
    QuizType,
    SelectionQuiz,
    FillQuiz,
    SliderQuiz,
    OneInTwoQuiz,
} from 'common/types'

type EditorProps = {
    surveyId?: string
    quiz?: QuizType
}

export default function Editor(props: EditorProps) {
    const { surveyId, quiz } = props
    const dispatch = useAppDispatch()

    const { image, backgroundColor, backgroundImage } = quiz ?? {}

    const handleUpdateQuiz = (newValue: Partial<QuizType>) => {
        if (surveyId && quiz) {
            dispatch(
                updateQuiz({
                    surveyId,
                    quizId: quiz.id,
                    newValue,
                })
            )
        }
    }

    const renderQuiz = () => {
        if (!surveyId || !quiz) {
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
                return (
                    <PageView
                        title={title}
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
                const { min, max } = quiz as SliderQuiz
                return (
                    <SliderView
                        title={title}
                        quizProps={{ min, max }}
                        buttonProps={buttonProps}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.sort:
            case QuizMode.selection: {
                const {
                    choices = [],
                    maxChoices = 4,
                    showImage = false,
                    direction,
                } = quiz as SelectionQuiz
                return (
                    <SelectionView
                        title={title}
                        quizProps={{
                            choices,
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
            case QuizMode.oneInTwo: {
                const {
                    choices = [],
                    direction,
                    showImage,
                } = quiz as OneInTwoQuiz

                return (
                    <OneInTwoView
                        title={title}
                        quizProps={{
                            choices,
                            direction,
                            showImage,
                        }}
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
        <ThemeProvider mode="light">
            <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{
                    width: '100%',
                    minHeight: '100%',
                    p: 1,
                    backgroundColor,
                }}
            >
                <ImageUploader
                    bgImage={backgroundImage}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        mt: `0 !important`,
                    }}
                    onUploaded={(backgroundImage) => {
                        handleUpdateQuiz({
                            backgroundImage,
                        })
                    }}
                    hideButton
                />

                <ImageUploader
                    bgImage={image}
                    sx={{ width: 'auto', height: '16vh', mt: `0 !important` }}
                    onUploaded={(image) => {
                        handleUpdateQuiz({
                            image,
                        })
                    }}
                    hideButton={Boolean(image)}
                />

                {renderQuiz()}
            </Stack>
        </ThemeProvider>
    )
}