import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import AddIcon from 'mdi-react/AddIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import StyledChip from 'components/common/StyledChip'
import { useAppDispatch, useAppSelector } from 'hooks'
import { getDefaultResult } from 'utils/helper'
import { personaTags, productTags, defaultTags } from 'common/defaultTags'
import {
    selectCurrentSurvey,
    setResult,
    setResults,
    setStep,
} from 'store/slices/survey'
import { SurveyStep } from 'common/types'
import type { Tags, OnChangeInput } from 'common/types'

type EditingTagType = {
    tagId?: string
    index?: number
}

const MenuIds = {
    tagId: 'tagId',
    tag: 'tag',
}

const Square = styled(Box, {
    shouldForwardProp: (prop) => !_.includes(['width'], prop),
})<BoxProps>(() => ({
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    height: 0,
    '& > div': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflowY: 'auto',
    },
}))

const SquareItem = (props: React.PropsWithChildren<BoxProps>) => {
    const { children, ...rest } = props
    return (
        <Square {...rest}>
            <div>{children}</div>
        </Square>
    )
}

const width = { xs: '25%', lg: '20%' }

export default function ProductForm() {
    const dispatch = useAppDispatch()

    const { id: surveyId, results, tags } = useAppSelector(selectCurrentSurvey)
    const { list = {} } = results ?? {}

    const customTags = getCustomTags(tags)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [resultId, setResultId] = React.useState('')

    const [editingTag, setEditingTag] = React.useState<EditingTagType>({})
    const [menuId, setMenuId] = React.useState('')

    const result = list[resultId] ?? {}

    const nextStep = () => {
        dispatch(setStep(SurveyStep.quiz))
    }

    const handleAdd = () => {
        const newValue = getDefaultResult()
        dispatch(setResult({ surveyId, resultId: newValue.id, newValue }))
    }

    const handleChange: OnChangeInput = (event) => {
        const { id: resultId, name, value } = event.target
        const newValue = { [name]: value }
        dispatch(setResult({ surveyId, resultId, newValue }))
    }

    const handleChipClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
        setResultId(event.currentTarget.id)
    }

    const handleClose = () => {
        setAnchorEl(null)
        setResultId('')
        setMenuId('')
        setEditingTag({})
    }

    const handleAddTag = (tagId: string) => {
        const clonedList = _.cloneDeep(list)

        _.forEach(clonedList, (result) => {
            const { id, tags } = result
            const newValue = { tags }
            const values = newValue.tags[tagId] ?? []

            if (resultId === id || _.isEmpty(values)) {
                values.push('')
            }
            _.set(newValue, ['tags', tagId], values)
        })

        const newValue = { list: clonedList }
        dispatch(setResults({ surveyId, newValue }))
    }

    const handleUpdateTag = (tag: string) => {
        const { tagId, index } = editingTag
        if (!_.isEmpty(result) && tagId && _.isNumber(index)) {
            const { tags } = result

            const newValue = { tags: _.cloneDeep(tags) }
            _.set(newValue, ['tags', tagId, index], tag)

            dispatch(setResult({ surveyId, resultId, newValue }))
        }
    }

    const handleDelete = (value: {
        resultId: string
        tagId: string
        tag: string
        index: number
    }) => {
        const { resultId, tagId, tag, index } = value
        const { tags } = results.list[resultId]
        const newValue = { tags: _.cloneDeep(tags) }
        newValue.tags[tagId].splice(index, 1)

        dispatch(setResult({ surveyId, resultId, newValue }))
    }

    const handleDeleteResult = (resultId: string) => {
        const { [resultId]: deleted, ...rest } = results.list
        const newValue = { list: { ...rest } }

        dispatch(setResults({ surveyId, newValue }))
    }

    const selectedTags = React.useMemo(() => {
        const tagId = editingTag.tagId
        if (tagId) {
            return tags[tagId]
        }
    }, [editingTag])

    const open = Boolean(anchorEl)

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 3, borderBottom: '1px solid' }}
            >
                <Box>
                    <Typography variant="h6">編輯推薦商品</Typography>
                    <Typography variant="body1">
                        描述這些商品的特性，消費者在選購時會考量哪些因素？透過測驗引導他們選出適合的商品
                    </Typography>
                </Box>
                <Box>
                    <Button variant="outlined" onClick={nextStep}>
                        編輯測驗內容
                    </Button>
                </Box>
            </Stack>

            <Box
                sx={{
                    p: 2,
                    minHeight: `calc(100vh - 218px)`,
                    bgcolor: (theme) => theme.palette.grey[100],
                }}
            >
                <Grid
                    container
                    alignItems="center"
                    justifyContent="left"
                    spacing={2}
                >
                    {_.map(list, (r) => r).map((result, index) => (
                        <Grid key={result.id} item sx={{ width }}>
                            <SquareItem sx={{ bgcolor: 'white' }}>
                                <Box sx={{ height: 112 }}>
                                    <Button
                                        size="small"
                                        color="error"
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                        }}
                                        onClick={() =>
                                            handleDeleteResult(result.id)
                                        }
                                    >
                                        刪除
                                    </Button>

                                    <Typography variant="body1" sx={{ p: 1 }}>
                                        {index + 1}
                                    </Typography>
                                    <TextField
                                        id={result.id}
                                        value={result.title ?? ''}
                                        onChange={handleChange}
                                        variant="standard"
                                        name="title"
                                        placeholder="輸入商品簡稱..."
                                        fullWidth
                                        helperText={
                                            Boolean(result.title)
                                                ? ''
                                                : '僅供設計用，填答者不會看到'
                                        }
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                px: 1,
                                                pb: 2,
                                            },
                                            '& .MuiFormHelperText-root': {
                                                px: 1,
                                            },
                                        }}
                                    />
                                </Box>
                                <Box sx={{ px: 1 }}>
                                    <Typography
                                        variant="caption"
                                        component="p"
                                        gutterBottom
                                    >
                                        商品標籤類別
                                    </Typography>
                                    {_.map(result.tags, (t, tagId) =>
                                        t.map((tag, index) => (
                                            <StyledChip
                                                key={`${tag}${index}`}
                                                id={result.id}
                                                label={tag || 'Edit'}
                                                colorKey={tags[tagId].color}
                                                onClick={(e) => {
                                                    handleChipClick(e)
                                                    setEditingTag({
                                                        tagId,
                                                        index,
                                                    })
                                                    setMenuId(MenuIds.tag)
                                                }}
                                                onDelete={() =>
                                                    handleDelete({
                                                        resultId: result.id,
                                                        tagId,
                                                        tag,
                                                        index,
                                                    })
                                                }
                                                sx={{ mb: 1, mr: 1 }}
                                            />
                                        ))
                                    )}
                                    <StyledChip
                                        id={result.id}
                                        label="Add"
                                        colorKey="grey"
                                        onClick={(e) => {
                                            handleChipClick(e)
                                            setMenuId(MenuIds.tagId)
                                        }}
                                        sx={{ mb: 1, mr: 1 }}
                                    />
                                </Box>
                            </SquareItem>
                        </Grid>
                    ))}
                    <Grid item sx={{ width }}>
                        <SquareItem
                            className="c-pointer"
                            sx={{
                                bgcolor: (theme) => theme.palette.grey[300],
                                color: (theme) => theme.palette.grey[600],
                                borderColor: (theme) => theme.palette.grey[600],
                                '&:hover': {
                                    color: (theme) => theme.palette.grey[800],
                                    borderColor: (theme) =>
                                        theme.palette.grey[800],
                                },
                            }}
                            onClick={handleAdd}
                        >
                            <div className="absolute-center">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 72,
                                        height: 72,
                                        color: 'inherit',
                                        borderWidth: 1,
                                        borderStyle: 'solid',
                                        borderColor: `inherit`,
                                        borderRadius: '50%',
                                        mb: 1,
                                    }}
                                >
                                    <AddIcon size={24} />
                                </Box>
                                <Typography
                                    align="center"
                                    sx={{ color: 'inherit' }}
                                >
                                    新增商品
                                </Typography>
                            </div>
                        </SquareItem>
                    </Grid>
                </Grid>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open && menuId === MenuIds.tagId}
                onClose={handleClose}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 'bold',
                        py: 0.5,
                        px: 2,
                        borderBottom: (theme) =>
                            `1px solid ${theme.palette.grey[700]}`,
                    }}
                >
                    適用對象
                </Typography>
                {personaTags.map((el) => (
                    <MenuItem
                        key={el.id}
                        onClick={() => {
                            handleClose()
                            handleAddTag(el.id)
                        }}
                    >
                        {el.label}
                    </MenuItem>
                ))}
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 'bold',
                        py: 0.5,
                        px: 2,
                        borderTop: (theme) =>
                            `1px solid ${theme.palette.grey[700]}`,
                        borderBottom: (theme) =>
                            `1px solid ${theme.palette.grey[700]}`,
                    }}
                >
                    商品特性
                </Typography>
                {productTags.map((el) => (
                    <MenuItem
                        key={el.id}
                        onClick={() => {
                            handleAddTag(el.id)
                            handleClose()
                        }}
                    >
                        {el.label}
                    </MenuItem>
                ))}
                {!_.isEmpty(customTags) && (
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            py: 0.5,
                            px: 2,
                            borderTop: (theme) =>
                                `1px solid ${theme.palette.grey[700]}`,
                            borderBottom: (theme) =>
                                `1px solid ${theme.palette.grey[700]}`,
                        }}
                    >
                        自訂類別
                    </Typography>
                )}
                {_.map(customTags, (el) => el).map((el) => (
                    <MenuItem
                        key={el.id}
                        onClick={() => {
                            handleAddTag(el.id)
                            handleClose()
                        }}
                    >
                        {el.label}
                    </MenuItem>
                ))}
            </Menu>

            <Menu
                anchorEl={anchorEl}
                open={open && menuId === MenuIds.tag}
                onClose={handleClose}
            >
                {Boolean(selectedTags) && (
                    <span>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 'bold',
                                py: 0.5,
                                px: 2,
                                borderBottom: (theme) =>
                                    `1px solid ${theme.palette.grey[700]}`,
                            }}
                        >
                            {selectedTags?.label || ''}
                        </Typography>
                        {selectedTags?.values.map((el) => (
                            <MenuItem
                                key={el}
                                onClick={() => {
                                    handleUpdateTag(el)
                                    handleClose()
                                }}
                            >
                                {el}
                            </MenuItem>
                        ))}
                    </span>
                )}
            </Menu>
        </>
    )
}

function getCustomTags(tags: { [id: string]: Tags }) {
    const ids = defaultTags.map((el) => el.id)
    return _.omit(tags, ids)
}
