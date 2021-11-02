import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import QuizButton, {
    QuizButtonProps,
} from 'components/Answer/QuizView/Quiz/QuizButton'

type PageViewProps = {
    title: string
    quizButtonProps: QuizButtonProps
}

export default function PageView(props: PageViewProps) {
    const { title, quizButtonProps } = props
    return (
        <>
            <Typography variant="h6"> {title} </Typography>

            <Box sx={{ height: 16 }} />

            <QuizButton {...quizButtonProps} />
        </>
    )
}
