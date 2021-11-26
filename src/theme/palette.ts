import _ from 'lodash'
import styleFunctionSx from '@mui/system/styleFunctionSx'
import { lighten, emphasize } from '@mui/material/styles'
import type { PaletteMode, PaletteOptions } from '@mui/material'
import type { Theme } from '@mui/material/styles/createTheme'

export type Color = {
    100: string
    300: string
    500: string
}

const purple: Color = {
    100: '#F9D6FF',
    300: '#BA68C8',
    500: '#9C27B0',
}
const indigo: Color = {
    100: '#D7DDFF',
    300: '#7986CB',
    500: '#3F51B5',
}
const teal: Color = {
    100: '#CAF6F2',
    300: '#4DB6AC',
    500: '#009688',
}
const lightGreen: Color = {
    100: '#E7FECC',
    300: '#AED581',
    500: '#8BC34A',
}
const orange: Color = {
    100: '#FFE5BF',
    300: '#FFB74D',
    500: '#FF9800',
}
const yellow: Color = {
    100: '#FFF9C7',
    300: '#FFF176',
    500: '#FFEB3B',
}
const red: Color = {
    100: '#FFCBCB',
    300: '#E57373',
    500: '#F44336',
}
const grey: Color = {
    100: '#E0E0E0',
    300: '#BDBDBD',
    500: '#9E9E9E',
}

export const chartColors = ['#7986CB', '#FFB74D', '#4DB6AC']

// for tags
export const colors = [
    lightGreen,
    orange,
    red,
    purple,
    indigo,
    teal,
    yellow,
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
        lightGreen,
        orange,
        red,
        purple,
        indigo,
        teal,
        yellow,
        grey,
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
        return fallback
    }
}
