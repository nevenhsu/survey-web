import * as React from 'react'
import _ from 'lodash'
import numeral from 'numeral'
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import CircleChart from 'components/common/Charts/CircleChart'
import { styled, useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack, { StackProps } from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import { StyledBox, Title, SelectorBar } from 'components/Analysis/Shares'
import { colors, chartColors } from 'theme/palette'
import { QuizMode } from 'common/types'
import { quizzesData, optionsData } from 'assets/data/analysis'

type QuizProps = StackProps & {
    selected: boolean
}

const QuizItem = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<QuizProps>(({ selected, theme }) => ({
    userSelect: 'none',
    marginBottom: 8,
    height: 36,
    padding: '2px 16px',
    color: selected ? theme.palette.common.white : theme.palette.grey[800],
    backgroundColor: selected ? theme.palette.grey[800] : 'transparent',
}))

export default function QuizView() {
    const theme = useTheme()
    const [selectedId, setSelectedId] = React.useState('')

    const quizzes = quizzesData

    const selectedQuiz = React.useMemo(() => {
        return _.find(quizzes, { id: selectedId })
    }, [quizzes, selectedId])

    const renderChart = () => {
        if (selectedQuiz) {
            const { mode, data = [] } = selectedQuiz

            switch (mode) {
                case QuizMode.oneInTwo: {
                    const total = _.sum(data.map((el: any) => el.value))

                    return (
                        <Box sx={{ height: 'calc(100vh - 320px)' }}>
                            <Stack
                                direction="row"
                                justifyContent="space-evenly"
                                spacing={2}
                                sx={{ height: '100%' }}
                            >
                                <StyledBox
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        mb: 0,
                                    }}
                                >
                                    <Title
                                        title="整體標籤分佈"
                                        text="填答者選擇最多該標籤的答案，因此獲得該標籤代表之個人化結果的獲得比例"
                                    />
                                    <ResponsiveContainer
                                        height="calc(100% - 80px)"
                                        width="100%"
                                    >
                                        <CircleChart data={data[0]} />
                                    </ResponsiveContainer>
                                </StyledBox>
                                <StyledBox
                                    sx={{ width: '100%', height: '100%' }}
                                >
                                    <Title
                                        title="整體答項選擇次數"
                                        text="各個答項被選擇的次數分配情形"
                                    />
                                    <Box sx={{ height: 'calc(100% - 80px)' }}>
                                        <ResponsiveContainer
                                            height="100%"
                                            width="100%"
                                        >
                                            <BarChart
                                                data={data[1]}
                                                barSize={36}
                                                layout="vertical"
                                                margin={{ left: 48 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                />
                                                <XAxis
                                                    type="number"
                                                    tickFormatter={(n) =>
                                                        numeral(n).format('0,0')
                                                    }
                                                />
                                                <Tooltip
                                                    formatter={(
                                                        value: any,
                                                        name: any,
                                                        props: any
                                                    ) => [
                                                        numeral(value).format(
                                                            '0,0'
                                                        ),
                                                        name,
                                                    ]}
                                                />
                                                <Legend />
                                                <Bar
                                                    name="次數"
                                                    dataKey="value"
                                                    fill={chartColors[0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </StyledBox>
                            </Stack>
                        </Box>
                    )
                }
                case QuizMode.dragger: {
                    return (
                        <Box sx={{ height: 'calc(100vh - 320px)' }}>
                            <Stack
                                direction="row"
                                justifyContent="space-evenly"
                                spacing={2}
                                sx={{ height: '100%' }}
                            >
                                <StyledBox
                                    sx={{ width: '100%', height: '100%' }}
                                >
                                    <Title
                                        title="填答者得分分佈"
                                        text="參與測驗填答者最終獲得分數的分佈"
                                    />
                                    <Box sx={{ height: 'calc(100% - 80px)' }}>
                                        <ResponsiveContainer height="100%">
                                            <AreaChart data={data[0]}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis
                                                    tickFormatter={(n) =>
                                                        numeral(n).format('0,0')
                                                    }
                                                />
                                                <Tooltip
                                                    formatter={(
                                                        value: any,
                                                        name: any,
                                                        props: any
                                                    ) => [
                                                        numeral(value).format(
                                                            '0,0'
                                                        ),
                                                        name,
                                                    ]}
                                                />

                                                <Area
                                                    name="人數"
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke={chartColors[0]}
                                                    fill={chartColors[0]}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </StyledBox>
                                <StyledBox
                                    sx={{ width: '100%', height: '100%' }}
                                >
                                    <Title
                                        title="各選項答對的次數與比例"
                                        text="各個選項答對的次數與比例一目瞭然"
                                    />
                                    <Box sx={{ height: 'calc(100% - 80px)' }}>
                                        <ResponsiveContainer height="100%">
                                            <BarChart
                                                data={data[1]}
                                                barSize={36}
                                                layout="vertical"
                                                margin={{ left: 48 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                />
                                                <XAxis
                                                    type="number"
                                                    tickFormatter={(n) =>
                                                        numeral(n).format('0,0')
                                                    }
                                                />
                                                <Tooltip
                                                    formatter={(
                                                        value: any,
                                                        name: any,
                                                        props: any
                                                    ) => [
                                                        numeral(value).format(
                                                            '0,0'
                                                        ),
                                                        name,
                                                    ]}
                                                />
                                                <Legend />
                                                <Bar
                                                    name="正確次數"
                                                    dataKey="true"
                                                    fill={chartColors[0]}
                                                    stackId="num"
                                                />
                                                <Bar
                                                    name="錯誤次數"
                                                    dataKey="false"
                                                    fill={chartColors[1]}
                                                    stackId="num"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </StyledBox>
                            </Stack>
                        </Box>
                    )
                }
                case QuizMode.selection: {
                    const total = _.sum(data.map((el: any) => el.value))

                    return (
                        <ResponsiveContainer height="100%">
                            <PieChart>
                                <Pie
                                    dataKey="value"
                                    data={data}
                                    fill="#8884d8"
                                    label
                                >
                                    {data.map((el: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                colors[
                                                    index % colors.length
                                                ][300]
                                            }
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    formatter={(
                                        value: any,
                                        name: any,
                                        props: any
                                    ) => {
                                        const num = numeral(value).format('0,0')
                                        const ratio = numeral(
                                            value / total
                                        ).format('0.0%')

                                        return [
                                            <Box sx={{ minWidth: 120 }}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    sx={{
                                                        color: 'primary.main',
                                                        my: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="inherit"
                                                    >
                                                        數量
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="inherit"
                                                    >
                                                        {num}
                                                    </Typography>
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    sx={{
                                                        color: 'primary.main',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="inherit"
                                                    >
                                                        佔比
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="inherit"
                                                    >
                                                        {ratio}
                                                    </Typography>
                                                </Stack>
                                            </Box>,
                                            name,
                                        ]
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )
                }
                case QuizMode.sort: {
                    return (
                        <ResponsiveContainer height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis
                                    tickFormatter={(n) =>
                                        numeral(n).format('0,0')
                                    }
                                />
                                <Tooltip
                                    formatter={(
                                        value: any,
                                        name: any,
                                        props: any
                                    ) => [numeral(value).format('0,0'), name]}
                                />
                                <Legend />
                                <Bar
                                    name="第一"
                                    dataKey="first"
                                    fill={chartColors[0]}
                                />
                                <Bar
                                    name="第二"
                                    dataKey="second"
                                    fill={chartColors[1]}
                                />
                                <Bar
                                    name="第三"
                                    dataKey="third"
                                    fill={chartColors[2]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )
                }
                case QuizMode.slider: {
                    return (
                        <ResponsiveContainer height="100%">
                            <AreaChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis
                                    tickFormatter={(n) =>
                                        numeral(n).format('0,0')
                                    }
                                />
                                <Tooltip
                                    formatter={(
                                        value: any,
                                        name: any,
                                        props: any
                                    ) => [numeral(value).format('0,0'), name]}
                                />

                                <Area
                                    name="數量"
                                    type="monotone"
                                    dataKey="value"
                                    stroke={chartColors[0]}
                                    fill={chartColors[0]}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )
                }
                case QuizMode.fill: {
                    return (
                        <ResponsiveContainer height="100%">
                            <CircleChart data={data} />
                        </ResponsiveContainer>
                    )
                }
            }

            return <div />
        }
        return <div />
    }

    React.useEffect(() => {
        if (quizzes && quizzes.length) {
            setSelectedId(quizzes[0].id)
        }
    }, [quizzes])

    return (
        <>
            <Box sx={{ px: 3, py: 1.75, borderBottom: '1px solid' }}>
                <Typography variant="h5" gutterBottom>
                    單題結果
                </Typography>
                <Typography variant="body1">
                    在此可以查看測驗中個別題目的填答數據
                </Typography>
            </Box>
            <Grid container sx={{ minHeight: 'calc(100vh - 218px)' }}>
                <Grid
                    item
                    sx={{
                        width: 288,
                    }}
                >
                    <Typography py={2} px={2} marginBottom={1}>
                        題目列表
                    </Typography>
                    <Box>
                        {quizzes.map((el, index) => (
                            <QuizItem
                                className="c-pointer"
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                selected={selectedId === el.id}
                                key={el.id}
                                onClick={() => setSelectedId(el.id)}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: `calc(100% - 40px)`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                        }}
                                    >
                                        <Typography
                                            color="inherit"
                                            sx={{
                                                display: 'inline',
                                            }}
                                            noWrap
                                        >
                                            {el.title}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        textAlign: 'right',
                                        color: 'inherit',
                                    }}
                                >
                                    {getModeLabel(el.mode)}
                                </Typography>
                            </QuizItem>
                        ))}
                    </Box>
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid
                    item
                    sx={{
                        width: 'calc(100% - 290px)',
                        bgcolor: 'grey.200',
                    }}
                >
                    <SelectorBar
                        devices={optionsData.devices}
                        sources={optionsData.sources}
                    />

                    <Box sx={{ height: 'calc(100vh - 218px)', p: 3 }}>
                        {Boolean(selectedQuiz) && (
                            <Typography variant="h6" sx={{ mb: 2 }} noWrap>
                                {selectedQuiz?.title}
                            </Typography>
                        )}
                        <Box
                            sx={{
                                height: 'calc(100% - 48px)',
                            }}
                        >
                            {renderChart()}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

function getModeLabel(mode: QuizMode) {
    switch (mode) {
        case QuizMode.selection:
            return '選擇'
        case QuizMode.sort:
            return '排序'
        case QuizMode.slider:
            return '拉桿'
        case QuizMode.fill:
            return '填空'
        case QuizMode.page:
            return '圖文'
        case QuizMode.dragger:
            return '拖曳'
        case QuizMode.oneInTwo:
            return '二選一'
    }
}
