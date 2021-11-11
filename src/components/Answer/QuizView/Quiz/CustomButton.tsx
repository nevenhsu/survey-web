import * as React from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import type { CustomButtonType } from 'common/types'

export type CustomButtonProps = ButtonProps & {
    customProps: CustomButtonType
}

export default function CustomButton(props: CustomButtonProps) {
    const { customProps, ...rest } = props

    const {
        buttonVariant = 'contained',
        buttonText = '下一題',
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
            {buttonText || '下一題'}
        </Button>
    )
}
