import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import QuizButton from 'components/Survey/QuizButton'
import type { CustomButton } from 'common/types'

type PageViewProps = {
    title: string
    buttonProps: CustomButton
    onNext: React.MouseEventHandler<HTMLButtonElement>
}

export default function PageView(props: PageViewProps) {
    const { title, buttonProps, onNext } = props
    return (
        <>
            <Typography variant="h6"> {title} </Typography>

            <Box sx={{ height: 16 }} />

            <QuizButton buttonProps={buttonProps} onClick={onNext} />
        </>
    )
}
