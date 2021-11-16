import * as React from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import type { CustomButtonType } from 'common/types'

export type CustomButtonProps = ButtonProps & {
    customProps: CustomButtonType
    defaultText?: string
}

export default function CustomButton(props: CustomButtonProps) {
    const { customProps, defaultText = '下一題', ...rest } = props

    const {
        buttonText,
        buttonVariant = 'contained',
        buttonColor = '',
        buttonTextColor = '',
    } = customProps

    return (
        <Button
            variant={buttonVariant}
            sx={{
                color: buttonTextColor,
                backgroundColor: buttonColor,
            }}
            {...rest}
        >
            {buttonText || defaultText}
        </Button>
    )
}
