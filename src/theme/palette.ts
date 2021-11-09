import _ from 'lodash'
import {
    amber,
    blue,
    blueGrey,
    brown,
    cyan,
    deepOrange,
    deepPurple,
    green,
    grey,
    indigo,
    lightBlue,
    lightGreen,
    lime,
    orange,
    pink,
    purple,
    red,
    teal,
    yellow,
} from '@mui/material/colors'
import styleFunctionSx from '@mui/system/styleFunctionSx'
import { lighten } from '@mui/material/styles'
import type { PaletteMode, PaletteOptions } from '@mui/material'
import type { Theme } from '@mui/material/styles/createTheme'

export type Color = {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    A100: string
    A200: string
    A400: string
    A700: string
}

export const colors = [
    lightBlue,
    lightGreen,
    orange,
    red,
    blue,
    green,
    amber,
    pink,
    cyan,
    lime,
    deepOrange,
    purple,
    indigo,
    teal,
    yellow,
    deepPurple,
    blueGrey,
    brown,
    grey,
]

const lightPalette = {
    primary: {
        light: '#A5A6F6',
        main: '#7879F1',
        dark: '#5D5FEF',
    },
    secondary: {
        light: '#E2FF91',
        main: '#ABED1D',
        dark: '#87D900',
    },
    error: {
        light: '#FCDDEC',
        main: '#F178B6',
        dark: '#EF5DA8',
    },
}

export const getDesignTokens = (mode: PaletteMode): PaletteOptions => {
    // const prefersLightMode = mode === 'light'

    const palette = mode === 'light' ? lightPalette : lightPalette

    return {
        mode,
        ...palette,
    }
}

export function getMuiColor(name?: string) {
    const colors: {
        [name: string]: Color
    } = {
        amber,
        blue,
        blueGrey,
        brown,
        cyan,
        deepOrange,
        deepPurple,
        green,
        grey,
        indigo,
        lightBlue,
        lightGreen,
        lime,
        orange,
        pink,
        purple,
        red,
        teal,
        yellow,
    }

    if (name && colors[name]) {
        return {
            name,
            color: colors[name],
        }
    }

    const keys = _.keys(colors)
    const index = _.random(0, keys.length - 1)
    const k = keys[index]

    return {
        name: k,
        color: colors[k],
    }
}

export function getThemeColor(
    theme: Theme,
    colorName?: string
): string | undefined {
    const sx = { color: colorName }
    const style = styleFunctionSx({ sx, theme }) as any
    const { color } = style ?? {}
    return color
}

export function getContrastText(
    theme: Theme,
    colorName: string,
    fallback: string
) {
    try {
        const sx = { color: colorName }
        const style = styleFunctionSx({ sx, theme }) as any

        const { color } = style ?? {}
        const textColor = theme.palette.getContrastText(color)

        return { color, textColor }
    } catch (err) {
        console.error(err)
        return { color: colorName, textColor: fallback }
    }
}

export function lightenColor(
    theme: Theme,
    colorName: string,
    coefficient: number,
    fallback: string
) {
    if (!colorName) {
        return fallback
    }
    try {
        const sx = { color: colorName }
        const style = styleFunctionSx({ sx, theme }) as any
        const { color } = style ?? {}
        const lightColor = lighten(color, coefficient)
        return lightColor
    } catch (err) {
        console.error(err)
        return fallback
    }
}
