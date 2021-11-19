import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {
    StyledTextField,
    CustomButton,
    ChoiceView,
} from 'components/Survey/QuizForm/Shares'
import AddIcon from 'mdi-react/AddIcon'
import { useAppSelector } from 'hooks'
import { selectDevice } from 'store/slices/userDefault'
import { getDefaultChoice } from 'utils/helper'
import type {
    DeviceType,
    CustomButtonType,
    SelectionType,
    OnChangeInput,
    OnButtonClink,
} from 'common/types'

export default function SelectionView(props: {
    title: string
    quizProps: Omit<SelectionType, 'values' | 'tagsId'>
    customProps: CustomButtonType
    onChange: OnChangeInput
}) {
    const { title, quizProps, customProps, onChange } = props
    const { choices = [], maxChoices, showImage, responsive, px } = quizProps

    const device = useAppSelector(selectDevice)

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

    const handleAddChoice: OnButtonClink = () => {
        const newChoice = getDefaultChoice()
        const event = {
            target: {
                name: 'choices',
                value: choices.concat(newChoice),
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
            <Typography variant="caption" color="GrayText">
                最多可選擇{maxChoices}項
            </Typography>
            <Box sx={{ height: 16 }} />
            <Box
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
                    {choices.map((el) => (
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
                                onCopy={() => handleCopyStyle(el.id)}
                                onDelete={() => handleDeleteChoice(el.id)}
                                showImage={showImage}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 3 }}>
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
                </Box>
            </Box>
            <Box sx={{ height: 16 }} />
            <CustomButton customProps={customProps} onChange={onChange} />
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
