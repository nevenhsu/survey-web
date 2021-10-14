import * as React from 'react'
import _ from 'lodash'
import utils from 'utility'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import EditingResult from 'components/Result/EditingResult'
import { getDefaultComponent } from 'utils/helper'
import { useAppSelector, useAppDispatch } from 'hooks'
import { selectCurrentForm, setResults } from 'store/slices/editor'
import Numeric1BoxIcon from 'mdi-react/Numeric1BoxIcon'
import Numeric2BoxIcon from 'mdi-react/Numeric2BoxIcon'
import { setId } from 'utils/helper'
import { ComponentType } from 'common/types'
import type { Result, ResultList } from 'common/types'

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}))

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

    const [selectedId, setSelectedId] = React.useState('')

    const form = useAppSelector(selectCurrentForm)
    const { id: formId, tags, results } = form ?? {}

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
        const [tagId1 = '', tagId2 = ''] = selectedTags

        const { values = [] } = tags[tagId1] ?? {}
        const { values: values2 = [] } = tags[tagId2] ?? {}

        const labels =
            values.length && values2.length
                ? _.flatten(values.map((v1) => values2.map((v2) => [v1, v2])))
                : values.length
                ? values.map((el) => [el])
                : values2.map((el) => [el])

        const hexed: Result[] = labels.map((el) => ({
            id: utils.base64encode(_.join(el, '.'), true),
            labels: el,
            components: [getDefaultComponent(ComponentType.title)],
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

    React.useEffect(() => {
        const { id = '' } = resultItems[0] ?? {}
        setSelectedId(id)
    }, [])

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

                        {resultItems.map((el) => (
                            <Stack
                                key={el.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                    border: (theme) =>
                                        `1px solid ${theme.palette.grey[300]}`,
                                    p: 1,
                                    mb: 1,
                                    bgcolor: (theme) =>
                                        selectedId === el.id
                                            ? theme.palette.grey[100]
                                            : theme.palette.common.white,
                                }}
                                onClick={() => setSelectedId(el.id)}
                            >
                                <Typography noWrap>
                                    {_.find(el.components, {
                                        type: ComponentType.title,
                                    })?.value || '未命名'}
                                </Typography>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="right"
                                >
                                    {el.labels.map((el) => (
                                        <Chip
                                            key={el}
                                            variant="outlined"
                                            size="small"
                                            label={el}
                                            sx={{ ml: 0.5 }}
                                        />
                                    ))}
                                </Stack>
                            </Stack>
                        ))}
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
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                p: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    p: 4,
                                    backgroundColor: 'common.white',
                                }}
                            >
                                <EditingResult
                                    formId={formId}
                                    result={selectedResult}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}
