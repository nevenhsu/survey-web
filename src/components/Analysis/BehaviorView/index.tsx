import * as React from 'react'
import _ from 'lodash'
import numeral from 'numeral'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import {
    SelectorBar,
    ElementBox,
    Title,
    LinkList,
    FormatTick,
    FormatTooltip,
} from 'components/Analysis/Shared'
import { BehaviorName } from 'common/types'
import type { ConversionRatioData, ProductCtrData } from 'common/types'
import { behaviorData, optionsData } from 'assets/data/analysis'

const conversionRatio = [
    { label: '答題況狀', value: BehaviorName.status },
    { label: '點擊率', value: BehaviorName.ctr },
    { label: '推薦商品點擊率', value: BehaviorName.productCtr },
]

const flow = [
    { label: '裝置流量', value: BehaviorName.deviceTraffic },
    { label: '渠道流量', value: BehaviorName.trafficSource },
    { label: '流量交叉分析', value: BehaviorName.flowAnalysis },
]

const quizStatus = [
    { label: '跳出率', value: BehaviorName.bounceRate },
    { label: '停留時間', value: BehaviorName.dwellTime },
]

const blocks = [
    {
        label: '轉換率',
        value: conversionRatio,
    },
    {
        label: '流量',
        value: flow,
    },
    {
        label: '各題表現',
        value: quizStatus,
    },
]

const BlockId = 'AnalysisBlock'

