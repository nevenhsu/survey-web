import * as React from 'react'
import _ from 'lodash'
import { styled, useTheme } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import ImageBox from 'components/common/ImageBox'
import { getContrastText, emphasizeColor } from 'theme/palette'
import type { ChoiceType } from 'common/types'

type ChoiceViewProps = ButtonProps & {
    choice: ChoiceType
    showImage?: boolean
    selected?: boolean
}

type StyledButtonProps = ButtonProps & {
    choice: ChoiceType
    selected?: boolean
    component?: React.ElementType
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) => !_.includes(['choice', 'selected'], prop),
})<StyledButtonProps>(({ theme, choice, selected }) => {
    const {
        buttonColor = theme.palette.primary.main,
        bgcolor = theme.palette.common.white,
        border,
    } = choice

    const { color } = getContrastText(
        theme,
        bgcolor,
        theme.palette.text.primary
    )

    const emphasizedColor2 = emphasizeColor(theme, buttonColor, 0.08, bgcolor)

    const activeColor = getContrastText(
        theme,
        buttonColor,
        theme.palette.common.white
    ).color

    const emphasizedColor = emphasizeColor(theme, bgcolor, 0.08, bgcolor)

    const hoverTextColor = getContrastText(
        theme,
        emphasizedColor,
        theme.palette.text.primary
    ).color

    return {
        width: '100%',
        height: '100%',
        color: selected ? activeColor : color,
        backgroundColor: selected ? buttonColor : bgcolor,
        flexDirection: 'column',
        border,
        borderColor: buttonColor,
        overflow: 'hidden',
        boxShadow: 'none',
        '&:hover': {
            border,
            borderColor: buttonColor,
            backgroundColor: selected ? emphasizedColor2 : emphasizedColor,
            color: selected ? activeColor : hoverTextColor,
            boxShadow: 'none',
        },
        '& .MuiTouchRipple-root': {
            color: buttonColor || bgcolor,
        },
        '& *': {
            fontSize: 'inherit',
        },
    }
})

export default function ChoiceView(props: ChoiceViewProps) {
    const theme = useTheme()
    const { choice, showImage = false, sx, ...rest } = props

    const {
        id,
        label = '',
        image = '',
        fontSize,
        borderRadius,
        padding,
    } = choice

    return (
        <StyledButton
            id={id}
            component="div"
            variant="outlined"
            choice={choice}
            sx={{
                ...sx,
                fontSize,
                borderRadius,
                padding,
            }}
            {...rest}
        >
            {showImage && (
                <ImageBox
                    imageUrl={image}
                    sx={{
                        width: '100%',
                        mb: 2,
                    }}
                />
            )}

            <Typography
                variant="button"
                color="inherit"
                width="100%"
                sx={{
                    textTransform: 'none',
                }}
            >
                {label || '選項'}
            </Typography>
        </StyledButton>
    )
}
