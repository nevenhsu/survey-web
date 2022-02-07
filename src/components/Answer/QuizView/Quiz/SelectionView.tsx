import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import ChoiceView from 'components/Answer/QuizView/Quiz/ChoiceView'
import CustomButton, { CustomButtonProps } from 'components/common/CustomButton'
import CustomTypography from 'components/common/CustomTypography'
import type { OnChangeInput, SelectionQuiz } from 'common/types'

type SelectionViewProps = {
    quizProps: SelectionQuiz
    buttonProps: CustomButtonProps
    onChange: OnChangeInput
}

export default function SelectionView(props: SelectionViewProps) {
    const { quizProps, buttonProps, onChange } = props
    const {
        title,
        button,
        values = [],
        choices = [],
        maxChoices,
        showImage,
        responsive,
        px,
    } = quizProps

    const toggleSelected = (id: string) => {
        if (id) {
            const selected = _.includes(values, id)
            if (selected) {
                onChange({
                    target: {
                        name: 'values',
                        value: values.filter((el) => el !== id),
                    },
                } as any)
            } else {
                if (values.length < maxChoices) {
                    onChange({
                        target: {
                            name: 'values',
                            value: [...values, id],
                        },
                    } as any)
                } else {
                    const [removed, ...rest] = values

                    onChange({
                        target: {
                            name: 'values',
                            value: [...rest, id],
                        },
                    } as any)
                }
            }
        }
    }

    return (
        <>
            <CustomTypography {...title} />
            <Typography variant="caption" color="GrayText">
                最多可選擇{maxChoices}項
            </Typography>
            <Box sx={{ height: 16 }} />
            <Box sx={{ width: '100%', textAlign: 'center', px }}>
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                >
                    {choices.map((el) => (
                        <Grid key={el.id} item {...responsive}>
                            <ChoiceView
                                choice={el}
                                showImage={showImage}
                                onClick={(event) => {
                                    toggleSelected(el.id)
                                }}
                                selected={_.includes(values, el.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box sx={{ height: 16 }} />
            <CustomButton {...buttonProps} customProps={button} />
        </>
    )
}
