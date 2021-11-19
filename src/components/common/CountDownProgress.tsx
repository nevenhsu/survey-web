import * as React from 'react'
import _ from 'lodash'
import { useCountdown } from 'rooks'
import { styled } from '@mui/material/styles'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import Stack from '@mui/material/Stack'

type CountDownProgressProps = BoxProps & {
    countDown: number
}

const StyledBox = styled(Box)({
    width: '100%',
})

export default function CountDownProgress(props: CountDownProgressProps) {
    const { countDown, ...rest } = props

    const endTime = React.useMemo(() => new Date(Date.now() + countDown), [])

    const count = useCountdown(endTime, {
        interval: 1000,
    })

    const progress = _.round(((countDown - count * 1000) / countDown) * 100)

    console.log({ count, endTime })

    const txtLength = `${count}`.length + 2

    return (
        <StyledBox {...rest}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ width: '100%' }}
                />
                <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{ minWidth: `${txtLength}ch` }}
                >{`${count}秒`}</Typography>
            </Stack>
        </StyledBox>
    )
}
