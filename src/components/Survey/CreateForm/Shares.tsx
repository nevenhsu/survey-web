import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export function TabItem(props: { label: string; text: string }) {
    const { label, text } = props
    return (
        <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h5" color="inherit" marginBottom={1}>
                {label}
            </Typography>
            <Typography variant="body1" color="inherit">
                {text}
            </Typography>
        </Box>
    )
}
