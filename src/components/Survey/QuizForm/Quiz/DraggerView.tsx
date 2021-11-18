import * as React from 'react'
import _ from 'lodash'
import Slick from 'react-slick'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import {
    StyledTextField,
    DraggerChoiceView,
    CustomButton,
} from 'components/Survey/QuizForm/Shares'
import AddIcon from 'mdi-react/AddIcon'
import { getDefaultDraggerChoice } from 'utils/helper'
import type {
    OnChangeInput,
    OnButtonClink,
    DraggerType,
    CustomButtonType,
} from 'common/types'

export default function DraggerView(props: {
    title: string
    quizProps: Omit<DraggerType, 'values'>
    onChange: OnChangeInput
}) {
    const { title, quizProps, onChange } = props
    const { choices = [], showImage, left, right } = quizProps

    const leftButton: CustomButtonType = {
        buttonColor: left.buttonColor,
        buttonText: left.buttonText,
        buttonTextColor: left.buttonTextColor,
        buttonVariant: left.buttonVariant,
    }

    const rightButton: CustomButtonType = {
        buttonColor: right.buttonColor,
        buttonText: right.buttonText,
        buttonTextColor: right.buttonTextColor,
        buttonVariant: right.buttonVariant,
    }

    const handleAddChoice: OnButtonClink = () => {
        const event = {
            target: {
                name: 'choices',
                value: [...choices, getDefaultDraggerChoice(left.id)],
            },
        }

        onChange(event as any)
    }

    const handleChangeChoice = (
        event: React.ChangeEvent<HTMLInputElement>,
        choiceId: string
    ) => {
        const { name, value } = event.target

        const newChoice = _.map(choices, (el) =>
            el.id === choiceId ? { ...el, [name]: value } : el
        )
        onChange({
            target: {
                name: 'choices',
                value: newChoice,
            },
        } as any)
    }

    const handleChangeButton = (
        event: React.ChangeEvent<HTMLInputElement>,
        target: 'right' | 'left'
    ) => {
        const { name, value } = event.target
        const { [target]: val } = quizProps

        const newValue = {
            ...val,
            [name]: value,
        }

        onChange({
            target: {
                name: target,
                value: newValue,
            },
        } as any)
    }

    return (
        <>
            <StyledTextField
                variant="standard"
                placeholder="請輸入您的文字"
                name="title"
                value={title}
                onChange={onChange}
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
                                label={el.label}
                                image={el.image}
                                showImage={showImage}
                                onChange={(event) =>
                                    handleChangeChoice(event, el.id)
                                }
                            />
                        </Box>
                    ))}
                </Slick>
            </Box>

            <Box sx={{ height: 16 }} />

            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddChoice}
                sx={{ bgcolor: 'white' }}
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
                <CustomButton
                    customProps={leftButton}
                    buttonProps={{ size: 'large' }}
                    onChange={(event) => handleChangeButton(event, 'left')}
                    defaultText="左選項"
                />
                <CustomButton
                    customProps={rightButton}
                    buttonProps={{ size: 'large' }}
                    onChange={(event) => handleChangeButton(event, 'right')}
                    defaultText="右選項"
                />
            </Stack>
        </>
    )
}
