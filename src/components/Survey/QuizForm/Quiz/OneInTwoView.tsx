import * as React from 'react'
import _ from 'lodash'
import Slick from 'react-slick'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { StyledTextField, ChoiceView } from 'components/Survey/QuizForm/Shares'
import { getDefaultChoice } from 'utils/helper'
import type { OneInTwoType, OnChangeInput, OnButtonClink } from 'common/types'

export default function OneInTwoView(props: {
    title: string
    quizProps: Omit<OneInTwoType, 'values' | 'tagsId'>
    onChange: OnChangeInput
}) {
    const { title, quizProps, onChange } = props
    const { choices = [], showImage, direction } = quizProps

    const handleAddChoice: OnButtonClink = () => {
        const newValue = [getDefaultChoice(), getDefaultChoice()]

        const event = {
            target: {
                name: 'choices',
                value: [...choices, ...newValue],
            },
        }

        onChange(event as any)
    }

    const handleChangeChoice = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: string
    ) => {
        const value = choices.map((el) =>
            el.id === id ? { ...el, [e.target.name]: e.target.value } : el
        )
        const event = {
            target: {
                name: 'choices',
                value,
            },
        }

        onChange(event as any)
    }

    const handleDeleteChoice = (id: string) => {
        const value = choices.filter((el) => el.id !== id)
        const event = {
            target: {
                name: 'choices',
                value,
            },
        }

        onChange(event as any)
    }

    return (
        <>
            <StyledTextField
                variant="standard"
                placeholder="請輸入您的文字"
                name="title"
                value={title}
                onChange={onChange}
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
                }}
            >
                <Slick slidesToShow={1} slidesToScroll={1} dots arrows infinite>
                    {_.chunk(choices, 2).map((chunk) => (
                        <Box
                            key={chunk.map((el) => el.id).join('-')}
                            sx={{ px: 0.5 }}
                        >
                            <Stack
                                direction={direction || 'row'}
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                            >
                                {chunk.map((el) => (
                                    <ChoiceView
                                        key={el.id}
                                        value={el}
                                        onChange={(event) =>
                                            handleChangeChoice(event, el.id)
                                        }
                                        onDelete={() =>
                                            handleDeleteChoice(el.id)
                                        }
                                        showImage={showImage}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    ))}
                </Slick>
            </Box>
            <Box sx={{ height: 16 }} />
            <Button variant="outlined" onClick={handleAddChoice}>
                新增選項
            </Button>
        </>
    )
}
