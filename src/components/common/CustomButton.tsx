import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import { emphasizeColor } from 'theme/palette'
import type { CustomButtonType } from 'common/types'

export type CustomButtonProps = ButtonProps & {
    customProps?: CustomButtonType
    defaultText?: string
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) =>
        !_.includes(['customProps', 'defaultText'], prop),
})<CustomButtonProps>(({ customProps, theme }) => {
    const {
        fontSize,
        textColor,
        buttonColor = '',
        padding,
        border,
        borderRadius,
    } = customProps ?? {}
    return {
        fontSize,
        color: textColor,
        backgroundColor: buttonColor,
        border,
        padding,
        borderRadius,
        '&:hover': {
            border,
            color: textColor,
            backgroundColor: emphasizeColor(theme, buttonColor, 0.08, ''),
        },
    }
})

export default function CustomButton(props: CustomButtonProps) {
    const { customProps, defaultText = '下一題', ...rest } = props

    const { text, variant = 'contained', size = 'large' } = customProps ?? {}

    return (
        <StyledButton
            customProps={customProps}
            variant={variant}
            size={size}
            {...rest}
        >
            {text || defaultText}
        </StyledButton>
    )
}
