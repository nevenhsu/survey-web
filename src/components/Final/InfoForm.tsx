import * as React from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

export default function InfoForm() {
    return (
        <Stack
            direction="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            spacing={2}
            sx={{ p: 2 }}
        >
            <TextField label="姓名" variant="outlined" fullWidth />
        </Stack>
    )
}
