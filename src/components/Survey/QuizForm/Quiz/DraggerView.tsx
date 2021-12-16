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
import { getDefaultDraggerChoice, setClasses } from 'utils/helper'
import { useAppDispatch, useAppSelector } from 'hooks'
import { updateChoice, selectCurrentId } from 'store/slices/survey'
import type {
    OnChangeInput,
    OnButtonClink,
    DraggerQuiz,
    DraggerChoiceType,
} from 'common/types'

const classes = setClasses('DraggerView', ['button'])
const classesSelector = {
    normal: `& .${classes.button}`,
    hover: `&:hover .${classes.button}`,
}

export default function DraggerView(props: {
    quizProps: Omit<DraggerQuiz, 'values'>
    onChange: OnChangeInput
}) {
    const dispatch = useAppDispatch()
    const { quizProps, onChange } = props
    const {
        id: quizId,
        title,
        choices = [],
        showImage,
        left,
        right,
    } = quizProps

    const slick = React.useRef<Slick>(null)
    const surveyId = useAppSelector(selectCurrentId)

    const handleChange = (name: string, value: any) => {
        onChange({ target: { name, value } } as any)
    }

    const handleAddChoice: OnButtonClink = () => {
        const value = [...choices, getDefaultDraggerChoice(left.id)]
        handleChange('choices', value)

        if (slick.current) {
            slick.current.slickGoTo(value.length - 1)
        }
    }

    const handleChangeChoice = (value: DraggerChoiceType, id: string) => {
        const newValue = { ...value, id }

        dispatch(
            updateChoice({
                surveyId,
                quizId,
                newValue,
            })
        )
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
                    position: 'relative',
                    width: '100%',
                    '&:hover .slick-arrow': {
                        display: 'block !important',
                    },
                    '&:hover .slick-dots': {
                        display: 'block !important',
                    },
                    [classesSelector.normal]: {
                        opacity: '0',
                    },
                    [classesSelector.hover]: {
                        opacity: '1',
                    },
                }}
            >
                <Box
                    sx={{
                        width: 4 / 5,
                        mx: 'auto',
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
                        '& .slick-dots': {
                            display: 'none !important',
                            bottom: 0,
                        },
                        '& .slick-arrow': {
                            display: 'none !important',
                        },
                    }}
                >
                    <Slick
                        ref={slick}
                        slidesToShow={1}
                        slidesToScroll={1}
                        dots
                        arrows
                        infinite
                    >
                        {choices.map((el) => (
                            <Box key={el.id} sx={{ p: 1 }}>
                                <DraggerChoiceView
                                    choice={el}
                                    showImage={showImage}
                                    onChange={(choice) =>
                                        handleChangeChoice(choice, el.id)
                                    }
                                />
                                <Box sx={{ height: 16 }} />
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-evenly"
                                >
                                    <Button
                                        className={classes.button}
                                        color="primary"
                                        onClick={() => handleCopyStyle(el.id)}
                                    >
                                        套用所有
                                    </Button>

                                    <Button
                                        className={classes.button}
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

                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center',
                        bottom: -48,
                    }}
                >
                    <Button
                        className={classes.button}
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddChoice}
                        sx={{
                            mx: 'auto',
                            bgcolor: 'white',
                            '&:hover': {
                                bgcolor: 'white',
                            },
                        }}
                    >
                        新增選項
                    </Button>
                </Box>
            </Box>

            <Box sx={{ height: 24 }} />

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
                    showImage
                    circle
                />
                <StyledCustomButton
                    customProps={right}
                    onCustomize={(value) => handleChange('right', value)}
                    defaultText="右選項"
                    showImage
                    circle
                />
            </Stack>
        </>
    )
}
