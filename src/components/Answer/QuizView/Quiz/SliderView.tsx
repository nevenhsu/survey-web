import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import CustomButton, { CustomButtonProps } from 'components/common/CustomButton'
import CustomTypography from 'components/common/CustomTypography'
import type { OnChangeInput, SliderQuiz } from 'common/types'

type SliderViewProps = {
    quizProps: SliderQuiz
    buttonProps: CustomButtonProps
    onChange: OnChangeInput
}

export default function SliderView(props: SliderViewProps) {
    const { quizProps, buttonProps, onChange } = props
    const { title, button, min, max, value } = quizProps

    return (
        <>
            <CustomTypography {...title} />

            <Box sx={{ height: 32 }} />

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

            <CustomButton {...buttonProps} customProps={button} />
        </>
    )
}
