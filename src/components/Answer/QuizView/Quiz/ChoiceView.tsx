import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import ImageBox from 'components/common/ImageBox'
import { lightenColor, getThemeColor, getContrastText } from 'theme/palette'
import type { ChoiceType } from 'common/types'

type ChoiceViewProps = ButtonProps & {
    choice: ChoiceType
    showImage?: boolean
}

type StyledButtonProps = ButtonProps & {
    showImage: boolean
    buttonTextColor: string
    buttonColor: string
    component?: React.ElementType
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) =>
        !_.includes(['showImage', 'buttonTextColor', 'buttonColor'], prop),
})<StyledButtonProps>(
    ({ theme, variant, buttonTextColor, buttonColor, showImage }) => {
        const textColor =
            getThemeColor(theme, buttonTextColor) || theme.palette.primary.main
        const btnColor =
            getThemeColor(theme, buttonColor) || theme.palette.primary.main
        const lightColor = lightenColor(theme, btnColor, 0.92, '')
        const lightColor2 = lightenColor(theme, btnColor, 0.08, '')

        const contrastText = getContrastText(theme, btnColor, 'white').textColor

        const selected = variant === 'contained'

        return {
            width: '100%',
            color: selected ? contrastText : textColor,
            backgroundColor: selected ? btnColor : undefined,
            border: `1px solid ${btnColor}`,
            flexDirection: 'column',
            padding: showImage ? '0 0 5px' : '5px 15px',
            overflow: 'hidden',
            '&:hover': {
                border: `1px solid ${btnColor}`,
                backgroundColor: selected ? lightColor2 : lightColor,
            },
            '& .MuiTouchRipple-root': {
                color: btnColor,
            },
        }
    }
)

export default function ChoiceView(props: ChoiceViewProps) {
    const { choice, showImage = false, ...rest } = props

    const {
        id,
        label = '',
        image = '',
        buttonColor = '',
        buttonTextColor = '',
    } = choice

    return (
        <StyledButton
            id={id}
            component="div"
            variant="outlined"
            showImage={showImage}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
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
                {label}
            </Typography>
        </StyledButton>
    )
}
