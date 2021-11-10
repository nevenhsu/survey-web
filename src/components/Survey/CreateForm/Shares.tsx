import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export function TabItem(props: { label: string; text: string }) {
    const { label, text } = props
    return (
        <Box sx={{ textAlign: 'left' }}>
            <Typography color="inherit">{label}</Typography>
            <Typography variant="caption" color="inherit">
                {text}
            </Typography>
        </Box>
    )
}
