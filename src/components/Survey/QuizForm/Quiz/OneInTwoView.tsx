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
    OneInTwoType,
    OnChangeInput,
    OnButtonClink,
} from 'common/types'

export default function OneInTwoView(props: {
    textFieldProps: StyledTextFieldProps
    quizProps: OneInTwoType
    buttonProps: CustomButton
    onChange: OnChangeInput
}) {
    const { textFieldProps, quizProps, buttonProps, onChange } = props
    const { choiceGroup = [], showImage, direction } = quizProps

    const responsive: { [key: string]: GridSize } =
        direction === 'row' ? { xs: 6 } : { xs: 12 }

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

            <Box sx={{ height: 16 }} />
            <Box sx={{ width: 4 / 5, textAlign: 'center' }}></Box>
            <Box sx={{ height: 16 }} />
            <QuizButton buttonProps={buttonProps} onChange={onChange} />
        </>
    )
}
