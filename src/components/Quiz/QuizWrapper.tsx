import * as React from 'react'
import Grid from '@mui/material/Grid'
import type { QuizType } from 'types/customTypes'

type QuizWrapperProps = {
    quiz?: QuizType
    editing?: boolean
}

export default function QuizWrapper(props: QuizWrapperProps) {
    const { quiz, editing = false } = props

    const renderQuiz = () => {
        if (!quiz) {
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
