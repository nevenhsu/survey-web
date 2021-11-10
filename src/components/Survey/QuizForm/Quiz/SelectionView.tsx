import * as React from 'react'
import Box from '@mui/material/Box'
import Grid, { GridSize } from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {
    StyledTextField,
    QuizButton,
    ChoiceView,
} from 'components/Survey/QuizForm/Shares'
import { getDefaultChoice } from 'utils/helper'
import type { StyledTextFieldProps } from 'components/Survey/QuizForm/Shares'
import type {
    CustomButton,
    SelectionType,
    OnChangeInput,
    OnButtonClink,
} from 'common/types'

export default function SelectionView(props: {
    textFieldProps: StyledTextFieldProps
    selectionProps: SelectionType
    buttonProps: CustomButton
    onChange: OnChangeInput
}) {
    const { textFieldProps, selectionProps, buttonProps, onChange } = props
    const { choices = [], maxChoices, showImage, direction } = selectionProps

    const responsive: { [key: string]: GridSize } =
        direction === 'row' ? { xs: 6 } : { xs: 12 }

    const handleChoiceChange = (
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

    const handleChoiceDelete = (id: string) => {
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
                onChange={onChange}
                multiline
                {...textFieldProps}
            />
            <Typography variant="caption" color="GrayText">
                最多可選擇{maxChoices}項
            </Typography>
            <Box sx={{ height: 16 }} />
            <Box sx={{ width: 4 / 5, textAlign: 'center' }}>
                <Grid
                    container
                    direction={direction}
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                >
                    {choices.map((el) => (
                        <Grid key={el.id} item {...responsive}>
                            <ChoiceView
                                value={el}
                                onChange={(event) =>
                                    handleChoiceChange(event, el.id)
                                }
                                onDelete={() => handleChoiceDelete(el.id)}
                                showImage={showImage}
                            />
                        </Grid>
                    ))}
                    <Grid item {...responsive}>
                        <Button variant="outlined" onClick={handleAddChoice}>
                            新增選項
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ height: 16 }} />
            <QuizButton buttonProps={buttonProps} onChange={onChange} />
        </>
    )
}
