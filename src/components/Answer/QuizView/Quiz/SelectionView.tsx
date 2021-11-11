import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid, { GridSize } from '@mui/material/Grid'
import ChoiceView from 'components/Answer/QuizView/Quiz/ChoiceView'
import CustomButton, {
    CustomButtonProps,
} from 'components/Answer/QuizView/Quiz/CustomButton'
import type { OnChangeInput, SelectionType } from 'common/types'

type SelectionViewProps = {
    title: string
    selectionProps: SelectionType
    customButtonProps: CustomButtonProps
    onChange: OnChangeInput
}

export default function SelectionView(props: SelectionViewProps) {
    const { title, selectionProps, customButtonProps, onChange } = props
    const {
        values = [],
        choices = [],
        maxChoices,
        showImage,
        direction,
    } = selectionProps

    const responsive: { [key: string]: GridSize } =
        direction === 'row' ? { xs: 6 } : { xs: 12 }

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
                }
            }
        }
    }

    return (
        <>
            <Typography variant="h6"> {title} </Typography>
            <Typography variant="caption" color="GrayText">
                最多可選擇{maxChoices}項
            </Typography>
            <Box sx={{ height: 16 }} />
            <Box sx={{ width: 4 / 5, textAlign: 'center' }}>
                <Grid
                    container
                    direction={direction}
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
                                variant={
                                    _.includes(values, el.id)
                                        ? 'contained'
                                        : 'outlined'
                                }
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box sx={{ height: 16 }} />
            <CustomButton {...customButtonProps} />
        </>
    )
}
