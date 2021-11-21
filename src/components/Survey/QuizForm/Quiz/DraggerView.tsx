import * as React from 'react'
import _ from 'lodash'
import Slick from 'react-slick'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import {
    StyledTextField,
    DraggerChoiceView,
    StyledCustomButton,
} from 'components/Survey/QuizForm/Shares'
import AddIcon from 'mdi-react/AddIcon'
import { getDefaultDraggerChoice } from 'utils/helper'
import type {
    OnChangeInput,
    OnButtonClink,
    DraggerQuiz,
    DraggerChoiceType,
} from 'common/types'

export default function DraggerView(props: {
    quizProps: Omit<DraggerQuiz, 'values'>
    onChange: OnChangeInput
}) {
    const { quizProps, onChange } = props
    const { title, choices = [], showImage, left, right } = quizProps

    const handleChange = (name: string, value: any) => {
        onChange({ target: { name, value } } as any)
    }

    const handleAddChoice: OnButtonClink = () => {
        const value = [...choices, getDefaultDraggerChoice(left.id)]
        handleChange('choices', value)
    }

    const handleChangeChoice = (value: DraggerChoiceType, choiceId: string) => {
        const newChoice = _.map(choices, (el) =>
            el.id === choiceId ? { ...el, ...value } : el
        )

        handleChange('choices', newChoice)
    }

    const handleDelete = (choiceId: string) => {
        const newChoice = _.filter(choices, (el) => el.id !== choiceId)

        handleChange('choices', newChoice)
    }

    const handleCopyStyle = (id: string) => {
        const choice = _.find(choices, { id })
        if (choice) {
            const { color, bgcolor, variant, fontWeight, padding } = choice
            const value = _.map(choices, (el) => ({
                ...el,
                color,
                bgcolor,
                variant,
                fontWeight,
                padding,
            }))

            handleChange('choices', value)
        }
    }

    return (
        <>
            <StyledTextField
                variant="standard"
                placeholder="請輸入您的文字"
                textProps={title}
                onCustomize={(value) => handleChange('title', value)}
                multiline
            />

            <Box sx={{ height: 16 }} />

            <Box
                sx={{
                    width: 4 / 5,
                    '& .slick-track': {
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .slick-prev:before': {
                        color: (theme) => theme.palette.primary.main,
                    },
                    '& .slick-next:before': {
                        color: (theme) => theme.palette.primary.main,
                    },
                    '& .slick-dots li': {
                        height: 10,
                        width: 10,
                        mx: 0.25,
                    },
                    '& .slick-dots button': {
                        height: 10,
                        width: 10,
                    },
                }}
            >
                <Slick slidesToShow={1} slidesToScroll={1} dots arrows infinite>
                    {choices.map((el) => (
                        <Box key={el.id} sx={{ p: 1 }}>
                            <DraggerChoiceView
                                choice={el}
                                showImage={showImage}
                                onChange={(choice) =>
                                    handleChangeChoice(choice, el.id)
                                }
                            />
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-evenly"
                            >
                                <Button
                                    color="primary"
                                    onClick={() => handleCopyStyle(el.id)}
                                >
                                    套用所有
                                </Button>
                                <Button
                                    color="error"
                                    onClick={() => handleDelete(el.id)}
                                >
                                    刪除選項
                                </Button>
                            </Stack>
                        </Box>
                    ))}
                </Slick>
            </Box>

            <Box sx={{ height: 16 }} />

            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddChoice}
                sx={{
                    bgcolor: 'white',
                    '&:hover': {
                        bgcolor: 'white',
                    },
                }}
            >
                新增選項
            </Button>

            <Box sx={{ height: 16 }} />

            <Stack
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={2}
                sx={{ width: '100%' }}
            >
                <StyledCustomButton
                    customProps={left}
                    onCustomize={(value) => handleChange('left', value)}
                    defaultText="左選項"
                />
                <StyledCustomButton
                    customProps={right}
                    onCustomize={(value) => handleChange('right', value)}
                    defaultText="右選項"
                />
            </Stack>
        </>
    )
}