export default function BehaviorView() {
    const theme = useTheme()

    return (
        <>
            <Box sx={{ p: 3, borderBottom: '1px solid' }}>
                <Typography variant="h6">測驗行為報告</Typography>
                <Typography variant="body1">
                    填答者的答題狀況與轉換率，建議參考以下數據決定是否需要優化題目設計
                </Typography>
            </Box>
            <Grid container sx={{ minHeight: 'calc(100vh - 218px)' }}>
                <Grid
                    item
                    sx={{
                        width: 288,
                    }}
                >
                    <LinkList blocks={blocks} blockId={BlockId} />
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid
                    item
                    xs
                    id={BlockId}
                    sx={{
                        height: 'calc(100vh - 218px)',
                        overflow: 'auto',
                        bgcolor: (theme) => theme.palette.grey[50],
                    }}
                >
                    <SelectorBar
                        devices={optionsData.devices}
                        sources={optionsData.sources}
                    />

                    <Box sx={{ p: 3 }}>
                        {/*     Conversion Ratio     */}
                        <>
                            <Typography variant="h6" gutterBottom>
                                轉換率
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                說明文字說明文字說明文字說明文字
                            </Typography>

                            {behaviorData.overviews.map((el) => (
                                <OverviewView key={el.name} data={el} />
                            ))}

                            <ElementBox name={BehaviorName.productCtr}>
                                <Title title="推薦商品點擊率" />
                                <Box
                                    sx={{
                                        p: 3,
                                        bgcolor: (theme) =>
                                            theme.palette.grey[50],
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Typography>
                                            總點擊率{' '}
                                            {numeral(
                                                behaviorData.productCtr.ctr
                                            ).format('0.0%')}
                                        </Typography>
                                        <Typography>
                                            點擊數/觀看數{' '}
                                            {numeral(
                                                behaviorData.productCtr.hits
                                            ).format('0,0')}
                                            /
                                            {numeral(
                                                behaviorData.productCtr.views
                                            ).format('0,0')}
                                        </Typography>
                                    </Stack>

                                    <Divider sx={{ my: 3 }} />

                                    <ResponsiveContainer
                                        height={_.max([
                                            behaviorData.productCtr.data
                                                .length * 60,
                                            240,
                                        ])}
                                    >
                                        <BarChart
                                            layout="vertical"
                                            data={behaviorData.productCtr.data}
                                            barGap={-32}
                                            barSize={32}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                            />
                                            <Tooltip
                                                content={({
                                                    active,
                                                    payload,
                                                }) => (
                                                    <ProductTooltip
                                                        active={active}
                                                        payload={payload as any}
                                                    />
                                                )}
                                            />
                                            <Legend />
                                            <Bar
                                                dataKey="views"
                                                fill={
                                                    theme.palette.primary.main
                                                }
                                            />
                                            <Bar
                                                dataKey="hits"
                                                fill={
                                                    theme.palette.secondary.main
                                                }
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </ElementBox>
                        </>

                        <Divider sx={{ my: 3 }} />

                        {/*     Flow     */}
                        <>
                            <Typography variant="h6" gutterBottom>
                                流量
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                說明文字說明文字說明文字說明文字
                            </Typography>

                            <Stack
                                direction="row"
                                alignItems="start"
                                justifyContent="space-around"
                                spacing={3}
                            >
                                {[
                                    {
                                        name: BehaviorName.deviceTraffic,
                                        data: behaviorData.flow.deviceTraffic,
                                        title: '裝置流量',
                                    },
                                    {
                                        name: BehaviorName.trafficSource,
                                        data: behaviorData.flow.trafficSource,
                                        title: '渠道流量',
                                    },
                                ].map((el) => (
                                    <ElementBox
                                        key={el.name}
                                        name={el.name}
                                        style={{ width: '100%' }}
                                    >
                                        <Title title={el.title} />
                                        <Box
                                            sx={{
                                                p: 3,
                                                bgcolor: (theme) =>
                                                    theme.palette.grey[50],
                                            }}
                                        >
                                            <ResponsiveContainer
                                                height={_.max([
                                                    el.data.length * 60,
                                                    240,
                                                ])}
                                            >
                                                <BarChart
                                                    layout="vertical"
                                                    data={el.data}
                                                    barGap={-32}
                                                    barSize={32}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis type="number" />
                                                    <YAxis
                                                        dataKey="name"
                                                        type="category"
                                                    />
                                                    <Tooltip />
                                                    <Bar
                                                        dataKey="number"
                                                        fill={
                                                            theme.palette
                                                                .primary.main
                                                        }
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </ElementBox>
                                ))}
                            </Stack>

                            <ElementBox name={BehaviorName.flowAnalysis}>
                                <Title title="流量交叉分析" />
                                <Box
                                    sx={{
                                        p: 3,
                                        bgcolor: (theme) =>
                                            theme.palette.grey[50],
                                    }}
                                >
                                    <ResponsiveContainer
                                        height={_.max([
                                            behaviorData.flow.flowAnalysis
                                                .length * 60,
                                            240,
                                        ])}
                                    >
                                        <BarChart
                                            layout="vertical"
                                            data={
                                                behaviorData.flow.flowAnalysis
                                            }
                                            barGap={-32}
                                            barSize={32}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                            />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="mobile"
                                                stackId="device"
                                                fill={
                                                    theme.palette.primary.main
                                                }
                                            />
                                            <Bar
                                                dataKey="desktop"
                                                stackId="device"
                                                fill={
                                                    theme.palette.secondary.main
                                                }
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </ElementBox>
                        </>

                        <Divider sx={{ my: 3 }} />

                        {/*     Quiz Status     */}
                        <>
                            <Typography variant="h6" gutterBottom>
                                各題表現
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                了解測驗設計需要哪些優化
                            </Typography>

                            {[
                                {
                                    name: BehaviorName.bounceRate,
                                    data: behaviorData.quizStatus.bounceRate,
                                    title: '跳出率',
                                    text: '針對跳出率過高的題目，重新設計',
                                    format: '0.0%',
                                },
                                {
                                    name: BehaviorName.dwellTime,
                                    data: behaviorData.quizStatus.dwellTime,
                                    title: '停留時間',
                                    text: '如果題目的填答時間比預期的長、短很多，重新調整題目設計',
                                    format: '00:00:00',
                                },
                            ].map((el) => (
                                <ElementBox
                                    key={el.name}
                                    name={el.name}
                                    style={{ width: '100%' }}
                                >
                                    <Title title={el.title} text={el.text} />
                                    <Box
                                        sx={{
                                            p: 3,
                                            bgcolor: (theme) =>
                                                theme.palette.grey[50],
                                        }}
                                    >
                                        <ResponsiveContainer
                                            height={_.max([
                                                el.data.length * 60,
                                                240,
                                            ])}
                                        >
                                            <BarChart
                                                layout="vertical"
                                                data={el.data}
                                                barGap={-32}
                                                barSize={32}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    type="number"
                                                    tick={({
                                                        x,
                                                        y,
                                                        payload,
                                                    }) => (
                                                        <FormatTick
                                                            x={x}
                                                            y={y}
                                                            value={
                                                                payload.value
                                                            }
                                                            format={el.format}
                                                        />
                                                    )}
                                                />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                />
                                                <Tooltip
                                                    content={({
                                                        active,
                                                        payload,
                                                    }) => (
                                                        <FormatTooltip
                                                            active={active}
                                                            payload={
                                                                payload as any
                                                            }
                                                            format={el.format}
                                                        />
                                                    )}
                                                />
                                                <Bar
                                                    dataKey="number"
                                                    fill={
                                                        theme.palette.primary
                                                            .main
                                                    }
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </ElementBox>
                            ))}
                        </>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

function OverviewView(props: { data: ConversionRatioData }) {
    const { data } = props

    return (
        <ElementBox name={data.name}>
            <Title title={data.label} />
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={3}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-around"
                    sx={{
                        width: '50%',
                        p: 3,
                        bgcolor: (theme) => theme.palette.grey[50],
                    }}
                >
                    {data.left.map((o) => (
                        <Box
                            key={o.label}
                            sx={{
                                textAlign: 'center',
                            }}
                        >
                            <Typography gutterBottom>{o.label}</Typography>
                            <Typography variant="h6">
                                {numeral(o.value).format(o.format)}
                            </Typography>
                        </Box>
                    ))}
                </Stack>

                <Box sx={{ width: '50%' }}>
                    {data.right.map((o) => (
                        <Stack
                            key={o.label}
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ mb: 1 }}
                        >
                            <Typography>{o.label}</Typography>
                            <Typography>
                                {numeral(o.value).format(o.format)}
                            </Typography>
                        </Stack>
                    ))}
                </Box>
            </Stack>
        </ElementBox>
    )
}

function ProductTooltip(props: {
    active?: boolean
    payload?: { payload: ProductCtrData }[]
}) {
    const { active, payload: p } = props

    const productData = _.get(p, [0, 'payload'])
    const { name, views = 0, hits = 0 } = productData ?? {}

    const ratio = numeral(hits / views).format('0.0%')
    if (active && name) {
        return (
            <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    {name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    觀看數: {numeral(views).format('0,0')}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    點擊數: {numeral(hits).format('0,0')}
                </Typography>
                <Typography variant="body2">點擊率: {ratio}</Typography>
            </Paper>
        )
    }

    return null
}
