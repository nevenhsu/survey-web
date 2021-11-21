import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import {
    StyledTextField,
    StyledCustomButton,
} from 'components/Survey/QuizForm/Shares'
import type { OnChangeInput, FillQuiz } from 'common/types'

export default function FillView(props: {
    quizProps: FillQuiz
    onChange: OnChangeInput
}) {
    const { quizProps, onChange } = props
    const { title, value, button } = quizProps

    const handleChange = (name: string, value: any) => {
        onChange({ target: { name, value } } as any)
    }

    return (
        <>
            <StyledTextField
                variant="standard"
                placeholder="請輸入測驗問題"
                textProps={title}
                onCustomize={(value) => handleChange('title', value)}
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
            <StyledCustomButton
                customProps={button}
                onCustomize={(value) => handleChange('button', value)}
            />
        </>
    )
}
