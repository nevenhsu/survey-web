import { useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { PaletteMode } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useAppSelector } from 'hooks'
import { selectMode } from 'store/slices/userDefault'
import { getDesignTokens } from './palette'
import { getComponents } from './components'
import typography from './typography'

type ProviderProps = {
    withBaseline?: boolean
    mode?: PaletteMode
}

function Provider(props: React.PropsWithChildren<ProviderProps>) {
    const { mode: customMode, withBaseline, children } = props

    const mode = useAppSelector(selectMode)
    const m = customMode ?? mode

    const theme = useMemo(() => {
        const palette = getDesignTokens(m)
        const components = getComponents(palette)

        return createTheme({
            palette,
            components,
            typography,
        })
    }, [m])

    return (
        <ThemeProvider theme={theme}>
            {withBaseline && <CssBaseline />}
            {children}
        </ThemeProvider>
    )
}

export default Provider
