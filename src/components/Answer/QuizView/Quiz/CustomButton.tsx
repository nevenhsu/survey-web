import * as React from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import { emphasizeColor } from 'theme/palette'
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
        buttonSize = 'large',
    } = customProps

    return (
        <Button
            variant={buttonVariant}
            size={buttonSize}
            sx={{
                color: buttonTextColor,
                backgroundColor: buttonColor,
                '&:hover': {
                    backgroundColor: (theme) =>
                        emphasizeColor(theme, buttonColor, 0.08, ''),
                },
            }}
            {...rest}
        >
            {buttonText || defaultText}
        </Button>
    )
}
