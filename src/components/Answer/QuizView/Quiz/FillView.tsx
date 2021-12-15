import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import CustomTypography from 'components/common/CustomTypography'
import CustomButton, { CustomButtonProps } from 'components/common/CustomButton'
import type { OnChangeInput, FillQuiz } from 'common/types'

type FillViewProps = {
    quizProps: FillQuiz
    buttonProps: CustomButtonProps
    onChange: OnChangeInput
}

export default function FillView(props: FillViewProps) {
    const { quizProps, buttonProps, onChange } = props
    const { title, value, button } = quizProps ?? {}
    return (
        <>
            <CustomTypography {...title} />

            <Box sx={{ height: 16 }} />

            <TextField
                label="自由填空"
                variant="outlined"
                name="value"
                value={value ?? ''}
                onChange={onChange}
                sx={{ width: 4 / 5 }}
                maxRows={6}
                multiline
            />

            <Box sx={{ height: 16 }} />

            <CustomButton {...buttonProps} customProps={button} />
        </>
    )
}
