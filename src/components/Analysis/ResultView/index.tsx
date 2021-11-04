import * as React from 'react'
import _ from 'lodash'
import numeral from 'numeral'
import { ResponsiveCirclePacking } from '@nivo/circle-packing'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
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
} from 'components/Analysis/Shared'
import CircleSmallIcon from 'mdi-react/CircleSmallIcon'
import { replaceByData } from 'utils/helper'
import { ResultName, BehaviorStage, BehaviorAnalysis } from 'common/types'
import type { TextWithTip } from 'common/types'
import { optionsData, treeData, strategyData } from 'assets/data/analysis'
import { Button } from '@mui/material'

const insertReg = /#insert/g

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

const BlockId = 'ResultBlock'

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
    const [zoomedId, setZoomedId] = React.useState<string | null>(null)

    const strategy = React.useMemo(() => {
        return _.map(strategyData, ({ text, data }) =>
            replaceByData(text, insertReg, data)
        )
    }, [strategyData])

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
                                    <Tabs
                                        value={stage}
                                        onChange={(x, newValue) =>
                                            setStage(newValue)
                                        }
                                        sx={{
                                            bgcolor: (theme) =>
                                                theme.palette.grey[100],
                                            '& .MuiTabs-indicator': {
                                                top: 0,
                                                bottom: 'unset',
                                            },
                                        }}
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
                                    </Tabs>
                                    <Box
                                        sx={{ p: 3, height: 480 }}
                                        onClick={() => setZoomedId(null)}
                                    >
                                        <ResponsiveCirclePacking
                                            id="name"
                                            value="loc"
                                            data={treeData}
                                            labelsSkipRadius={12}
                                            zoomedId={zoomedId}
                                            onClick={(node, event) => {
                                                event.stopPropagation()
                                                setZoomedId(
                                                    zoomedId === node.id
                                                        ? null
                                                        : node.id
                                                )
                                            }}
                                            motionConfig="slow"
                                            enableLabels
                                            leavesOnly
                                        />
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
                                說明文字說明文字說明文字說明文字
                            </Typography>

                            <ElementBox name={ResultName.strategyAdvice}>
                                <Title
                                    title="專屬策略建議"
                                    text="超市調以多種商品推薦模組下的客群與行為分析，為您量身打造專屬策略建議"
                                />

                                <List>
                                    {strategy.map((el, index) => (
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
                                                    <ButtonWithTip
                                                        key={`${index}${i}`}
                                                        data={o}
                                                    />
                                                ) : (
                                                    <Typography
                                                        key={`${index}${i}`}
                                                        display="inline-block"
                                                        sx={{
                                                            whiteSpace:
                                                                'nowrap',
                                                        }}
                                                    >
                                                        {o}
                                                    </Typography>
                                                )
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            </ElementBox>

                            <ElementBox name={ResultName.customerAnalysis}>
                                <Title
                                    title="客群與行為分析"
                                    text="超市調以多種商品推薦模組下的客群與行為分析，為您量身打造專屬策略建議"
                                />
                            </ElementBox>
                        </>

                        <Divider sx={{ my: 3 }} />

                        {/*     Inspiration     */}
                        <>
                            <Typography variant="h6" gutterBottom>
                                靈感來源
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                說明文字說明文字說明文字說明文字
                            </Typography>
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
                                    key={el.label}
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{ mb: 1 }}
                                >
                                    <Typography variant="body2">
                                        {el.label}
                                    </Typography>
                                    <Typography variant="body2">
                                        {numeral(el.value).format(el.format)}
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
