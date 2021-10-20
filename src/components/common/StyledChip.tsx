import { styled } from '@mui/material/styles'
import Chip, { ChipProps } from '@mui/material/Chip'
import { getMuiColor } from 'theme/palette'

type StyledChipProps = ChipProps & {
    colorKey: string
}

const StyledChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== 'colorKey',
})<StyledChipProps>(({ theme, colorKey, variant }) => {
    const { color } = getMuiColor(colorKey)
    return {
        backgroundColor: variant === 'outlined' ? color[200] : color[300],
        borderColor: variant === 'outlined' ? color[500] : '',
        '&.MuiChip-clickable:hover': {
            backgroundColor: color[500],
        },
    }
})

export default StyledChip
