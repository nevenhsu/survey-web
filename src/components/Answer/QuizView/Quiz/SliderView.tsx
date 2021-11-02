import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import QuizButton, {
    QuizButtonProps,
} from 'components/Answer/QuizView/Quiz/QuizButton'
import type { OnChangeInput, SliderType } from 'common/types'

type SliderViewProps = {
    title: string
    slider: SliderType
    quizButtonProps: QuizButtonProps
    onChange: OnChangeInput
}

export default function SliderView(props: SliderViewProps) {
    const { title, slider, quizButtonProps, onChange } = props
    const { min, max, value } = slider

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

            <QuizButton {...quizButtonProps} />
        </>
    )
}
