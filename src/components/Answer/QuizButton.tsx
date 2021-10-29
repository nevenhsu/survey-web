import * as React from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import type { CustomButton } from 'common/types'

type QuizButtonProps = ButtonProps & {
    buttonProps: CustomButton
}

export default function QuizButton(props: QuizButtonProps) {
    const { buttonProps, ...rest } = props

    const {
        buttonVariant = 'contained',
        buttonText = '下一題',
        buttonColor = '',
        buttonTextColor = '',
    } = buttonProps

    return (
        <Button
            variant={buttonVariant}
            sx={{
                color: buttonTextColor,
                backgroundColor: buttonColor,
            }}
            {...rest}
        >
            {buttonText || '下一題'}
        </Button>
    )
}
