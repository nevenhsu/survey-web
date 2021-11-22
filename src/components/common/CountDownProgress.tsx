import * as React from 'react'
import _ from 'lodash'
import { useCountdown } from 'rooks'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

type CountDownProgressProps = BoxProps & {
    countDown: number
    onEnd: () => void
}

const StyledBox = styled(Box)({
    width: '100%',
})

const interval = 200

export default function CountDownProgress(props: CountDownProgressProps) {
    const { countDown, onEnd, ...rest } = props

    const endTime = React.useMemo(
        () => new Date(Date.now() + countDown),
        [countDown]
    )

    const count = useCountdown(endTime, {
        interval,
        onEnd,
    })

    const elapsed = count * interval
    const progress = _.round(((countDown - elapsed) / countDown) * 100)
    const elapsedSeconds = _.round(elapsed / 1000)
    const txtLength = `${elapsedSeconds}`.length + 2

    return (
        <StyledBox {...rest}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ width: '100%', height: 16, borderRadius: 99 }}
                    color="inherit"
                />
                <Typography
                    variant="h6"
                    color="primary.text"
                    sx={{ minWidth: `${txtLength}ch` }}
                >{`${elapsedSeconds}秒`}</Typography>
            </Stack>
        </StyledBox>
    )
}
