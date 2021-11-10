import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { StyledTextField, QuizButton } from 'components/Survey/QuizForm/Shares'
import type { CustomButton, OnChangeInput } from 'common/types'

export default function FillView(props: {
    title: string
    value: string
    buttonProps: CustomButton
    onChange: OnChangeInput
}) {
    const { title, value, buttonProps, onChange } = props

    return (
        <>
            <StyledTextField
                variant="standard"
                placeholder="請輸入測驗問題"
                name="title"
                value={title}
                onChange={onChange}
                multiline
            />

            <Box sx={{ height: 16 }} />

            <TextField
                label="自由填空"
                variant="outlined"
                name="value"
                value={value}
                onChange={onChange}
                sx={{ width: 4 / 5 }}
                maxRows={6}
                multiline
            />
            <Box sx={{ height: 16 }} />
            <QuizButton buttonProps={buttonProps} onChange={onChange} />
        </>
    )
}
