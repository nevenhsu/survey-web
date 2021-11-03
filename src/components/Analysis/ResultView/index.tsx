import * as React from 'react'
import _ from 'lodash'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function ResultView() {
    return (
        <>
            <Box sx={{ p: 3, borderBottom: '1px solid' }}>
                <Typography variant="h6">選擇測驗類型</Typography>
                <Typography variant="body1">
                    請選擇您的測驗需求，讓我們為您推薦測驗範本
                </Typography>
            </Box>
            <Grid container sx={{ minHeight: 'calc(100vh - 218px)' }}>
                <Grid
                    item
                    sx={{
                        width: 288,
                    }}
                ></Grid>
                <Grid item xs></Grid>
            </Grid>
        </>
    )
}
