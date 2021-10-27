import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import QuizButton from 'components/Survey/QuizButton'
import { useAppSelector, useAppDispatch } from 'hooks'
import type { CustomButton, OnChangeInput } from 'common/types'

type PageViewProps = {
    title: string
    buttonProps: CustomButton
}

export default function PageView(props: PageViewProps) {
    const { title, buttonProps } = props
    return (
        <>
            <Typography variant="h6"> {title} </Typography>

            <Box sx={{ height: 16 }} />

            <QuizButton buttonProps={buttonProps} />
        </>
    )
}
