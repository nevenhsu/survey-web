import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Badge from '@mui/material/Badge'
import ChoiceView from 'components/Answer/ChoiceView'
import QuizButton, { QuizButtonProps } from 'components/Answer/QuizButton'
import type { OnChangeInput, SelectionType } from 'common/types'

type SortViewProps = {
    title: string
    selectionProps: SelectionType
    quizButtonProps: QuizButtonProps
    onChange: OnChangeInput
}

export default function SortView(props: SortViewProps) {
    const { title, selectionProps, quizButtonProps, onChange } = props
    const { values = [], choices = [], maxChoices, showImage } = selectionProps

    const toggleSelected = (id: string) => {
        if (id) {
        }
    }

    return (
        <>
            <Typography variant="h6"> {title} </Typography>
            <Typography variant="caption" color="GrayText">
                最多可排序{maxChoices}項
            </Typography>

            <Box sx={{ height: 16 }} />

            <Box sx={{ width: 4 / 5, textAlign: 'center' }}>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                >
                    {choices.map((el) => (
                        <Grid key={el.id} item xs={12}>
                            <Badge
                                badgeContent={4}
                                color="primary"
                                invisible={false}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <ChoiceView
                                    choice={el}
                                    showImage={showImage}
                                    onClick={(event) => {
                                        toggleSelected(event.currentTarget.id)
                                    }}
                                    variant={
                                        _.includes(values, el.id)
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                />
                            </Badge>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box sx={{ height: 16 }} />

            <QuizButton {...quizButtonProps} />
        </>
    )
}
