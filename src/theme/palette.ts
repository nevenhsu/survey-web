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
import { lighten, emphasize } from '@mui/material/styles'
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

const greyPalette = {
    700: '#444444',
    800: '#333333',
}

export const lightPalette = {
    primary: {
        light: '#C1E5FF',
        main: '#3892FC',
        dark: '#0062BD',
    },
    secondary: {
        light: '#D8CEF4',
        main: '#9E71E8',
        dark: '#4F0D83',
    },
    error: {
        light: '#FCDDDD',
        main: '#F17878',
        dark: '#D85050',
    },
    grey: greyPalette,
}

export const darkPalette = {
    primary: {
        light: '#C1E9FF',
        main: '#5DB1FF',
        dark: '#0D81D6',
    },
    secondary: {
        light: '#E4CFFF',
        main: '#BC79FF',
        dark: '#6A14C0',
    },
    error: {
        light: '#FFD4D4',
        main: '#FF9292',
        dark: '#FF7A7A',
    },
    grey: greyPalette,
}

export const getDesignTokens = (mode: PaletteMode): PaletteOptions => {
    // const prefersLightMode = mode === 'light'

    const palette = mode === 'light' ? lightPalette : darkPalette

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
    color?: string
): string | undefined {
    const sx = { color }
    const style = styleFunctionSx({ sx, theme }) as any
    const { color: val } = style ?? {}
    return val
}

export function getContrastText(
    theme: Theme,
    bgcolor: string,
    fallback: string
) {
    try {
        const sx = { bgcolor }
        const style = styleFunctionSx({ sx, theme }) as any

        const { backgroundColor } = style ?? {}
        const color = theme.palette.getContrastText(backgroundColor)

        return { bgcolor, color }
    } catch (err) {
        console.error(err)
        return { bgcolor, color: fallback }
    }
}

export function lightenColor(
    theme: Theme,
    color: string,
    coefficient: number,
    fallback: string
) {
    if (!color) {
        return fallback
    }
    try {
        const sx = { color }
        const style = styleFunctionSx({ sx, theme }) as any
        const { color: val } = style ?? {}
        const lightColor = lighten(val, coefficient)
        return lightColor
    } catch (err) {
        console.error(err)
        return fallback
    }
}

export function emphasizeColor(
    theme: Theme,
    color: string,
    coefficient: number,
    fallback: string
) {
    if (!color) {
        return fallback
    }
    try {
        const sx = { color }
        const style = styleFunctionSx({ sx, theme }) as any
        const { color: val } = style ?? {}
        const emphasizeColor = emphasize(val, coefficient)
        return emphasizeColor
    } catch (err) {
        console.error(err)
        return fallback
    }
}
