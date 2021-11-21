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

export default function CountDownProgress(props: CountDownProgressProps) {
    const { countDown, onEnd, ...rest } = props

    const endTime = React.useMemo(
        () => new Date(Date.now() + countDown),
        [countDown]
    )

    const count = useCountdown(endTime, {
        interval: 1000,
        onEnd,
    })

    const progress = _.round(((countDown - count * 1000) / countDown) * 100)

    const txtLength = `${count}`.length + 2

    return (
        <StyledBox {...rest}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ width: '100%', height: 16, borderRadius: 99 }}
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
