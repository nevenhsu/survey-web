import * as React from 'react'
import Box from '@mui/material/Box'
import {
    StyledTextField,
    CustomButton,
} from 'components/Survey/QuizForm/Shares'
import type { CustomButtonType, OnChangeInput } from 'common/types'

export default function PageView(props: {
    title: string
    customProps: CustomButtonType
    onChange: OnChangeInput
}) {
    const { title, customProps, onChange } = props

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

            <CustomButton customProps={customProps} onChange={onChange} />
        </>
    )
}
