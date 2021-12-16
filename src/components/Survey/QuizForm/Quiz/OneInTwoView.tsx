import * as React from 'react'
import _ from 'lodash'
import Slick from 'react-slick'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { StyledTextField, ChoiceView } from 'components/Survey/QuizForm/Shares'
import AddIcon from 'mdi-react/AddIcon'
import { useAppSelector } from 'hooks'
import { selectDevice } from 'store/slices/userDefault'
import { getDefaultChoice, getDeviceValue, setClasses } from 'utils/helper'
import type { OneInTwoQuiz, OnChangeInput, OnButtonClink } from 'common/types'

const classes = setClasses('OneInTwoView', ['button'])
const classesSelector = {
    normal: `& .${classes.button}`,
    hover: `&:hover .${classes.button}`,
}

export default function OneInTwoView(props: {
    quizProps: Omit<OneInTwoQuiz, 'values' | 'tagsId'>
    onChange: OnChangeInput
}) {
    const { quizProps, onChange } = props
    const { title, choices = [], showImage, responsive, px } = quizProps

    const device = useAppSelector(selectDevice)
    const slick = React.useRef<Slick>(null)

    const handleChange = (name: string, value: any) => {
        onChange({ target: { name, value } } as any)
    }

    const handleAddChoice: OnButtonClink = () => {
        const newValue = [getDefaultChoice(), getDefaultChoice()]
        const value = [...choices, ...newValue]
        handleChange('choices', value)

        if (slick.current) {
            slick.current.slickGoTo(_.ceil(value.length / 2) - 1)
        }
    }

    const handleChangeChoice = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: string
    ) => {
        const value = choices.map((el) =>
            el.id === id ? { ...el, [e.target.name]: e.target.value } : el
        )
        handleChange('choices', value)
    }

    const handleCopyStyle = (id: string) => {
        const choice = _.find(choices, { id })
        if (choice) {
            const {
                buttonColor,
                bgcolor,
                fontSize,
                padding,
                border,
                borderRadius,
            } = choice
            const value = _.map(choices, (el) => ({
                ...el,
                buttonColor,
                bgcolor,
                fontSize,
                padding,
                border,
                borderRadius,
            }))

            handleChange('choices', value)
        }
    }

    const handleDeleteChoice = (id: string) => {
        const value = choices.filter((el) => el.id !== id)
        handleChange('choices', value)
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
                        mb: 6,
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
                        '& .slick-arrow': {
                            display: 'none !important',
                        },
                        '& .slick-dots': {
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
                        {_.chunk(choices, 2).map((chunk) => (
                            <Box
                                key={chunk.map((el) => el.id).join('-')}
                                sx={{
                                    width: '100%',
                                    textAlign: 'center',
                                    px: getDeviceValue(device, px),
                                }}
                            >
                                <Grid
                                    container
                                    direction="row"
                                    // alignItems="center"
                                    justifyContent="center"
                                    spacing={2}
                                >
                                    {chunk.map((el) => (
                                        <Grid
                                            key={el.id}
                                            item
                                            xs={getDeviceValue(
                                                device,
                                                responsive
                                            )}
                                        >
                                            <ChoiceView
                                                value={el}
                                                onChange={(event) =>
                                                    handleChangeChoice(
                                                        event,
                                                        el.id
                                                    )
                                                }
                                                onCopy={() =>
                                                    handleCopyStyle(el.id)
                                                }
                                                onDelete={() =>
                                                    handleDeleteChoice(el.id)
                                                }
                                                showImage={showImage}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ))}
                    </Slick>
                </Box>

                <Box
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    <Button
                        className={classes.button}
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
                </Box>
            </Box>
        </>
    )
}
