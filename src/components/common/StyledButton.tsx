import { styled } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import { getContrastText } from 'theme/palette'
import { lighten } from '@mui/system/colorManipulator'

type StyledButtonProps = ButtonProps & {
    colorName?: string
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'colorName',
})<StyledButtonProps>(({ theme, colorName, variant }) => {
    if (colorName) {
        const { color, textColor } = getContrastText(theme, colorName, '#fff')
        const lightColor = tryLighten(color, 0.08)

        return {
            color: textColor,
            backgroundColor: variant === 'outlined' ? undefined : color,
            borderColor: variant === 'outlined' ? color : undefined,
            '&:hover': {
                backgroundColor:
                    variant === 'outlined' ? undefined : lightColor,
                borderColor: variant === 'outlined' ? lightColor : undefined,
            },
        }
    }
})

export default StyledButton

function tryLighten(color: string, coefficient: number) {
    try {
        return lighten(color, coefficient)
    } catch {
        return color
    }
}
