import * as React from 'react'
import { styled } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'

type ImageBoxProps = BoxProps & {
    imageUrl?: string
}

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'imageUrl',
})<ImageBoxProps>(({ imageUrl }) => ({
    position: 'relative',
    background: imageUrl ? `center / cover no-repeat url(${imageUrl})` : '',
    width: '100%',
    height: 'auto',
    '& img': {
        display: 'inherit',
        width: 'inherit',
        height: 'inherit',
        objectFit: 'cover',
    },
}))

export default function ImageBox(props: ImageBoxProps) {
    const { imageUrl, ...rest } = props

    return (
        <StyledBox imageUrl={imageUrl} {...rest}>
            {Boolean(imageUrl) && <img src={imageUrl} alt="" />}
        </StyledBox>
    )
}
