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
import { getDefaultChoice } from 'utils/helper'
import type {
    DeviceType,
    OneInTwoType,
    OnChangeInput,
    OnButtonClink,
} from 'common/types'

export default function OneInTwoView(props: {
    title: string
    quizProps: Omit<OneInTwoType, 'values' | 'tagsId'>
    onChange: OnChangeInput
}) {
    const { title, quizProps, onChange } = props
    const { choices = [], showImage, responsive, px } = quizProps

    const device = useAppSelector(selectDevice)

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

    const handleCopyStyle = (id: string) => {
        const choice = _.find(choices, { id })
        if (choice) {
            const { buttonColor, backgroundColor } = choice
            const value = _.map(choices, (el) => ({
                ...el,
                buttonColor,
                backgroundColor,
            }))

            const event = {
                target: {
                    name: 'choices',
                    value,
                },
            }

            onChange(event as any)
        }
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
                                alignItems="center"
                                justifyContent="center"
                                spacing={2}
                            >
                                {chunk.map((el) => (
                                    <Grid
                                        key={el.id}
                                        item
                                        xs={getDeviceValue(device, responsive)}
                                    >
                                        <ChoiceView
                                            value={el}
                                            onChange={(event) =>
                                                handleChangeChoice(event, el.id)
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
        </>
    )
}

function getDeviceValue(
    device: DeviceType,
    value: { xs: any; sm: any; lg: any }
) {
    switch (device) {
        case 'mobile':
            return value.xs
        case 'laptop':
            return value.sm
        case 'desktop':
            return value.lg
    }
}
