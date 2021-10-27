import * as React from 'react'
import _ from 'lodash'
import utils from 'utility'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box, { BoxProps } from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import StyledChip from 'components/common/StyledChip'
import DeviceMode from 'components/common/DeviceMode'
import EditingResult from 'components/Editor/ResultForm/EditingResult'
import ResultTool from 'components/Editor/ResultForm/ResultTool'
import { Contexts } from 'components/common/ComponentView'
import { getDefaultComponent } from 'utils/helper'
import { useAppSelector, useAppDispatch } from 'hooks'
import { selectCurrentForm, setResults } from 'store/slices/editor'
import { selectDevice } from 'store/slices/userDefault'
import ThemeProvider from 'theme/ThemeProvider'
import { getMuiColor } from 'theme/palette'
import Numeric1BoxIcon from 'mdi-react/Numeric1BoxIcon'
import Numeric2BoxIcon from 'mdi-react/Numeric2BoxIcon'
import { ComponentType, Mode } from 'common/types'
import type { Result, ResultList, DeviceType } from 'common/types'

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

export default function ResultForm() {
    const dispatch = useAppDispatch()

    const instance = Contexts.getInstance('result')
    const { Provider, Context } = instance.getValue()

    const [selectedId, setSelectedId] = React.useState('')

    const device = useAppSelector(selectDevice)

    const form = useAppSelector(selectCurrentForm)
    const { id: formId, tags, results, mode } = form ?? {}

    const { selectedTags = [], list } = results ?? {}

    const selectedResult = list[selectedId] ?? {}

    const tagsOptions = _.map(tags, (el) => ({ ...el, value: el.id }))
    const resultItems = _.map(list, (el) => el)

    const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value: v } = event.target
        const value = _.trim(v)

        dispatch(
            setResults({
                formId,
                newValue: {
                    selectedTags:
                        name === '0'
                            ? [value, selectedTags[1]]
                            : [selectedTags[0], value],
                },
            })
        )
    }

    React.useEffect(() => {
        if (mode === Mode.persona) {
            const [tagId1 = '', tagId2 = ''] = selectedTags

            const { values = [] } = tags[tagId1] ?? {}
            const { values: values2 = [] } = tags[tagId2] ?? {}

            const labels =
                values.length && values2.length
                    ? _.flatten(
                          values.map((v1) =>
                              values2.map((v2) => ({
                                  [tagId1]: [v1],
                                  [tagId2]: [v2],
                              }))
                          )
                      )
                    : values.length
                    ? values.map((el) => ({ [tagId1]: [el] }))
                    : values2.map((el) => ({ [tagId2]: [el] }))

            const hexed: Result[] = labels.map((el, index) => ({
                id: utils.base64encode(
                    _.join(_.flatten(_.values(el)), '.'),
                    true
                ),
                tags: el,
                components:
                    index === 0
                        ? [getDefaultComponent(ComponentType.title)]
                        : [],
            }))

            const newList: ResultList = _.keyBy(hexed, 'id')

            const oldKeys = _.keys(list)
            const newKeys = _.keys(newList)

            const intersections = _.intersection(oldKeys, newKeys)

            if (!newKeys.length || intersections.length !== newKeys.length) {
                dispatch(
                    setResults({
                        formId,
                        newValue: {
                            list: newList,
                        },
                    })
                )
                setSelectedId(newKeys[0])
            }
        }
    }, [selectedTags[0], selectedTags[1]])

    React.useEffect(() => {
        const { id = '' } = resultItems[0] ?? {}
        setSelectedId(id)
    }, [])

    return (
        <Provider context={Context}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 3, borderBottom: '1px solid' }}
            >
                <Box>
                    <Typography variant="h6">編輯個人化測驗結果</Typography>
                    <Typography variant="body1">（說明文字）</Typography>
                </Box>
                <Box>
                    <Button variant="outlined">預覽測驗</Button>
                    <Box
                        component="span"
                        sx={{ display: 'inline-block', width: 8 }}
                    />
                    <Button variant="contained">編輯測驗結果</Button>
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
                        <Typography variant="subtitle1" gutterBottom>
                            使用標籤
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            選擇兩個標籤來產生測驗的個人化結果
                        </Typography>

                        <TextField
                            value={selectedTags[0] || ' '}
                            onChange={handleTagsChange}
                            name="0"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{
                                            color: getMuiColor(
                                                _.get(
                                                    tags,
                                                    [
                                                        selectedTags[0] as any,
                                                        'color',
                                                    ],
                                                    'grey'
                                                )
                                            ).color[500],
                                        }}
                                    >
                                        <Numeric1BoxIcon />
                                    </InputAdornment>
                                ),
                            }}
                            select
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value={' '}>未選擇</MenuItem>
                            {tagsOptions.map((tag) => (
                                <MenuItem
                                    key={tag.value}
                                    value={tag.value}
                                    disabled={selectedTags.includes(tag.value)}
                                >
                                    {tag.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            value={selectedTags[1] || ' '}
                            onChange={handleTagsChange}
                            name="1"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{
                                            color: getMuiColor(
                                                _.get(
                                                    tags,
                                                    [
                                                        selectedTags[1] as any,
                                                        'color',
                                                    ],
                                                    'grey'
                                                )
                                            ).color[500],
                                        }}
                                    >
                                        <Numeric2BoxIcon />
                                    </InputAdornment>
                                ),
                            }}
                            select
                            fullWidth
                            sx={{ mb: 4 }}
                        >
                            <MenuItem value={' '}>未選擇</MenuItem>
                            {tagsOptions.map((tag) => (
                                <MenuItem
                                    key={tag.value}
                                    value={tag.value}
                                    disabled={selectedTags.includes(tag.value)}
                                >
                                    {tag.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            測驗結果
                        </Typography>

                        {resultItems.map((el) => (
                            <Stack
                                key={el.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                    overflowX: 'auto',
                                    p: 1,
                                    mb: 1,
                                    border: (theme) =>
                                        `1px solid ${theme.palette.grey[300]}`,
                                    bgcolor: (theme) =>
                                        selectedId === el.id
                                            ? theme.palette.grey[100]
                                            : theme.palette.common.white,
                                }}
                                onClick={() => setSelectedId(el.id)}
                            >
                                <Typography noWrap sx={{ minWidth: '12ch' }}>
                                    {el.title ||
                                        _.find(el.components, {
                                            type: ComponentType.title,
                                        })?.value ||
                                        '未命名'}
                                </Typography>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="right"
                                >
                                    {_.map(el.tags, (labels, k) =>
                                        _.compact(labels).map((el) => (
                                            <StyledChip
                                                key={`${k}${el}`}
                                                variant="outlined"
                                                size="small"
                                                label={el}
                                                colorKey={tags[k].color}
                                                sx={{ ml: 0.5 }}
                                            />
                                        ))
                                    )}
                                </Stack>
                            </Stack>
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
                                    <Tab label="編輯結果" />
                                </StyledTabs>
                            </Box>

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
                                            <EditingResult
                                                formId={formId}
                                                result={selectedResult}
                                            />
                                        </div>
                                    </StyledBox>
                                </Box>
                            </Box>

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
                            <ResultTool formId={formId} resultId={selectedId} />
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
