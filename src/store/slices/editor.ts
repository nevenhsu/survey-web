import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store'
import type { PaletteMode } from '@mui/material'

interface EditorState {}

const initialState = {} as EditorState

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        temp: (state, action: PayloadAction<void>) => {},
    },
})

export const { temp } = editorSlice.actions
export const selector = (state: RootState) => ({})
