import * as React from 'react'
import _ from 'lodash'
import numeral from 'numeral'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import {
    SelectorBar,
    ElementBox,
    Title,
    LinkList,
} from 'components/Analysis/Shares'
import CircleChart from 'components/common/Charts/CircleChart'
import CircleSmallIcon from 'mdi-react/CircleSmallIcon'
import { replaceByData } from 'utils/helper'
import { ResultName, BehaviorStage, BehaviorAnalysis } from 'common/types'
import type { TextWithTip } from 'common/types'
import {
    optionsData,
    strategyData,
    correlationData,
    insertReg,
} from 'assets/data/analysis'
import { treeData, productTreeData } from 'assets/data/tree'
import { Button } from '@mui/material'

const overall = [{ label: '消費者行為', value: ResultName.consumerBehavior }]

const analysis = [
    { label: '專屬策略建議', value: ResultName.strategyAdvice },
    { label: '客群與行為分析', value: ResultName.customerAnalysis },
]

const inspiration = [
    { label: '正相關分析', value: ResultName.correlationAnalysis },
]

const blocks = [
    {
        label: '整體分佈',
        value: overall,
    },
    {
        label: '策略建議與行為分析',
        value: analysis,
    },
    {
        label: '靈感來源',
        value: inspiration,
    },
]

const stages = [
    { label: '認知問題', value: BehaviorStage.knowledge },
    { label: '蒐集資訊', value: BehaviorStage.research },
    { label: '評估替代品', value: BehaviorStage.evaluate },
    { label: '購買決策', value: BehaviorStage.decide },
    { label: '購買行為', value: BehaviorStage.purchase },
    { label: '買後評估', value: BehaviorStage.postPurchase },
]

const behaviorReports = [
    { label: '商品測驗結果', value: BehaviorAnalysis.product },
    { label: '影響力原則', value: BehaviorAnalysis.principle },
    { label: '建議分群', value: BehaviorAnalysis.persona },
]

const BlockId = 'ResultBlock'

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    '& .MuiTabs-indicator': {
        top: 0,
        bottom: 'unset',
    },
}))

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.grey[800],
    },
    [`& .${tooltipClasses.tooltip}`]: {
        color: theme.palette.grey[50],
        backgroundColor: theme.palette.grey[800],
        padding: 16,
    },
}))

