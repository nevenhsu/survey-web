import type { ThemeOptions } from '@mui/material/styles'
import type { PaletteOptions } from '@mui/material'
import { greyPalette } from './palette'

export function getComponents(
    palette: PaletteOptions
): ThemeOptions['components'] {
    return {
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: greyPalette[700],
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: '60px !important',
                },
            },
        },
    }
}
