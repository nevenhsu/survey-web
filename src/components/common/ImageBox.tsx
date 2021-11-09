import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'

type ImageBoxProps = BoxProps & {
    imageUrl?: string
    objectFit?: ObjectFit
    noBg?: boolean
}

type ObjectFit = 'fill' | 'contain' | 'cover' | 'none'

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) =>
        !_.includes(['imageUrl', 'objectFit', 'noBg'], prop),
})<ImageBoxProps>(({ imageUrl, objectFit, noBg }) => ({
    position: 'relative',
    background:
        Boolean(imageUrl) && !noBg
            ? `center / ${objectFit} no-repeat url(${imageUrl})`
            : '',
    width: '100%',
    height: 'auto',
    '& img': {
        display: 'inherit',
        width: 'inherit',
        height: 'inherit',
        objectFit,
    },
}))

export default function ImageBox(props: ImageBoxProps) {
    const { imageUrl, objectFit = 'cover', ...rest } = props

    return (
        <StyledBox imageUrl={imageUrl} objectFit={objectFit} {...rest}>
            {Boolean(imageUrl) && <img src={imageUrl} alt="" />}
        </StyledBox>
    )
}
