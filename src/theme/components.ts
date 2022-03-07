import type { ThemeOptions } from '@mui/material/styles'
import type { PaletteOptions } from '@mui/material'
import { greyPalette } from './palette'

export function getComponents(
    palette: PaletteOptions
): ThemeOptions['components'] {
    return {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 32px',
                    fontSize: 16,
                    '& .MuiButton-startIcon': {
                        marginLeft: -12,
                    },
                    '& .MuiButton-endIcon': {
                        marginRight: -12,
                    },
                    '& .mdi-icon': {
                        width: 20,
                        height: 20,
                    },
                },
                sizeLarge: {
                    minHeight: 38,
                },
                contained: {
                    boxShadow: `inset 0 0 0 1px ${greyPalette[800]}`,
                    '&:hover': {
                        boxShadow: `inset 0 0 0 2px ${greyPalette[800]}`,
                        backgroundColor: greyPalette[50],
                        color: greyPalette[800],
                    },
                    '&:active': {
                        backgroundColor: greyPalette[800],
                        color: greyPalette[100],
                    },
                    '&.Mui-disabled': {
                        border: 'none',
                        boxShadow: `inset 0 0 0 1px ${greyPalette[500]}`,
                        backgroundColor: greyPalette[100],
                        color: greyPalette[500],
                    },
                },
                outlined: {
                    border: 'none',
                    boxShadow: `inset 0 0 0 1px ${greyPalette[800]}`,
                    backgroundColor: greyPalette[50],
                    color: greyPalette[800],
                    '&:hover': {
                        border: 'none',
                        boxShadow: `inset 0 0 0 2px ${greyPalette[800]}`,
                        backgroundColor: greyPalette[50],
                    },
                    '&:active': {
                        backgroundColor: greyPalette[800],
                        color: greyPalette[100],
                    },
                },
            },
            defaultProps: {
                disableRipple: true, // No more ripple!
                disableElevation: true,
            },
        },
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
        MuiTab: {
            defaultProps: {
                disableRipple: true, // No more ripple!
            },
        },
    }
}
