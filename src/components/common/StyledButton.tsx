import { styled } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import { getContrastText, emphasizeColor } from 'theme/palette'

type StyledButtonProps = ButtonProps & {
    colorName?: string
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'colorName',
})<StyledButtonProps>(({ theme, colorName, variant }) => {
    if (colorName) {
        const { bgcolor, color } = getContrastText(theme, colorName, '#ffffff')
        const hoverColor = emphasizeColor(theme, bgcolor, 0.08, bgcolor)

        return {
            color,
            backgroundColor: variant === 'outlined' ? undefined : bgcolor,
            borderColor: variant === 'outlined' ? bgcolor : undefined,
            '&:hover': {
                backgroundColor:
                    variant === 'outlined' ? undefined : hoverColor,
                borderColor: variant === 'outlined' ? hoverColor : undefined,
            },
        }
    }
})

export default StyledButton
