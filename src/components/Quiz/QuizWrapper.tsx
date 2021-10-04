import * as React from 'react'
import Grid from '@mui/material/Grid'
import { QuizMode } from 'types/customTypes'

type QuizWrapperProps = {
    mode?: QuizMode
    editing?: boolean
}

export default function QuizWrapper(props: QuizWrapperProps) {
    const { mode, editing = false } = props

    const renderQuiz = () => {
        if (!mode) {
            return <div />
        }

        if (editing) {
            return renderEditingView()
        }
        return renderView()
    }

    const renderEditingView = () => {
        return <div />
    }

    const renderView = () => {
        return <div />
    }

    return (
        <>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ width: '100%', height: '100%' }}
            >
                {renderQuiz()}
            </Grid>
        </>
    )
}
