import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import QuizButton from 'components/Answer/QuizButton'
import type { CustomButton, OnChangeInput, SliderType } from 'common/types'

type SliderViewProps = {
    title: string
    slider: SliderType
    buttonProps: CustomButton
    onChange: OnChangeInput
    onNext: React.MouseEventHandler<HTMLButtonElement>
}

export default function SliderView(props: SliderViewProps) {
    const { title, slider, buttonProps, onChange, onNext } = props
    const { min, max, value } = slider

    return (
        <>
            <Typography variant="h6"> {title} </Typography>

            <Box sx={{ width: 4 / 5 }}>
                <Slider
                    min={min}
                    max={max}
                    value={value ?? min}
                    valueLabelDisplay="auto"
                    onChange={(event: Event, val: number | number[]) => {
                        const value = val as number
                        onChange({ target: { name: 'value', value } } as any)
                    }}
                />
            </Box>

            <Box sx={{ height: 16 }} />

            <QuizButton buttonProps={buttonProps} onClick={onNext} />
        </>
    )
}
