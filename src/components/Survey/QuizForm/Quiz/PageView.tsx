import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import {
    StyledTextField,
    StyledCustomButton,
} from 'components/Survey/QuizForm/Shares'
import type { OnChangeInput, Quiz } from 'common/types'

export default function PageView(props: {
    quizProps: Quiz
    onChange: OnChangeInput
}) {
    const { quizProps, onChange } = props
    const { title, button } = quizProps

    const handleChange = (name: string, value: any) => {
        onChange({ target: { name, value } } as any)
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

            <Box sx={{ height: 16 }} />

            <StyledCustomButton
                customProps={button}
                onCustomize={(value) => handleChange('button', value)}
            />
        </>
    )
}
