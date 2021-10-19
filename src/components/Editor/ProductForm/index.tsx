import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from 'mdi-react/AddIcon'
import { useAppDispatch, useAppSelector } from 'hooks'
import { selectCurrentForm } from 'store/slices/editor'
import type { Result } from 'common/types'

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

export default function ProductForm() {
    const dispatch = useAppDispatch()
    const { id: formId, results } = useAppSelector(selectCurrentForm)

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
                    <Button variant="outlined">編輯測驗內容</Button>
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
                    <Grid item sx={{ width: '20%' }}>
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
        </>
    )
}
