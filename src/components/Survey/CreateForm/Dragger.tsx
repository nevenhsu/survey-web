import * as React from 'react'
import _ from 'lodash'
import { Element, scroller } from 'react-scroll'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ImageBox from 'components/common/ImageBox'
import { TabItem } from 'components/Survey/CreateForm/Shares'
import Numeric1CircleOutlineIcon from 'mdi-react/Numeric1CircleOutlineIcon'
import Numeric2CircleOutlineIcon from 'mdi-react/Numeric2CircleOutlineIcon'
import Numeric3CircleOutlineIcon from 'mdi-react/Numeric3CircleOutlineIcon'
import Numeric4CircleOutlineIcon from 'mdi-react/Numeric4CircleOutlineIcon'
import ArrowRightIcon from 'mdi-react/ArrowRightIcon'

enum BlockName {
    a = 'a',
    b = 'b',
    c = 'c',
    d = 'd',
}

export default function Dragger() {
    const [tab, setTab] = React.useState(0)

    const scrollTo = (blockName: BlockName) => {
        scroller.scrollTo(blockName, {
            duration: 250,
            smooth: true,
        })
    }

    return (
        <Box sx={{ p: 6, pb: 6 }}>
            <Box
                sx={{
                    mb: 8,
                    pb: 8,
                    borderBottom: 1,
                    borderColor: (theme) => theme.palette.grey[400],
                }}
            >
                <Typography variant="h5" fontWeight="700" gutterBottom>
                    模組特色
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    本模組具三大特色，能協助你輕鬆設計遊戲化測驗
                </Typography>

                <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="start"
                    spacing={2}
                >
                    <Box
                        sx={{
                            textAlign: 'center',
                            maxWidth: 360,
                        }}
                    >
                        <ImageBox
                            imageUrl="images/dragger/survey-1-1.png"
                            sx={{ mb: 2, borderRadius: 8, overflow: 'hidden' }}
                        />
                        <Box
                            sx={{
                                px: 6,
                            }}
                        >
                            <Typography variant="body2">
                                適合喜歡自我挑戰或自我充實的受眾
                                <br />
                                測驗主題可以很知識性，也能純粹好玩
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center', maxWidth: 360 }}>
                        <ImageBox
                            imageUrl="images/dragger/survey-1-2.png"
                            sx={{ mb: 2, borderRadius: 8, overflow: 'hidden' }}
                        />
                        <Box
                            sx={{
                                px: 6,
                            }}
                        >
                            <Typography variant="body2">
                                透過隨機出題的固定題型，降低題目設計門檻，節省工作時間
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center', maxWidth: 360 }}>
                        <ImageBox
                            imageUrl="images/dragger/survey-1-3.png"
                            sx={{ mb: 2, borderRadius: 8, overflow: 'hidden' }}
                        />
                        <Box
                            sx={{
                                px: 6,
                            }}
                        >
                            <Typography variant="body2">
                                最後有得分讓填答者想跟他人分享比較，或多玩幾次
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </Box>

            <Grid container spacing={8}>
                <Grid
                    item
                    sx={{
                        width: 320,
                        position: 'sticky',
                        height: 'fit-content',
                        top: 0,
                    }}
                >
                    <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
                        模組如何運作
                    </Typography>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={tab}
                        onChange={(event, newValue) => {
                            setTab(newValue)

                            const attributes = _.values(
                                _.get(event, 'currentTarget.attributes')
                            )
                            const name = _.find(attributes, {
                                name: 'name',
                            })
                            const value = _.get(name, 'value')

                            if (value) {
                                scrollTo(value)
                            }
                        }}
                        sx={{
                            '& .MuiTabs-indicator': {
                                left: 0,
                            },
                            '& .MuiTab-root': {
                                alignItems: 'start',
                                justifyContent: 'start',
                            },
                        }}
                    >
                        <Tab
                            label={
                                <TabItem
                                    label="參與測驗"
                                    text="參與者主要經過三階段，完成遊戲化測驗"
                                />
                            }
                            icon={<Numeric1CircleOutlineIcon />}
                            iconPosition="start"
                            component="button"
                            name={BlockName.a}
                        />
                        <Tab
                            label={
                                <TabItem
                                    label="測驗模組產生個人化結果"
                                    text="模組能自動產生個人化結果給參與者"
                                />
                            }
                            icon={<Numeric2CircleOutlineIcon />}
                            iconPosition="start"
                            component="button"
                            name={BlockName.b}
                        />
                        <Tab
                            label={
                                <TabItem
                                    label="個人化結果預覽"
                                    text="模組預先建立了個人化結果範本供調整"
                                />
                            }
                            icon={<Numeric3CircleOutlineIcon />}
                            iconPosition="start"
                            component="button"
                            name={BlockName.c}
                        />
                        <Tab
                            label={
                                <TabItem
                                    label="查看分析"
                                    text="自動產生基於填答者行為的分析"
                                />
                            }
                            icon={<Numeric4CircleOutlineIcon />}
                            iconPosition="start"
                            component="button"
                            name={BlockName.d}
                        />
                    </Tabs>
                </Grid>

                <Grid item xs sx={{ width: `calc(100vw - 288px)` }}>
                    <Element name={BlockName.a}>
                        <Box sx={{ mb: 5 }}>
                            <Typography
                                variant="h6"
                                fontWeight="700"
                                gutterBottom
                            >
                                參與測驗
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                參與者完成遊戲化測驗，產生個人化結果
                            </Typography>

                            <Stack
                                direction="row"
                                alignItems="stretch"
                                spacing={1}
                            >
                                <Box
                                    sx={{ textAlign: 'center', width: '100%' }}
                                >
                                    <ImageBox
                                        imageUrl="images/dragger/survey-2-1-1.png"
                                        sx={{
                                            mb: 2,
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                        }}
                                    />
                                    <Typography variant="body2">
                                        透過測驗主題設計與封面圖片營造，提高填答意願與動機
                                    </Typography>
                                </Box>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ height: 'calc(50% - 24px)' }} />
                                    <ArrowRightIcon />
                                </Box>

                                <Box
                                    sx={{ textAlign: 'center', width: '100%' }}
                                >
                                    <ImageBox
                                        imageUrl="images/dragger/survey-2-1-2.png"
                                        sx={{
                                            mb: 2,
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                        }}
                                    />
                                    <Typography variant="body2">
                                        填答者憑直覺回答測驗的問題
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ height: 'calc(50% - 24px)' }} />
                                    <ArrowRightIcon />
                                </Box>
                                <Box
                                    sx={{ textAlign: 'center', width: '100%' }}
                                >
                                    <ImageBox
                                        imageUrl="images/dragger/survey-2-1-3.png"
                                        sx={{
                                            mb: 2,
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                        }}
                                    />
                                    <Typography variant="body2">
                                        獲得等級結果，並想知道正確答案，可引導至更完整內容
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Element>
                    <Element name={BlockName.b}>
                        <Box sx={{ mb: 5 }}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                            >
                                <Box sx={{ flex: '0 0 33%' }}>
                                    <Typography
                                        variant="h6"
                                        fontWeight="700"
                                        gutterBottom
                                    >
                                        測驗模組產生個人化結果
                                    </Typography>
                                    <Typography variant="body2">
                                        只要根據測驗題型設定題目與一定數量的選項，並在每個選項貼上標籤，平台將自動統計標籤數量，提供填答者個人化結果！
                                    </Typography>
                                    <Typography variant="caption">
                                        ＊也可以新增標籤來搜集愈分析資料
                                    </Typography>
                                </Box>

                                <ImageBox
                                    imageUrl="images/dragger/survey-2-2.png"
                                    sx={{
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                    }}
                                />
                            </Stack>
                        </Box>
                    </Element>
                    <Element name={BlockName.c}>
                        <Box sx={{ mb: 5 }}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                            >
                                <Box sx={{ flex: '0 0 33%' }}>
                                    <Typography
                                        variant="h6"
                                        fontWeight="700"
                                        gutterBottom
                                    >
                                        個人化結果預覽
                                    </Typography>
                                    <Typography variant="body2">
                                        個人化的結果是測驗中很重要的環節，若填答者認為測驗結果有收穫，或有趣，將大幅提高分享意願
                                    </Typography>
                                </Box>

                                <ImageBox
                                    imageUrl="images/dragger/survey-2-3.png"
                                    sx={{
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                    }}
                                />
                            </Stack>
                        </Box>
                    </Element>
                    <Element name={BlockName.d}>
                        <Box sx={{ mb: 5 }}>
                            <Typography
                                variant="h6"
                                fontWeight="700"
                                gutterBottom
                            >
                                查看分析
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                自動產生基於填答者行為的分析
                            </Typography>
                        </Box>

                        <Stack direction="row" alignItems="start" spacing={2}>
                            <Box sx={{ textAlign: 'center', width: '100%' }}>
                                <ImageBox
                                    imageUrl="images/dragger/survey-3-1.png"
                                    sx={{
                                        mb: 2,
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                    }}
                                />
                                <Typography variant="body2">
                                    流量來源管理與分析，可用於分流管理分析，來調整投放測驗資源配置
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', width: '100%' }}>
                                <ImageBox
                                    imageUrl="images/dragger/survey-3-2.png"
                                    sx={{
                                        mb: 2,
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                    }}
                                />
                                <Typography variant="body2">
                                    可以分析答題分佈，瞭解受眾認知或偏好
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', width: '100%' }}>
                                <ImageBox
                                    imageUrl="images/dragger/survey-3-3.png"
                                    sx={{
                                        mb: 2,
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                    }}
                                />
                                <Typography variant="body2">
                                    找出錯誤最多或偏好最高的項目做後續推廣
                                </Typography>
                            </Box>
                        </Stack>
                    </Element>
                </Grid>
            </Grid>
        </Box>
    )
}
