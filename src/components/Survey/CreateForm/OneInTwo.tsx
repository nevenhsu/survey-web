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

enum BlockName {
    a = 'a',
    b = 'b',
    c = 'c',
    d = 'd',
}

export default function OneInTwo() {
    const [tab, setTab] = React.useState(0)

    const scrollTo = (blockName: BlockName) => {
        scroller.scrollTo(blockName, {
            duration: 250,
            smooth: true,
        })
    }

    return (
        <Box sx={{ p: 3, pb: 6 }}>
            <Box sx={{ mb: 8 }}>
                <Typography variant="h5" gutterBottom>
                    模組特色
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    範本特色說明
                </Typography>

                <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                    spacing={2}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <ImageBox
                            imageUrl="images/one-in-two/survey-1-1.png"
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="caption">
                            Highlight 圖片說明
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <ImageBox
                            imageUrl="images/one-in-two/survey-1-2.png"
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="caption">
                            Highlight 圖片說明
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <ImageBox
                            imageUrl="images/one-in-two/survey-1-3.png"
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="caption">
                            Highlight 圖片說明
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Grid container spacing={2}>
                <Grid
                    item
                    sx={{
                        width: 288,
                        position: 'sticky',
                        height: 'fit-content',
                        top: 0,
                    }}
                >
                    <Typography variant="subtitle1" sx={{ mb: 3 }}>
                        來看看二選一在做什麼
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
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                參與測驗
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                參與者完成遊戲化測驗，產生個人化結果
                            </Typography>

                            <ImageBox imageUrl="images/one-in-two/survey-2-1.png" />
                        </Box>
                    </Element>
                    <Element name={BlockName.b}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                測驗模組產生個人化結果
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                模組能自動產生個人化結果給參與者
                            </Typography>

                            <ImageBox imageUrl="images/one-in-two/survey-2-2.png" />
                        </Box>
                    </Element>
                    <Element name={BlockName.c}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                個人化結果預覽
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                模組預先建立了個人化結果範本供調整
                            </Typography>

                            <ImageBox imageUrl="images/one-in-two/survey-2-3.png" />
                        </Box>
                    </Element>
                    <Element name={BlockName.d}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                查看分析
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                自動產生基於填答者行為的分析
                            </Typography>
                        </Box>

                        <Stack
                            direction="row"
                            justifyContent="space-evenly"
                            alignItems="center"
                            spacing={2}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <ImageBox
                                    imageUrl="images/one-in-two/survey-3-1.png"
                                    sx={{ mb: 2 }}
                                />
                                <Typography variant="caption">
                                    Highlight 圖片說明
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <ImageBox
                                    imageUrl="images/one-in-two/survey-3-2.png"
                                    sx={{ mb: 2 }}
                                />
                                <Typography variant="caption">
                                    Highlight 圖片說明
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <ImageBox
                                    imageUrl="images/one-in-two/survey-3-3.png"
                                    sx={{ mb: 2 }}
                                />
                                <Typography variant="caption">
                                    Highlight 圖片說明
                                </Typography>
                            </Box>
                        </Stack>
                    </Element>
                </Grid>
            </Grid>
        </Box>
    )
}
