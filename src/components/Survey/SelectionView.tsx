import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import QuizButton from 'components/Survey/QuizButton'
import { useAppSelector, useAppDispatch } from 'hooks'
import type { CustomButton, OnChangeInput, SelectionType } from 'common/types'

type SelectionViewProps = {
    title: string
    selectionProps: SelectionType
    buttonProps: CustomButton
    onChange: OnChangeInput
}

export default function SelectionView(props: SelectionViewProps) {
    const { title, selectionProps, buttonProps } = props
    console.log({ selectionProps })
    return (
        <>
            <Typography variant="h6"> {title} </Typography>

            <Box sx={{ height: 16 }} />

            <QuizButton buttonProps={buttonProps} />
        </>
    )
}
