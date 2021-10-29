import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import ImageBox from 'components/common/ImageBox'
import { lightenColor } from 'theme/palette'
import type { ChoiceType } from 'common/types'

type ChoiceViewProps = ButtonProps & {
    choice: ChoiceType
    showImage?: boolean
}

type StyledButtonProps = ButtonProps & {
    showImage: boolean
    buttonTextColor: string
    buttonColor: string
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) =>
        !_.includes(['showImage', 'buttonTextColor', 'buttonColor'], prop),
})<StyledButtonProps>(
    ({ theme, variant, buttonTextColor, buttonColor, showImage }) => {
        const btnColor = buttonColor || theme.palette.primary.main
        const lightColor = lightenColor(theme, btnColor, 0.92, '')

        return {
            width: '100%',
            color: buttonTextColor,
            border: `1px solid ${btnColor}`,
            flexDirection: 'column',
            padding: showImage ? '0 0 5px' : '5px 15px',
            overflow: 'hidden',
            '&:hover': {
                border: `1px solid ${btnColor}`,
                backgroundColor: variant === 'outlined' ? lightColor : btnColor,
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

            {label}
        </StyledButton>
    )
}
