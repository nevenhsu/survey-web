import * as React from 'react'
import _ from 'lodash'
import NumberFormat from 'react-number-format'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Slider from '@mui/material/Slider'
import {
    StyledTextField,
    StyledCustomButton,
} from 'components/Survey/QuizForm/Shares'
import type { OnChangeInput, SliderQuiz } from 'common/types'

export default function SliderView(props: {
    quizProps: Omit<SliderQuiz, 'value'>
    onChange: OnChangeInput
}) {
    const { quizProps, onChange } = props
    const { max, min, button, title } = quizProps

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

            <Box sx={{ height: 32 }} />

            <Box sx={{ width: 4 / 5 }}>
                <Slider
                    defaultValue={_.floor(max ?? 0 / 2) ?? 0}
                    min={min}
                    max={max}
                    valueLabelDisplay="on"
                    sx={{ mb: 2 }}
                />

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <NumberFormat
                        customInput={TextField}
                        variant="outlined"
                        size="small"
                        label="最小值"
                        value={min}
                        onValueChange={({ value }) => {
                            const event = {
                                target: {
                                    value: Number(value),
                                    name: 'min',
                                },
                            }

                            onChange(event as any)
                        }}
                        sx={{ width: 96 }}
                    />

                    <NumberFormat
                        customInput={TextField}
                        variant="outlined"
                        size="small"
                        label="最大值"
                        value={max}
                        onValueChange={({ value }) => {
                            const event = {
                                target: {
                                    value: Number(value),
                                    name: 'max',
                                },
                            }

                            onChange(event as any)
                        }}
                        sx={{ width: 96 }}
                    />
                </Stack>
            </Box>

            <Box sx={{ height: 16 }} />
            <StyledCustomButton
                customProps={button}
                onCustomize={(value) => handleChange('button', value)}
            />
        </>
    )
}
