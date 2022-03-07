import * as React from 'react'
import _ from 'lodash'
import utils from 'utility'
import NumberFormat from 'react-number-format'
import { useDimensionsRef } from 'rooks'
import { styled, useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Slider from '@mui/material/Slider'
import InputAdornment from '@mui/material/InputAdornment'
import StyledChip from 'components/common/StyledChip'
import DeviceMode, { getRatio, getWidth } from 'components/common/DeviceMode'
import AspectRatioBox from 'components/common/AspectRatioBox'
import ScaleBox from 'components/common/ScaleBox'
import EditingResult from 'components/Survey/ResultForm/EditingResult'
import ResultTool from 'components/Survey/ResultForm/ResultTool'
import { Contexts, AddButton } from 'components/common/Component'
import { getDefaultComponent } from 'utils/helper'
import { useAppSelector, useAppDispatch } from 'hooks'
import usePreview from 'hooks/usePreview'
import {
    selectCurrentSurvey,
    setResults,
    setStep,
    updateComponent,
} from 'store/slices/survey'
import { selectDevice } from 'store/slices/userDefault'
import { getMuiColor } from 'theme/palette'
import Numeric1BoxIcon from 'mdi-react/Numeric1BoxIcon'
import Numeric2BoxIcon from 'mdi-react/Numeric2BoxIcon'
import { ComponentType, Mode, SurveyStep, QuizMode } from 'common/types'
import type {
    QuizType,
    Result,
    Tags,
    ResultList,
    DeviceType,
    OneInTwoQuiz,
    DraggerQuiz,
} from 'common/types'

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

export default function ResultForm() {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const device = useAppSelector(selectDevice)
    const survey = useAppSelector(selectCurrentSurvey)
    const [ref, dimensions] = useDimensionsRef()

    const instance = Contexts.getInstance('result')
    const { Provider, Context } = instance.getValue()

    const {
        id: surveyId,
        tags,
        results,
        mode,
        quizzes = [],
        setting,
    } = survey ?? {}
    const { maxWidth } = setting ?? {}

    const deviceWidth = getWidth(device, dimensions)

    const isOneInTwoMode = mode === Mode.oneInTwo
    const { list, selectedTags: rawSelectedTags } = results ?? {}
    const selectedTags = _.compact(rawSelectedTags)
    const resultItems = _.map(list, (el) => el)

    const [selectedId, setSelectedId] = React.useState('')
    const [tagsOptions, setTagsOptions] = React.useState<Tags[]>([])
    const [maxScore, setMaxScore] = React.useState(
        getAllDraggerChoices(quizzes).length
    )
    const [resultNumber, setResultNumber] = React.useState(
        resultItems.length || 3
    )
    const [scores, setScores] = React.useState<number[]>(
        getResultRange(resultItems)
    )

    const { uploading, handlePreview } = usePreview(survey)
    const selectedResult: Result | undefined = _.get(list, [selectedId])

    const nextStep = () => {
        dispatch(setStep(SurveyStep.final))
    }

    const handleChangeTags = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value: v } = event.target
        const value = _.trim(v)

        dispatch(
            setResults({
                surveyId,
                newValue: {
                    selectedTags:
                        name === '0'
                            ? [value, selectedTags[1]]
                            : [selectedTags[0], value],
                },
            })
        )
    }

    const handleAdd = (type: ComponentType) => {
        const { id: resultId } = selectedResult ?? {}
        if (surveyId && resultId) {
            const newValue = getDefaultComponent(type)
            dispatch(
                updateComponent({
                    surveyId,
                    resultId,
                    idPath: [],
                    newValue,
                })
            )
        }
    }

    // Initiate Tags Options on OneInTwoMode
    // Or Initiate Max Score on DraggerMode
    React.useEffect(() => {
        if (isOneInTwoMode) {
            const oneInTwoQuizzes = quizzes.filter(
                (el) => el.mode === QuizMode.oneInTwo
            ) as OneInTwoQuiz[]
            const tagsId = _.uniq(
                _.flatten(oneInTwoQuizzes.map((el) => el.tagsId))
            )
            const options = _.compact(tagsId.map((el) => tags[el]))
            setTagsOptions(options)
        } else {
            const choices = getAllDraggerChoices(quizzes)
            setMaxScore(choices.length)
        }
    }, [mode, quizzes])

    // Auto reset results by changing tags
    React.useEffect(() => {
        if (isOneInTwoMode) {
            const newList = getResults(selectedTags, tags)

            const oldKeys = _.keys(list)
            const newKeys = _.keys(newList)
            const intersections = _.intersection(oldKeys, newKeys)

            if (
                intersections.length !== newKeys.length ||
                (newKeys.length === 0 && oldKeys.length > 0)
            ) {
                dispatch(
                    setResults({
                        surveyId,
                        newValue: {
                            list: newList,
                        },
                    })
                )
                setSelectedId(newKeys[0] ?? '')
            }
        }
    }, [isOneInTwoMode, selectedTags])

    // Auto reset scores by changing number
    React.useEffect(() => {
        if (!isOneInTwoMode) {
            if (
                maxScore > 0 &&
                resultNumber > 0 &&
                resultNumber !== resultItems.length
            ) {
                const gap = _.round(maxScore / resultNumber)
                if (gap > 0) {
                    const values = Array(resultNumber)
                        .fill(undefined)
                        .map((x, i) => i * gap)
                    setScores([...values, maxScore])
                } else {
                    setScores([0, maxScore])
                }
            } else if (maxScore === 0 || resultNumber < 1) {
                setScores([])
            }
        }
    }, [isOneInTwoMode, maxScore, resultNumber])

    // Auto reset results by changing score
    React.useEffect(() => {
        if (!isOneInTwoMode) {
            const newList = getRangeResults(scores)

            const oldKeys = _.keys(list)
            const newKeys = _.keys(newList)
            const intersections = _.intersection(oldKeys, newKeys)

            if (_.isEmpty(newKeys)) {
                return
            }

            const oldValues = _.values(list)
            const newValues = _.values(newList)

            if (
                oldKeys.length === newKeys.length &&
                intersections.length !== newKeys.length
            ) {
                const values: Result[] = Array(newValues.length)
                    .fill(undefined)
                    .map((x, index) => {
                        const oldVal = oldValues[index]
                        const newVal = newValues[index]
                        return {
                            ...newVal,
                            components: oldVal.components,
                            bgcolor: oldVal.bgcolor,
                        }
                    })

                const newL = _.keyBy(values, 'id')
                dispatch(
                    setResults({
                        surveyId,
                        newValue: {
                            list: newL,
                        },
                    })
                )

                setSelectedId(newKeys[0] ?? '')
            } else if (
                intersections.length !== newKeys.length ||
                (newKeys.length === 0 && oldKeys.length > 0)
            ) {
                const values = _.map(newValues, (el, index) => {
                    const oldVal = oldValues[index]
                    return oldVal
                        ? {
                              ...el,
                              components: oldVal.components,
                              bgcolor: oldVal.bgcolor,
                          }
                        : el
                })

                const newL = _.keyBy(values, 'id')
                dispatch(
                    setResults({
                        surveyId,
                        newValue: {
                            list: newL,
                        },
                    })
                )
                setSelectedId(newKeys[0] ?? '')
            }
        }
    }, [isOneInTwoMode, scores])

    React.useEffect(() => {
        const { id = '' } = resultItems[0] ?? {}
        setSelectedId(id)
    }, [])

    const renderTagsResults = () => {
        return (
            <>
                <Typography variant="subtitle1" gutterBottom>
                    1. 選擇標籤將填答者分類
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    選擇至多兩個標籤來產生測驗的個人化結果
                </Typography>

                {tagsOptions.length > 0 ? (
                    <>
                        {Array(_.min([2, tagsOptions.length]))
                            .fill(undefined)
                            .map((x, index) => (
                                <TextField
                                    key={`${index}`}
                                    value={selectedTags[index] || ' '}
                                    onChange={handleChangeTags}
                                    name={`${index}`}
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
                                                                selectedTags[
                                                                    index
                                                                ] as any,
                                                                'color',
                                                            ],
                                                            'grey'
                                                        )
                                                    ).color[300],
                                                }}
                                            >
                                                {index === 0 ? (
                                                    <Numeric1BoxIcon />
                                                ) : (
                                                    <Numeric2BoxIcon />
                                                )}
                                            </InputAdornment>
                                        ),
                                    }}
                                    select
                                    fullWidth
                                    sx={{ mb: 3 }}
                                >
                                    <MenuItem value={' '}>未選擇</MenuItem>
                                    {tagsOptions.map((tag) => (
                                        <MenuItem
                                            key={tag.id}
                                            value={tag.id}
                                            disabled={selectedTags.includes(
                                                tag.id
                                            )}
                                        >
                                            {tag.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ))}
                    </>
                ) : (
                    <TextField
                        value=" "
                        helperText="請先編輯二選一的答項標籤"
                        variant="outlined"
                        onChange={() => {}}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                    sx={{
                                        color: getMuiColor('grey').color[300],
                                    }}
                                >
                                    <Numeric1BoxIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 3 }}
                        fullWidth
                        error
                        select
                    >
                        <MenuItem value=" ">無可選擇的標籤</MenuItem>
                    </TextField>
                )}

                <Typography variant="subtitle1" gutterBottom>
                    2. 編輯個人化測驗結果的內容
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    得分最高的標籤決定填答者看到的結果
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
                            color: (theme) =>
                                selectedId === el.id
                                    ? 'white !important'
                                    : theme.palette.grey[800],
                            backgroundColor:
                                selectedId === el.id
                                    ? theme.palette.grey[800]
                                    : 'transparent',
                        }}
                        onClick={() => setSelectedId(el.id)}
                    >
                        <Typography
                            color="inherit"
                            noWrap
                            sx={{ minWidth: '12ch' }}
                        >
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
                                _.compact(_.uniq(labels)).map((el) => (
                                    <StyledChip
                                        key={`${k}${el}`}
                                        size="small"
                                        label={el}
                                        colorName={tags[k].color}
                                        sx={{ ml: 0.5 }}
                                    />
                                ))
                            )}
                        </Stack>
                    </Stack>
                ))}
            </>
        )
    }

    const renderDraggerResults = () => {
        return (
            <>
                <Typography variant="subtitle1" gutterBottom>
                    1. 建立得分等第
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    在此可以決定如何按照得分多寡切分等第，建立個人化結果
                </Typography>

                <NumberFormat
                    customInput={TextField}
                    variant="outlined"
                    value={resultNumber}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    sx={{ color: 'grey.700' }}
                                    spacing={1}
                                >
                                    <Numeric1BoxIcon size={20} />
                                    <Typography variant="body2">
                                        等第數量
                                    </Typography>
                                </Stack>
                            </InputAdornment>
                        ),
                    }}
                    onValueChange={({ value }) => {
                        setResultNumber(Number(value))
                    }}
                    fullWidth
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-input': {
                            textAlign: 'right',
                        },
                    }}
                />

                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ color: 'grey.700', px: 2, mb: 1 }}
                    spacing={1}
                >
                    <Numeric2BoxIcon size={20} />
                    <Typography variant="body2">調整等第分界</Typography>
                </Stack>
                <Box sx={{ px: 2, mb: 3 }}>
                    <Slider
                        value={scores}
                        min={0}
                        max={maxScore}
                        marks={scores.map((value) => ({ value, label: value }))}
                        track={false}
                        onChange={(event, value, activeThumb) => {
                            setScores(value as number[])
                        }}
                    />
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                    2. 編輯個人化測驗結果的內容
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 3 }}>
                    選擇至多兩個標籤來產生測驗的個人化結果
                </Typography>

                {resultItems.map((el, index) => (
                    <Stack
                        key={el.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                            overflowX: 'auto',
                            p: 1,
                            mb: 1,
                            color: (theme) =>
                                selectedId === el.id
                                    ? 'white !important'
                                    : theme.palette.grey[800],
                            backgroundColor:
                                selectedId === el.id
                                    ? theme.palette.grey[800]
                                    : 'transparent',
                        }}
                        onClick={() => setSelectedId(el.id)}
                    >
                        <Typography
                            color="inherit"
                            noWrap
                            sx={{ minWidth: '12ch' }}
                        >
                            {el.title ||
                                _.find(el.components, {
                                    type: ComponentType.title,
                                })?.value ||
                                '未命名'}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                whiteSpace: 'nowrap',
                                bgcolor: 'grey.300',
                                px: 1,
                                py: 0.5,
                            }}
                        >
                            {`等第 ${
                                index === 0 ? el.range[0] : el.range[0] + 1
                            }-${el.range[1]}（含)`}
                        </Typography>
                    </Stack>
                ))}
            </>
        )
    }

    return (
        <Provider context={Context}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 3, height: 80, borderBottom: '1px solid' }}
            >
                <Box>
                    <Typography variant="h5" gutterBottom>
                        編輯個人化測驗結果
                    </Typography>
                    <Typography variant="body1">
                        測驗填答者拖曳題目到正確選項中，會得到分數，分數多寡能用以決定個人化結果的分派
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
                        編輯測驗結果
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
                    <Box
                        sx={{
                            p: 2,
                        }}
                    >
                        {isOneInTwoMode
                            ? renderTagsResults()
                            : renderDraggerResults()}
                    </Box>
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
                            <Tab label="編輯結果" />
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
                                <AspectRatioBox
                                    ratio={getRatio(device)}
                                    sx={{
                                        bgcolor:
                                            selectedResult?.bgcolor || 'white',
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
                                                <EditingResult
                                                    result={selectedResult}
                                                />
                                            </Box>
                                        </Box>
                                    </ScaleBox>
                                </AspectRatioBox>
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
                    <ResultTool surveyId={surveyId} resultId={selectedId} />
                </Box>
            </Stack>
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

function getResults(
    tagsId: string[],
    tags: { [id: string]: Tags }
): ResultList {
    if (_.isEmpty(tagsId)) {
        return {}
    }

    const [tagId1 = '', tagId2 = ''] = tagsId

    const { values: v1 = [] } = tags[tagId1] ?? {}
    const { values: v2 = [] } = tags[tagId2] ?? {}

    if (!v1.length && !v2.length) {
        return {}
    }

    const labels: Array<{
        [tagId: string]: string[]
    }> = []

    if (v1.length > 0 && v2.length > 0) {
        v1.forEach((t1) => {
            v2.forEach((t2) => {
                const obj = {
                    [tagId1]: [t1],
                    [tagId2]: [t2],
                }
                labels.push(obj)
            })
        })
    } else {
        const val = v1.length > 0 ? v1 : v2
        val.forEach((t) => {
            const obj = {
                [tagId1]: [t],
            }
            labels.push(obj)
        })
    }

    const hexed: Result[] = labels.map((el, index) => ({
        id: utils.base64encode(_.join(_.flatten(_.values(el)), '.'), true),
        tags: el,
        range: [],
        components:
            index === 0 ? [getDefaultComponent(ComponentType.title)] : [],
    }))

    return _.keyBy(hexed, 'id')
}

function getRangeResults(values: number[]) {
    const scores = _.filter(
        _.uniq(values),
        (el) => _.isNumber(el) && !_.isNaN(el)
    ).sort((a, b) => a - b)

    if (scores.length > 1) {
        const results: Result[] = Array(scores.length - 1)
            .fill(undefined)
            .map((x, index) => {
                const v1 = scores[index]
                const v2 = scores[index + 1]
                const range = [v1, v2]
                return {
                    id: utils.base64encode(_.join(range, '.'), true),
                    tags: {},
                    range,
                    components:
                        index === 0
                            ? [getDefaultComponent(ComponentType.title)]
                            : [],
                }
            })

        return _.keyBy(results, 'id')
    } else {
        return {}
    }
}

function getAllDraggerChoices(quizzes: QuizType[]) {
    const draggerQuizzes = quizzes.filter(
        (el) => el.mode === QuizMode.dragger
    ) as DraggerQuiz[]
    return _.flatten(draggerQuizzes.map((el) => el.choices))
}

function getResultRange(results: Result[]) {
    const values = _.flatten(results.map((el) => el.range))
    const val = _.filter(
        _.uniq(values),
        (el) => _.isNumber(el) && !_.isNaN(el)
    ).sort((a, b) => a - b)

    return val
}
