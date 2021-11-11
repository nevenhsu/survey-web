import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CustomButton, {
    CustomButtonProps,
} from 'components/Answer/QuizView/Quiz/CustomButton'

type PageViewProps = {
    title: string
    customButtonProps: CustomButtonProps
}

export default function PageView(props: PageViewProps) {
    const { title, customButtonProps } = props
    return (
        <>
            <Typography variant="h6"> {title} </Typography>

            <Box sx={{ height: 16 }} />

            <CustomButton {...customButtonProps} />
        </>
    )
}
