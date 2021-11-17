import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import CustomButton, {
    CustomButtonProps,
} from 'components/Answer/QuizView/Quiz/CustomButton'
import type { OnChangeInput, SliderType } from 'common/types'

type SliderViewProps = {
    title: string
    quizProps: SliderType
    buttonProps: CustomButtonProps
    onChange: OnChangeInput
}

export default function SliderView(props: SliderViewProps) {
    const { title, quizProps, buttonProps, onChange } = props
    const { min, max, value } = quizProps

    return (
        <>
            <Typography variant="h6" sx={{ mb: 4 }}>
                {title}
            </Typography>

            <Box sx={{ width: 4 / 5 }}>
                <Slider
                    min={min}
                    max={max}
                    value={value ?? 0}
                    valueLabelDisplay="on"
                    onChange={(event: Event, val: number | number[]) => {
                        const value = val as number
                        onChange({ target: { name: 'value', value } } as any)
                    }}
                />
            </Box>

            <Box sx={{ height: 16 }} />

            <CustomButton {...buttonProps} />
        </>
    )
}
