import * as React from 'react'
import Button from '@mui/material/Button'
import ImageBox from 'components/common/ImageBox'
import type { ChoiceType } from 'common/types'

export default function ChoiceView(props: {
    value: ChoiceType
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
    showImage?: boolean
}) {
    const { value, onClick, showImage = false } = props

    const {
        id,
        label = '',
        image = '',
        buttonVariant = 'contained',
        buttonColor = '',
        buttonTextColor = '',
    } = value

    return (
        <Button
            id={id}
            variant={buttonVariant}
            onClick={onClick}
            sx={{
                width: '100%',
                color: buttonTextColor,
                backgroundColor: buttonColor,
                flexDirection: 'column',
                padding: showImage ? '0 0 5px' : '5px 15px',
                overflow: 'hidden',
            }}
        >
            {showImage && (
                <ImageBox
                    imageUrl={image}
                    sx={{
                        width: '100%',
                        mb: 2,
                    }}
                />
            )}

            {label}
        </Button>
    )
}
