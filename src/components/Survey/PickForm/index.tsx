import * as React from 'react'
import _ from 'lodash'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import { createNew, setMode, setStep } from 'store/slices/survey'
import { useAppDispatch, useAppSelector } from 'hooks'
import { Mode, SurveyStep } from 'common/types'
import AddIcon from 'mdi-react/AddIcon'

export default function PickForm() {
    const dispatch = useAppDispatch()

    const mode = useAppSelector((state) => state.survey.mode ?? '')

    const [loading, setLoading] = React.useState(false)

    const handleChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setMode(event.target.value as Mode))
    }

    const handleClick = () => {
        setLoading(true)
    }

    React.useEffect(() => {
        if (loading && mode) {
            dispatch(createNew(mode))
                .unwrap()
                .then((result) => {
                    // handle result here
                    setLoading(false)
                    dispatch(setStep(SurveyStep.quiz))
                })
                .catch((error) => {
                    console.error(error)
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }, [loading])

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 3, borderBottom: '1px solid' }}
            >
                <Box>
                    <Typography variant="h6">選擇測驗類型</Typography>
                    <Typography variant="body1">
                        請選擇您的測驗需求，讓我們為您推薦測驗範本
                    </Typography>
                </Box>
                <Box>
                    <LoadingButton
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<AddIcon />}
                        variant="outlined"
                        onClick={handleClick}
                        disabled={!mode}
                    >
                        建立測驗
                    </LoadingButton>
                </Box>
            </Stack>

            <Grid
                container
                sx={{ p: 3, pt: 0, mt: 0, backgroundColor: 'grey.100' }}
                rowSpacing={3}
            >
                <Grid item xs={12} container alignItems="center">
                    <Grid item xs={4}>
                        <Box component="span">01</Box> 測驗目的
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
            </Grid>
        </>
    )
}
