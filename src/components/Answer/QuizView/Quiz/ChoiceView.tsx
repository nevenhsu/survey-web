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
    showImage: boolean
    buttonColor: string
    backgroundColor: string
    selected?: boolean
    component?: React.ElementType
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) =>
        !_.includes(
            ['showImage', 'buttonColor', 'backgroundColor', 'selected'],
            prop
        ),
})<StyledButtonProps>(
    ({ theme, buttonColor, backgroundColor, showImage, selected }) => {
        const { color } = getContrastText(
            theme,
            backgroundColor,
            theme.palette.text.primary
        )

        const emphasizedColor2 = emphasizeColor(
            theme,
            buttonColor,
            0.08,
            backgroundColor
        )

        const activeColor = getContrastText(
            theme,
            buttonColor,
            theme.palette.common.white
        ).color

        const emphasizedColor = emphasizeColor(
            theme,
            backgroundColor,
            0.08,
            backgroundColor
        )

        const hoverTextColor = getContrastText(
            theme,
            emphasizedColor,
            theme.palette.text.primary
        ).color

        return {
            width: '100%',
            color: selected ? activeColor : color,
            borderColor: buttonColor,
            backgroundColor: selected ? buttonColor : backgroundColor,
            flexDirection: 'column',
            padding: showImage ? '0 0 5px' : '5px 15px',
            overflow: 'hidden',
            '&:hover': {
                color: selected ? activeColor : hoverTextColor,
                borderColor: buttonColor,
                backgroundColor: selected ? emphasizedColor2 : emphasizedColor,
            },
            '& .MuiTouchRipple-root': {
                color: buttonColor || backgroundColor,
            },
        }
    }
)

export default function ChoiceView(props: ChoiceViewProps) {
    const theme = useTheme()
    const { choice, showImage = false, ...rest } = props

    const {
        id,
        label = '',
        image = '',
        buttonColor = theme.palette.primary.main,
        backgroundColor = theme.palette.common.white,
    } = choice

    return (
        <StyledButton
            id={id}
            component="div"
            variant="outlined"
            showImage={showImage}
            buttonColor={buttonColor}
            backgroundColor={backgroundColor}
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
