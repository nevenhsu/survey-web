import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid, { GridSize } from '@mui/material/Grid'
import ChoiceView from 'components/Survey/ChoiceView'
import QuizButton from 'components/Survey/QuizButton'
import type { CustomButton, OnChangeInput, SelectionType } from 'common/types'

type SortViewProps = {
    title: string
    selectionProps: SelectionType
    buttonProps: CustomButton
    onChange: OnChangeInput
    onNext: React.MouseEventHandler<HTMLButtonElement>
}

export default function SortView(props: SortViewProps) {
    const { title, selectionProps, buttonProps, onChange, onNext } = props
    const { choices = [], maxChoices, showImage, direction } = selectionProps

    const responsive: { [key: string]: GridSize } =
        direction === 'row' ? { xs: 6 } : { xs: 12 }

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
                                    console.log(event.currentTarget.id)
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box sx={{ height: 16 }} />

            <QuizButton buttonProps={buttonProps} onClick={onNext} />
        </>
    )
}
