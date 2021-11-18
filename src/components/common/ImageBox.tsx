import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'
import { ObjectFit } from 'common/types'

type ImageBoxProps = BoxProps & {
    imageUrl?: string
    objectFit?: ObjectFit
}

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => !_.includes(['objectFit'], prop),
})<ImageBoxProps>(({ objectFit }) => ({
    position: 'relative',
    width: '100%',
    height: 'auto',
    '& img': {
        display: 'inherit',
        width: '100%',
        height: '100%',
        objectFit,
    },
}))

export default function ImageBox(props: ImageBoxProps) {
    const { imageUrl, objectFit = 'cover', ...rest } = props

    return (
        <StyledBox objectFit={objectFit} {...rest}>
            {Boolean(imageUrl) && <img src={imageUrl} alt="" />}
        </StyledBox>
    )
}
