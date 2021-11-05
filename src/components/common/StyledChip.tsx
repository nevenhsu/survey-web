import { styled } from '@mui/material/styles'
import Chip, { ChipProps } from '@mui/material/Chip'
import { getMuiColor, getContrastText } from 'theme/palette'

type StyledChipProps = ChipProps & {
    colorName: string
}

const StyledChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== 'colorName',
})<StyledChipProps>(({ theme, colorName, variant }) => {
    const { color } = getMuiColor(colorName)
    const backgroundColor = variant === 'outlined' ? color[200] : color[300]
    const { textColor } = getContrastText(theme, backgroundColor, '#fff')

    return {
        color: textColor,
        backgroundColor,
        borderColor: variant === 'outlined' ? color[500] : '',
        '&.MuiChip-clickable:hover': {
            backgroundColor: color[500],
        },
    }
})

export default StyledChip
