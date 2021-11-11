import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CustomButton, {
    CustomButtonProps,
} from 'components/Answer/QuizView/Quiz/CustomButton'
import type { OnChangeInput } from 'common/types'

type FillViewProps = {
    title: string
    value: string
    customButtonProps: CustomButtonProps
    onChange: OnChangeInput
}

export default function FillView(props: FillViewProps) {
    const { title, value, customButtonProps, onChange } = props
    return (
        <>
            <Typography variant="h6"> {title} </Typography>

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

            <CustomButton {...customButtonProps} />
        </>
    )
}
