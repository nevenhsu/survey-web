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
import { colors } from 'theme/palette'
import { QuizMode } from 'common/types'
import { quizzesData } from 'assets/data/analysis'

type QuizProps = StackProps & {
    selected: boolean
}

const QuizItem = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<QuizProps>(({ selected, theme }) => ({
    userSelect: 'none',
    padding: 8,
    marginBottom: 8,
    color: selected ? theme.palette.primary.main : theme.palette.text.primary,
    backgroundColor: selected
        ? theme.palette.grey[100]
        : theme.palette.common.white,
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
                                            colors[index % colors.length][500]
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
                                    const ratio = numeral(value / total).format(
                                        '0.0%'
                                    )

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
                                                sx={{ color: 'primary.main' }}
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
                    )
                }
                case QuizMode.dragger: {
                    return (
                        <BarChart data={data} barSize={48} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <YAxis dataKey="name" type="category" />
                            <XAxis
                                type="number"
                                tickFormatter={(n) => numeral(n).format('0,0')}
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
                                name="正確次數"
                                dataKey="true"
                                fill={colors[0][500]}
                                stackId="num"
                            />
                            <Bar
                                name="錯誤次數"
                                dataKey="false"
                                fill={colors[1][500]}
                                stackId="num"
                            />
                        </BarChart>
                    )
                }
                case QuizMode.selection: {
                    const total = _.sum(data.map((el: any) => el.value))

                    return (
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
                                            colors[index % colors.length][500]
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
                                    const ratio = numeral(value / total).format(
                                        '0.0%'
                                    )

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
                                                sx={{ color: 'primary.main' }}
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
                    )
                }
                case QuizMode.sort: {
                    return (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                tickFormatter={(n) => numeral(n).format('0,0')}
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
                                fill={colors[0][500]}
                            />
                            <Bar
                                name="第二"
                                dataKey="second"
                                fill={colors[1][500]}
                            />
                            <Bar
                                name="第三"
                                dataKey="third"
                                fill={colors[2][500]}
                            />
                        </BarChart>
                    )
                }
                case QuizMode.slider: {
                    return (
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                tickFormatter={(n) => numeral(n).format('0,0')}
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
                                stroke={colors[0][500]}
                                fill={colors[0][300]}
                            />
                        </AreaChart>
                    )
                }
                case QuizMode.fill: {
                    return <CircleChart data={data} />
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
            <Box sx={{ p: 3, borderBottom: '1px solid' }}>
                <Typography variant="h6">單題結果</Typography>
                <Typography variant="body1">
                    說明文字說明文字說明文字說明文字
                </Typography>
            </Box>
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
                                    }}
                                >
                                    {getModeLabel(el.mode)}
                                </Typography>
                            </QuizItem>
                        ))}
                    </Box>
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid item sx={{ width: 'calc(100% - 290px)' }}>
                    <Box sx={{ height: 'calc(100vh - 218px)', p: 3 }}>
                        {Boolean(selectedQuiz) && (
                            <Typography variant="h6" sx={{ mb: 2 }} noWrap>
                                {selectedQuiz?.title}
                            </Typography>
                        )}
                        <Box sx={{ height: 'calc(100% - 48px)' }}>
                            <ResponsiveContainer height="100%">
                                {renderChart()}
                            </ResponsiveContainer>
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
