import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {
    StyledTextField,
    StyledCustomButton,
    ChoiceView,
} from 'components/Survey/QuizForm/Shares'
import AddIcon from 'mdi-react/AddIcon'
import { useAppSelector } from 'hooks'
import { selectDevice } from 'store/slices/userDefault'
import {
    getDefaultChoice,
    getDeviceValue,
    toNumOrStr,
    setClasses,
} from 'utils/helper'
import type { SelectionQuiz, OnChangeInput, OnButtonClink } from 'common/types'

const classes = setClasses('SelectionView', ['button'])
const classesSelector = {
    normal: `& .${classes.button}`,
    hover: `&:hover .${classes.button}`,
}

export default function SelectionView(props: {
    quizProps: Omit<SelectionQuiz, 'values' | 'tagsId'>
    onChange: OnChangeInput
}) {
    const { quizProps, onChange } = props
    const {
        title,
        button,
        choices = [],
        maxChoices,
        showImage,
        responsive,
        px,
    } = quizProps

    const device = useAppSelector(selectDevice)

    const handleChange = (name: string, value: any) => {
        onChange({ target: { name, value } } as any)
    }

    const handleChangeChoice = (
        event: React.ChangeEvent<HTMLInputElement>,
        id: string
    ) => {
        const { name, value } = event.target

        const newValue = choices.map((el) =>
            el.id === id ? { ...el, [name]: toNumOrStr(value) } : el
        )

        handleChange('choices', newValue)
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

    const handleAddChoice: OnButtonClink = () => {
        const newChoice = getDefaultChoice()
        const value = choices.concat(newChoice)

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
            <Typography variant="caption" color="GrayText">
                最多可選擇{maxChoices}項
            </Typography>
            <Box sx={{ height: 16 }} />
            <Box
                sx={{
                    width: '100%',
                    textAlign: 'center',
                    px: getDeviceValue(device, px),
                    [classesSelector.normal]: {
                        opacity: '0',
                    },
                    [classesSelector.hover]: {
                        opacity: '1',
                    },
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
            <Box sx={{ height: 16 }} />
            <StyledCustomButton
                customProps={button}
                onCustomize={(value) => handleChange('button', value)}
            />
        </>
    )
}
