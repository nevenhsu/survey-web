import * as React from 'react'
import _ from 'lodash'
import utils from 'utility'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import { useAppSelector, useAppDispatch } from 'hooks'
import { selectCurrentForm, setResults } from 'store/slices/editor'
import Numeric1BoxIcon from 'mdi-react/Numeric1BoxIcon'
import Numeric2BoxIcon from 'mdi-react/Numeric2BoxIcon'
import { ComponentType } from 'common/types'
import type { Result, ResultList } from 'common/types'

const StyledBar = styled(Grid)(({ theme }) => {
    const color = theme.palette.common.white

    return {
        color,
        backgroundColor: theme.palette.grey[800],
        position: 'relative',
        height: 48,
        '& .MuiSelect-select': {
            color,
        },
        '& .MuiSelect-icon': {
            color,
        },
        '& .MuiInput-root:before, & .MuiInput-root:after': {
            opacity: 0,
        },
    }
})

export default function ResultForm() {
    const dispatch = useAppDispatch()

    const form = useAppSelector(selectCurrentForm)
    const { id: formId, tags, results } = form ?? {}

    const { selectedTags = [], list } = results ?? {}

    const tagsOptions = _.map(tags, (el) => ({ ...el, value: el.id }))

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
        const [tagId1 = '', tagId2 = ''] = selectedTags

        const { values = [] } = tags[tagId1] ?? {}
        const { values: values2 = [] } = tags[tagId2] ?? {}

        const labels =
            values.length && values2.length
                ? _.flatten(
                      values.map((v1) => values2.map((v2) => `${v1}.${v2}`))
                  )
                : values.length
                ? values
                : values2

        const hexed: Result[] = labels.map((el) => ({
            id: utils.base64encode(el, true),
            label: el,
            components: [
                {
                    type: ComponentType.title,
                    value: '未命名標題',
                },
            ],
        }))

        const list: ResultList = _.keyBy(hexed, 'id')

        dispatch(
            setResults({
                formId,
                newValue: {
                    list,
                },
            })
        )
    }, [selectedTags[0], selectedTags[1]])

    return (
        <>
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 3, borderBottom: '1px solid' }}
            >
                <Grid item>
                    <Typography variant="h6">編輯個人化測驗結果</Typography>
                    <Typography variant="body1">（說明文字）</Typography>
                </Grid>
                <Grid item>
                    <Button variant="outlined">預覽測驗</Button>
                    <Box
                        component="span"
                        sx={{ display: 'inline-block', width: 8 }}
                    />
                    <Button variant="contained">編輯測驗結果</Button>
                </Grid>
            </Grid>
            <Grid container sx={{ minHeight: 'calc(100vh - 218px)' }}>
                <Grid
                    item
                    sx={{ width: 288, height: '100%', overflowY: 'auto' }}
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
                                    <InputAdornment position="start">
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
                                    <InputAdornment position="start">
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
                    </Box>
                </Grid>
                <Grid item xs>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'grey.700',
                        }}
                    >
                        <StyledBar
                            container
                            alignItems="center"
                            sx={{ px: 2 }}
                        ></StyledBar>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}
