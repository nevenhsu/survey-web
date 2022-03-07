import * as React from 'react'
import _ from 'lodash'
import { useDimensionsRef } from 'rooks'
import { styled, useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Contexts, AddButton } from 'components/common/Component'
import EditingFinal from 'components/Survey/FinalForm/EditingFinal'
import FinalTool from 'components/Survey/FinalForm/FinalTool'
import InfoForm from 'components/common/InfoForm'
import DeviceMode, { getRatio, getWidth } from 'components/common/DeviceMode'
import AspectRatioBox from 'components/common/AspectRatioBox'
import ScaleBox from 'components/common/ScaleBox'
import { useAppSelector, useAppDispatch } from 'hooks'
import usePreview from 'hooks/usePreview'
import { getDefaultComponent } from 'utils/helper'
import { selectDevice } from 'store/slices/userDefault'
import {
    selectCurrentSurvey,
    updateFinalComponents,
    updateFinal,
    updateFinalData,
    setStep,
} from 'store/slices/survey'
import ThemeProvider from 'theme/ThemeProvider'
import { FinalMode, SurveyStep } from 'common/types'
import type { OnChangeInput, ComponentType } from 'common/types'

const StyledTabs = styled(Tabs)(({ theme }) => ({
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: 1,
        bottom: 0,
        left: 0,
        backgroundColor: theme.palette.grey[500],
    },
    '& .MuiTab-root': {
        color: theme.palette.grey[500],
        borderRight: `1px solid ${theme.palette.grey[500]}`,
    },
    '& .Mui-selected': {
        color: theme.palette.grey[800],
        '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: 1,
            bottom: 0,
            left: 0,
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
            zIndex: 1,
        },
    },
    '& .MuiTabs-indicator': {
        display: 'none',
    },
    '& .Mui-disabled': {
        color: theme.palette.grey[300],
    },
}))

const modeOptions = [
    { value: FinalMode.none, label: '無結尾頁' },
    { value: FinalMode.info, label: '搜集基本資料' },
]

const infoFields = [
    { value: 'name', label: '姓名' },
    { value: 'gender', label: '性別' },
    { value: 'birthday', label: '生日' },
    { value: 'mobile', label: '手機' },
    { value: 'email', label: '信箱' },
]

