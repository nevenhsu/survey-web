import * as React from 'react'
import Box from '@mui/material/Box'
import { StyledTextField, QuizButton } from 'components/Survey/QuizForm/Shares'
import type { StyledTextFieldProps } from 'components/Survey/QuizForm/Shares'
import type { CustomButton, OnChangeInput } from 'common/types'

export default function PageView(props: {
    textFieldProps: StyledTextFieldProps
    buttonProps: CustomButton
    onChange: OnChangeInput
}) {
    const { textFieldProps, buttonProps, onChange } = props

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

            <QuizButton buttonProps={buttonProps} onChange={onChange} />
        </>
    )
}
