import * as React from 'react'
import Box from '@mui/material/Box'
import { StyledTextField, QuizButton } from 'components/Survey/QuizForm/Shares'
import type { CustomButton, OnChangeInput } from 'common/types'

export default function PageView(props: {
    title: string
    buttonProps: CustomButton
    onChange: OnChangeInput
}) {
    const { title, buttonProps, onChange } = props

    return (
        <>
            <StyledTextField
                variant="standard"
                placeholder="請輸入您的文字"
                name="title"
                value={title}
                onChange={onChange}
            />

            <Box sx={{ height: 16 }} />

            <QuizButton buttonProps={buttonProps} onChange={onChange} />
        </>
    )
}