export default function FinalForm() {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const [ref, dimensions] = useDimensionsRef()

    const instance = Contexts.getInstance('final')
    const { Provider, Context } = instance.getValue()

    const survey = useAppSelector(selectCurrentSurvey)
    const { id: surveyId, final } = survey
    const { mode, data, bgcolor, setting } = final ?? {}
    const { maxWidth } = survey.setting ?? {}
    const { info } = setting ?? {}

    const { uploading, handlePreview } = usePreview(survey)

    const device = useAppSelector(selectDevice)
    const deviceWidth = getWidth(device, dimensions)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const nextStep = () => {
        dispatch(setStep(SurveyStep.launch))
    }

    const updateMode = (mode: FinalMode) => {
        if (surveyId) {
            const newValue = { mode }
            dispatch(updateFinal({ surveyId, newValue }))
        }
    }

    const handleChangeData: OnChangeInput = (event) => {
        if (surveyId) {
            const { name, value } = event.target
            const newValue = {
                [name]: value,
            }
            dispatch(updateFinalData({ surveyId, newValue }))
        }
    }

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target

        if (surveyId) {
            const newValue = {
                setting: {
                    info: {
                        ...info,
                        [name]: checked,
                    },
                },
            }
            dispatch(updateFinal({ surveyId, newValue }))
        }
    }

    const handleAdd = (type: ComponentType) => {
        if (surveyId) {
            const newValue = getDefaultComponent(type)
            dispatch(updateFinalComponents({ surveyId, idPath: [], newValue }))
        }
    }

    React.useEffect(() => {
        setAnchorEl(null)
    }, [mode])

    const renderMode = (mode: FinalMode) => {
        switch (mode) {
            case FinalMode.none: {
                return (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="h4">無此頁面</Typography>
                    </Box>
                )
            }
            case FinalMode.info: {
                return (
                    <>
                        <EditingFinal />

                        <Box sx={{ my: 4 }}>
                            <Box sx={{ px: 2 }}>
                                <Button
                                    onClick={(event) =>
                                        setAnchorEl(
                                            anchorEl
                                                ? null
                                                : event.currentTarget
                                        )
                                    }
                                    sx={{ fontSize: 14, px: '4px !important' }}
                                >
                                    編輯欄位
                                </Button>
                            </Box>
                            <InfoForm
                                data={data ?? {}}
                                setting={info}
                                onChange={handleChangeData}
                            />
                        </Box>
                    </>
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
                    <Typography variant="body1">
                        在此可以編輯測驗填答者都會看見的共同結果，可用以搜集聯繫方式等相關必要資訊
                    </Typography>
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
            <Stack direction="row">
                <Box
                    sx={{
                        flex: '0 0 304px',
                        height: '100vh',
                        overflowY: 'auto',
                        '::-webkit-scrollbar': {
                            display: 'none',
                        },
                        borderRight: `1px solid ${theme.palette.grey[500]}`,
                    }}
                >
                    <Typography py={1} px={2} marginBottom={1}>
                        結尾模式
                    </Typography>

                    {modeOptions.map((el) => (
                        <Box
                            key={el.value}
                            sx={{
                                padding: '8px 16px',
                                bgcolor:
                                    mode === el.value
                                        ? 'grey.800'
                                        : 'transparent',
                                color: mode === el.value ? 'white' : 'grey.800',
                            }}
                            onClick={() => updateMode(el.value)}
                        >
                            <Typography color="inherit">{el.label}</Typography>
                        </Box>
                    ))}
                </Box>

                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100vh',
                        bgcolor: 'grey.200',
                    }}
                >
                    <Box>
                        <StyledTabs value={0}>
                            <Tab label="編輯內容" />
                        </StyledTabs>
                    </Box>

                    <Box
                        ref={ref as any}
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: 'calc(100vh - 48px)',
                            borderRight: `1px solid ${theme.palette.grey[500]}`,
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                py: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    mx: 'auto',
                                    width: getWidth(device, dimensions),
                                }}
                            >
                                <ThemeProvider mode="light">
                                    <AspectRatioBox
                                        ratio={getRatio(device)}
                                        sx={{
                                            bgcolor: 'white',
                                            '& > div': { bgcolor },
                                        }}
                                    >
                                        <ScaleBox
                                            device={device}
                                            containerWidth={deviceWidth}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    overflowY: 'auto',
                                                    overflowX: 'visible',
                                                    '::-webkit-scrollbar': {
                                                        display: 'none',
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        height: '100%',
                                                        maxWidth,
                                                        mx: 'auto',
                                                    }}
                                                >
                                                    {renderMode(mode)}
                                                </Box>
                                            </Box>
                                        </ScaleBox>
                                    </AspectRatioBox>
                                </ThemeProvider>
                            </Box>
                        </Box>

                        <Stack
                            direction="row"
                            spacing={3}
                            alignItems="center"
                            justifyContent="center"
                            sx={{ mb: 4 }}
                        >
                            <DeviceMode />

                            <AddButton
                                onAdd={(type) => {
                                    handleAdd(type)
                                }}
                            />
                        </Stack>
                    </Box>
                </Box>

                <Box
                    sx={{
                        position: 'relative',
                        flex: '0 0 312px',
                        height: '100vh',
                        overflowY: 'auto',
                        bgcolor: 'grey.200',
                        '::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            height: 48,
                            borderBottom: `1px solid ${theme.palette.grey[500]}`,
                        }}
                    />
                    <FinalTool />
                </Box>
            </Stack>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        px: 3,
                    }}
                >
                    {_.map(infoFields, (el) => (
                        <FormGroup key={el.value}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={el.value}
                                        checked={_.get(info, [el.value], false)}
                                        onChange={handleCheck}
                                    />
                                }
                                label={el.label}
                            />
                        </FormGroup>
                    ))}
                </Box>
            </Popover>
        </Provider>
    )
}
