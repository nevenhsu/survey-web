import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import { emphasizeColor } from 'theme/palette'
import type { CustomButtonType } from 'common/types'

export type CustomButtonProps = ButtonProps & {
    customProps?: CustomButtonType
    defaultText?: string
    circle?: boolean
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) =>
        !_.includes(['customProps', 'defaultText', 'circle'], prop),
})<CustomButtonProps>(({ customProps, theme, circle }) => {
    const {
        size,
        fontSize,
        textColor,
        buttonColor = '',
        padding,
        border,
        borderRadius,
        image,
    } = customProps ?? {}

    const color = image ? 'transparent' : textColor
    const width = getWidth(size)
    const circleStyle = circle
        ? {
              width,
              height: width,
              minWidth: width,
              padding: 0,
              borderRadius: '50%',
          }
        : {}

    return {
        fontSize,
        border,
        padding,
        borderRadius,
        color,
        background: image ? `center/cover no-repeat url(${image})` : '',
        backgroundColor: buttonColor,
        ...circleStyle,
        '&:hover': {
            border,
            color,
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

function getWidth(size?: 'small' | 'medium' | 'large') {
    switch (size) {
        case 'large':
            return 120
        case 'small':
            return 48
        case 'medium':
        default:
            return 80
    }
}
