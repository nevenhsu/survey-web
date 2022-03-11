import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store'
import type { PaletteMode } from '@mui/material'
import type { DeviceType } from 'common/types'

interface UserDefaultState {
    mode: PaletteMode
    device: DeviceType
    joyride: boolean
}

const initialState = {
    mode: 'light',
    device: 'mobile',
    joyride: true,
} as UserDefaultState

export const userDefaultSlice = createSlice({
    name: 'userDefault',
    initialState,
    reducers: {
        toggleMode: (state, action: PayloadAction<void>) => {
            const { mode } = state
            state.mode = mode === 'dark' ? 'light' : 'dark'
        },
        setDevice: (state, action: PayloadAction<DeviceType>) => {
            state.device = action.payload
        },
        setJoyride: (state, action: PayloadAction<boolean>) => {
            state.joyride = action.payload
        },
    },
})

export const { toggleMode, setDevice, setJoyride } = userDefaultSlice.actions
export const selectMode = (state: RootState) => state.userDefault.mode
export const selectDevice = (state: RootState) => state.userDefault.device
export const selectJoyride = (state: RootState) => state.userDefault.joyride
