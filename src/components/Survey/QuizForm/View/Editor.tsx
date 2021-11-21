import * as React from 'react'
import _ from 'lodash'
import { useAppDispatch } from 'hooks'
import { updateQuiz } from 'store/slices/survey'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
    FillView,
    SliderView,
    SelectionView,
    PageView,
    OneInTwoView,
    DraggerView,
} from 'components/Survey/QuizForm/Quiz'
import ImageUploader from 'components/common/ImageUploader'
import ThemeProvider from 'theme/ThemeProvider'
import { useAppSelector } from 'hooks'
import { getDeviceValue } from 'utils/helper'
import { selectDevice } from 'store/slices/userDefault'
import { QuizMode } from 'common/types'
import type {
    QuizType,
    SelectionQuiz,
    FillQuiz,
    SliderQuiz,
    OneInTwoQuiz,
    DraggerQuiz,
} from 'common/types'

type EditorProps = {
    surveyId?: string
    quiz?: QuizType
}

export default function Editor(props: EditorProps) {
    const { surveyId, quiz } = props
    const dispatch = useAppDispatch()

    const device = useAppSelector(selectDevice)

    const {
        id: quizId,
        mode,
        required,
        cover,
        backgroundColor,
        backgroundImage,
    } = quiz ?? {}

    const { image } = cover ?? {}

    const hasQuiz = Boolean(quizId)

    const handleUpdateQuiz = (newValue: Partial<QuizType>) => {
        if (surveyId && quizId) {
            dispatch(
                updateQuiz({
                    surveyId,
                    quizId,
                    newValue,
                })
            )
        }
    }

    const renderQuiz = () => {
        if (!surveyId || !quizId || !quiz) {
            return <div />
        }

        const { mode, title } = quiz

        switch (mode) {
            case QuizMode.page: {
                return (
                    <PageView
                        quizProps={quiz}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.fill: {
                return (
                    <FillView
                        quizProps={quiz as FillQuiz}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.slider: {
                return (
                    <SliderView
                        quizProps={quiz as SliderQuiz}
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
                return (
                    <SelectionView
                        quizProps={quiz as SelectionQuiz}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.oneInTwo: {
                return (
                    <OneInTwoView
                        quizProps={quiz as OneInTwoQuiz}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.dragger: {
                return (
                    <DraggerView
                        quizProps={quiz as DraggerQuiz}
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
            <ImageUploader
                bgImage={backgroundImage}
                sx={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor,
                }}
                onUploaded={(backgroundImage) => {
                    handleUpdateQuiz({
                        backgroundImage,
                    })
                }}
                hideButton
                hideDeleteButton
            />

            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
            >
                <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    sx={{
                        width: '100%',
                        minHeight: '100%',
                        p: 1,
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

                    {hasQuiz && mode !== QuizMode.dragger && (
                        <>
                            <ImageUploader
                                bgImage={image}
                                sx={{
                                    width: getDeviceValue(
                                        device,
                                        cover?.width
                                    ) as any,
                                    height: cover?.height,
                                    mt: `0 !important`,
                                }}
                                onUploaded={(image) => {
                                    handleUpdateQuiz({
                                        cover: { ...cover, image },
                                    })
                                }}
                                hideButton={Boolean(image)}
                            />
                            <Box sx={{ height: 16 }} />
                        </>
                    )}

                    {renderQuiz()}

                    <Box sx={{ height: 16 }} />
                </Stack>
            </Box>
        </ThemeProvider>
    )
}
