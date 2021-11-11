import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

export type AspectRatioBoxProps = BoxProps & {
    ratio?: number
}

const AspectRatioBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'ratio',
})<AspectRatioBoxProps>(({ ratio }) => ({
    position: 'relative',
    height: 0,
    width: '100%',
    paddingTop: ratio ? `${_.round(ratio * 100, 2)}%` : '100%',
    '& > div': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflowY: 'auto',
    },
}))

export default function AspectRatioBoxWrapper(
    props: React.PropsWithChildren<AspectRatioBoxProps>
) {
    const { children, ...rest } = props

    return (
        <AspectRatioBox {...rest}>
            <div>{children}</div>
        </AspectRatioBox>
    )
}
