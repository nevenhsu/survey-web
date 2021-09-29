import * as React from 'react'
import _ from 'lodash'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

export default function QuizForm() {
    return (
        <>
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 3, borderBottom: '1px solid' }}
            >
                <Grid item>
                    <Typography variant="h6">編輯個人化測驗結果</Typography>
                    <Typography variant="body1">（說明文字）</Typography>
                </Grid>
                <Grid item>
                    <Button variant="outlined">預覽測驗</Button>
                    <Box
                        component="span"
                        sx={{ display: 'inline-block', width: 8 }}
                    />
                    <Button variant="contained">編輯測驗結果</Button>
                </Grid>
            </Grid>
        </>
    )
}
