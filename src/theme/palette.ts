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

type Color = {
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

export const getDesignTokens = (mode: PaletteMode): PaletteOptions => {
    // const prefersLightMode = mode === 'light'

    return {
        mode,
    }
}

export function getMuiColor(key?: string) {
    const colors: {
        [key: string]: Color
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

    if (key && colors[key]) {
        return {
            key,
            color: colors[key],
        }
    }

    const keys = _.keys(colors)
    const index = _.random(0, keys.length - 1)
    const k = keys[index]

    return {
        key: k,
        color: colors[k],
    }
}

export function getThemeColor(
    theme: Theme,
    colorKey?: string
): string | undefined {
    const sx = { color: colorKey }
    const style = styleFunctionSx({ sx, theme }) as any
    const { color } = style ?? {}
    return color
}

export function getContrastText(
    theme: Theme,
    colorKey: string,
    fallback: string
) {
    try {
        const sx = { color: colorKey }
        const style = styleFunctionSx({ sx, theme }) as any

        const { color } = style ?? {}
        const textColor = theme.palette.getContrastText(color)

        return { color, textColor }
    } catch (err) {
        console.error(err)
        return { color: colorKey, textColor: fallback }
    }
}

export function lightenColor(
    theme: Theme,
    colorKey: string,
    coefficient: number,
    fallback: string
) {
    if (!colorKey) {
        return fallback
    }
    try {
        const sx = { color: colorKey }
        const style = styleFunctionSx({ sx, theme }) as any
        const { color } = style ?? {}
        const lightColor = lighten(color, coefficient)
        return lightColor
    } catch (err) {
        console.error(err)
        return fallback
    }
}
