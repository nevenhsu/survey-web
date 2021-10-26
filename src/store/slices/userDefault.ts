import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store'
import type { PaletteMode } from '@mui/material'
import type { DeviceType } from 'common/types'

interface UserDefaultState {
    mode: PaletteMode
    device: DeviceType
}

const initialState = {
    mode: 'light',
    device: 'mobile',
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
    },
})

export const { toggleMode, setDevice } = userDefaultSlice.actions
export const selectMode = (state: RootState) => state.userDefault.mode
export const selectDevice = (state: RootState) => state.userDefault.device
