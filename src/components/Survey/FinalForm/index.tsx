import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import Box, { BoxProps } from '@mui/material/Box'
import { Contexts } from 'components/common/Component'
import EditingFinal from 'components/Survey/FinalForm/EditingFinal'
import FinalTool from 'components/Survey/FinalForm/FinalTool'
import InfoForm from 'components/Final/InfoForm'
import DeviceMode from 'components/common/DeviceMode'
import { useAppSelector, useAppDispatch } from 'hooks'
import usePreview from 'hooks/usePreview'
import { selectDevice } from 'store/slices/userDefault'
import {
    selectCurrentSurvey,
    updateFinal,
    updateFinalData,
    setStep,
} from 'store/slices/survey'
import ThemeProvider from 'theme/ThemeProvider'
import { FinalMode, SurveyStep } from 'common/types'
import type { DeviceType, OnChangeInput } from 'common/types'

type StyledBoxProps = BoxProps & {
    device: DeviceType
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTab-root': {
        color: theme.palette.common.white,
    },
    '& .Mui-selected': {
        backgroundColor: theme.palette.grey[700],
    },
    '& .MuiTabs-indicator': {
        display: 'none',
    },
    '& .Mui-disabled': {
        color: theme.palette.grey[700],
    },
}))

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'device',
})<StyledBoxProps>(({ theme, device }) => {
    const style = getDeviceStyle(device)

    return {
        ...style,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        '& > div': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflowY: 'auto',
        },
    }
})

const modeOptions = [{ value: FinalMode.info, label: '搜集基本資料' }]

export default function FinalForm() {
    const dispatch = useAppDispatch()

    const instance = Contexts.getInstance('final')
    const { Provider, Context } = instance.getValue()

    const survey = useAppSelector(selectCurrentSurvey)
    const { id: surveyId, final } = survey
    const { mode, data } = final ?? {}

    const { uploading, handlePreview } = usePreview(survey)

    const device = useAppSelector(selectDevice)

    const nextStep = () => {
        dispatch(setStep(SurveyStep.launch))
    }

    const updateMode = (mode: FinalMode) => {
        if (surveyId) {
            const newValue = { mode }
            dispatch(updateFinal({ surveyId, newValue }))
        }
    }

    const handleDataChange: OnChangeInput = (event) => {
        if (surveyId) {
            const { name, value } = event.target
            const newValue = {
                [name]: value,
            }
            dispatch(updateFinalData({ surveyId, newValue }))
        }
    }

    const renderMode = (mode: FinalMode) => {
        switch (mode) {
            case FinalMode.info: {
                return (
                    <InfoForm data={data ?? {}} onChange={handleDataChange} />
                )
            }
        }
    }

    return (
        <Provider context={Context}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 3, borderBottom: '1px solid' }}
            >
                <Box>
                    <Typography variant="h6">編輯測驗結果</Typography>
                    <Typography variant="body1">（說明文字）</Typography>
                </Box>
                <Box>
                    <LoadingButton
                        variant="outlined"
                        loading={uploading}
                        disabled={uploading}
                        onClick={handlePreview}
                    >
                        預覽測驗
                    </LoadingButton>
                    <Box
                        component="span"
                        sx={{ display: 'inline-block', width: 8 }}
                    />
                    <Button variant="contained" onClick={nextStep}>
                        發布測驗
                    </Button>
                </Box>
            </Stack>
            <Grid container sx={{ minHeight: 'calc(100vh - 218px)' }}>
                <Grid
                    item
                    sx={{
                        width: 288,
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'common.white',
                            p: 2,
                        }}
                    >
                        {modeOptions.map((el) => (
                            <Box
                                key={el.value}
                                sx={{
                                    p: 1,
                                    mb: 1,
                                    bgcolor: (theme) =>
                                        mode === el.value
                                            ? theme.palette.grey[100]
                                            : theme.palette.common.white,
                                }}
                                onClick={() => updateMode(el.value)}
                            >
                                <Typography>{el.label}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Grid>
                <ThemeProvider mode="dark">
                    <Grid item xs>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                bgcolor: (theme) => theme.palette.grey[700],
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: (theme) => theme.palette.grey[800],
                                }}
                            >
                                <StyledTabs value={0}>
                                    <Tab label="編輯內容" />
                                </StyledTabs>
                            </Box>

                            <ThemeProvider mode="light">
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        my: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: getDeviceWidth(device),
                                            mx: 'auto',
                                        }}
                                    >
                                        <StyledBox device={device}>
                                            <div>
                                                <EditingFinal />
                                                {renderMode(mode)}
                                            </div>
                                        </StyledBox>
                                    </Box>
                                </Box>
                            </ThemeProvider>
                            <DeviceMode sx={{ mb: 2 }} />
                        </Box>
                    </Grid>
                    <Grid
                        item
                        sx={{
                            width: 288,
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                bgcolor: (theme) => theme.palette.grey[800],
                            }}
                        >
                            <FinalTool surveyId={surveyId} />
                        </Box>
                    </Grid>
                </ThemeProvider>
            </Grid>
        </Provider>
    )
}

function getDeviceStyle(device: DeviceType) {
    switch (device) {
        case 'mobile': {
            return {
                width: '100%',
                paddingTop: '177%',
                height: 0,
            }
        }
        case 'laptop': {
            return {
                width: '100%',
                paddingTop: '75%',
                height: 0,
            }
        }
        case 'desktop': {
            return {
                width: '100%',
                paddingTop: '56.25%',
                height: 0,
            }
        }
    }
}

function getDeviceWidth(device: DeviceType) {
    switch (device) {
        case 'mobile': {
            return 375
        }
        case 'laptop': {
            return 'calc(100vw - 656px)'
        }
        case 'desktop': {
            return 'calc(100vw - 656px)'
        }
    }
}