export default function ResultView() {
    const [stage, setStage] = React.useState(BehaviorStage.knowledge)
    const [behavior, setBehavior] = React.useState(BehaviorAnalysis.product)

    const strategy = React.useMemo(() => {
        return _.map(strategyData, ({ text, data }) =>
            replaceByData(text, insertReg, data)
        )
    }, [strategyData])

    const correlation = React.useMemo(() => {
        return _.map(correlationData, ({ text, data }) =>
            replaceByData(text, insertReg, data)
        )
    }, [correlationData])

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
                >
                    <LinkList blocks={blocks} blockId={BlockId} />
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid
                    item
                    xs
                    id={BlockId}
                    sx={{
                        width: 'calc(100% - 290px)',
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
                        {/*     Overall     */}
                        <>
                            <Typography variant="h6" gutterBottom>
                                整體分佈
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                泡泡越大表示越多人符合這個標籤
                            </Typography>

                            <ElementBox name={ResultName.consumerBehavior}>
                                <Title
                                    title="消費者行為"
                                    text="超市調以多種商品推薦模組下的客群與行為分析，為您量身打造專屬策略建議"
                                />
                                <Box
                                    sx={{
                                        bgcolor: (theme) =>
                                            theme.palette.grey[50],
                                    }}
                                >
                                    <StyledTabs
                                        value={stage}
                                        onChange={(x, newValue) =>
                                            setStage(newValue)
                                        }
                                    >
                                        {_.map(
                                            stages,
                                            ({ label, value }, index) => (
                                                <Tab
                                                    key={value}
                                                    label={`${
                                                        index + 1
                                                    } ${label}`}
                                                    value={value}
                                                />
                                            )
                                        )}
                                    </StyledTabs>
                                    <Box sx={{ p: 3, height: 480 }}>
                                        <CircleChart data={treeData} />
                                    </Box>
                                </Box>
                            </ElementBox>
                        </>

                        <Divider sx={{ my: 3 }} />

                        {/*     Analysis     */}
                        <>
                            <Typography variant="h6" gutterBottom>
                                策略建議與行為分析
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                在此可以查看超市調為您客製化的策略建議與相關測驗參與者的行為分析
                            </Typography>

                            <ElementBox name={ResultName.strategyAdvice}>
                                <Title
                                    title="專屬策略建議"
                                    text="超市調以多種商品推薦模組下的客群與行為分析，為您量身打造專屬策略建議"
                                />
                                <TooltipList data={strategy} />
                            </ElementBox>

                            <ElementBox name={ResultName.customerAnalysis}>
                                <Title
                                    title="客群與行為分析"
                                    text="超市調以多種商品推薦模組下的客群與行為分析，為您量身打造專屬策略建議"
                                />
                                <Box
                                    sx={{
                                        bgcolor: (theme) =>
                                            theme.palette.grey[50],
                                    }}
                                >
                                    <StyledTabs
                                        value={behavior}
                                        onChange={(x, newValue) =>
                                            setBehavior(newValue)
                                        }
                                    >
                                        {_.map(
                                            behaviorReports,
                                            ({ label, value }, index) => (
                                                <Tab
                                                    key={value}
                                                    label={`${
                                                        index + 1
                                                    } ${label}`}
                                                    value={value}
                                                />
                                            )
                                        )}
                                    </StyledTabs>
                                    <Box sx={{ p: 2 }}>
                                        <Grid container spacing={3}>
                                            {productTreeData.map((el) => (
                                                <Grid
                                                    key={el.label}
                                                    item
                                                    xs={4}
                                                    sx={{ height: 320 }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                        sx={{ mb: 2 }}
                                                    >
                                                        <Typography variant="body1">
                                                            {el.label}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: (
                                                                    theme
                                                                ) =>
                                                                    theme
                                                                        .palette
                                                                        .primary
                                                                        .main,
                                                            }}
                                                        >
                                                            {el.text}
                                                        </Typography>
                                                    </Stack>
                                                    <CircleChart
                                                        data={el.data}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Box>
                            </ElementBox>
                        </>

                        <Divider sx={{ my: 3 }} />

                        {/*     Inspiration     */}
                        <>
                            <Typography variant="h6" gutterBottom>
                                靈感來源
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                在此超市調運用測驗填答的相關數據，為您客製化提供行銷活動的切入靈感
                            </Typography>

                            <ElementBox name={ResultName.correlationAnalysis}>
                                <Title
                                    title="專屬策略建議"
                                    text="超市調以多種商品推薦模組下的客群與行為分析，為您量身打造專屬策略建議"
                                />

                                <TooltipList data={correlation} />
                            </ElementBox>
                        </>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

function ButtonWithTip(props: { data: TextWithTip }) {
    const { data } = props
    const { text, tooltip } = data ?? {}
    const { text: txt, payload = [] } = tooltip ?? {}

    return (
        <StyledTooltip
            title={
                <>
                    <Typography sx={{ mb: 2 }}>{txt}</Typography>
                    {payload.length > 0 && (
                        <>
                            <Typography
                                variant="caption"
                                sx={(theme) => ({
                                    display: 'block',
                                    mb: 1,
                                    color: theme.palette.grey[100],
                                })}
                            >
                                原始資料
                            </Typography>

                            {payload.map((el) => (
                                <Stack
                                    key={el.name}
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{ mb: 1 }}
                                >
                                    <Typography variant="body2">
                                        {el.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        {numeral(el.value).format(
                                            el.format || '0,0'
                                        )}
                                    </Typography>
                                </Stack>
                            ))}
                        </>
                    )}
                </>
            }
        >
            <Button
                variant="text"
                component="span"
                sx={(theme) => ({
                    ...theme.typography.body1,
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    minWidth: 'unset',
                    px: 0.5,
                    py: 0,
                    m: 0,
                })}
            >
                {text}
            </Button>
        </StyledTooltip>
    )
}

function TooltipList(props: { data: (string | TextWithTip)[][] }) {
    const { data } = props
    return (
        <List>
            {data.map((el, index) => (
                <ListItem
                    key={index}
                    sx={{
                        display: 'block',
                        position: 'relative',
                        pl: 3,
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 0,
                        }}
                    >
                        <CircleSmallIcon />
                    </Box>
                    {el.map((o, i) =>
                        _.isObject(o) ? (
                            <ButtonWithTip key={`${index}${i}`} data={o} />
                        ) : (
                            <Typography
                                key={`${index}${i}`}
                                display="inline-block"
                                sx={{
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {o}
                            </Typography>
                        )
                    )}
                </ListItem>
            ))}
        </List>
    )
}
