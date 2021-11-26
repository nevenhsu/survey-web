import { styled } from '@mui/material/styles'
import Chip, { ChipProps } from '@mui/material/Chip'
import { getMuiColor, getContrastText, emphasizeColor } from 'theme/palette'

type StyledChipProps = ChipProps & {
    colorName: string
}

const StyledChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== 'colorName',
})<StyledChipProps>(({ theme, colorName, variant }) => {
    const { color } = getMuiColor(colorName)
    const backgroundColor = color[300]

    return {
        color: getContrastText(theme, backgroundColor, '#ffffff').color,
        backgroundColor,
        borderColor: variant === 'outlined' ? color[500] : '',
        '&.MuiChip-clickable:hover': {
            backgroundColor: color[500],
        },
    }
})

export default StyledChip
