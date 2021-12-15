import * as React from 'react'
import Typography, { TypographyProps } from '@mui/material/Typography'
import type { TextType } from 'common/types'

export default function CustomTypography(props: TextType & TypographyProps) {
    const {
        text,
        color,
        bgcolor,
        variant,
        fontWeight,
        padding,
        ...typographyProps
    } = props
    const { sx, ...rest } = typographyProps
    return (
        <Typography
            variant={variant}
            sx={{
                color,
                bgcolor,
                fontWeight,
                padding,
                ...sx,
            }}
            {...rest}
        >
            {text}
        </Typography>
    )
}
