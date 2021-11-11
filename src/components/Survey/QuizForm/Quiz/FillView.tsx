import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import {
    StyledTextField,
    CustomButton,
} from 'components/Survey/QuizForm/Shares'
import type { CustomButtonType, OnChangeInput } from 'common/types'

export default function FillView(props: {
    title: string
    value: string
    customProps: CustomButtonType
    onChange: OnChangeInput
}) {
    const { title, value, customProps, onChange } = props

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
            <CustomButton customProps={customProps} onChange={onChange} />
        </>
    )
}
