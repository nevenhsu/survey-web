import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CustomButton, { CustomButtonProps } from 'components/common/CustomButton'
import { Quiz } from 'common/types'

type PageViewProps = {
    quizProps: Quiz
    buttonProps: CustomButtonProps
}

export default function PageView(props: PageViewProps) {
    const { quizProps, buttonProps } = props
    const { title, button } = quizProps ?? {}
    return (
        <>
            <Typography variant="h6">{title.text}</Typography>

            <Box sx={{ height: 16 }} />

            <CustomButton {...buttonProps} customProps={button} />
        </>
    )
}
