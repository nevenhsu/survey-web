import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import ImageBox from 'components/common/ImageBox'
import type { ChoiceType } from 'common/types'

type ChoiceViewProps = ButtonProps & {
    choice: ChoiceType
    showImage?: boolean
}

type StyledButtonProps = ButtonProps & {
    showImage: boolean
    buttonTextColor: string
    buttonColor: string
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) =>
        !_.includes(['showImage', 'buttonTextColor', 'buttonColor'], prop),
})<StyledButtonProps>(({ buttonTextColor, buttonColor, showImage }) => ({
    width: '100%',
    color: buttonTextColor,
    backgroundColor: buttonColor,
    flexDirection: 'column',
    padding: showImage ? '0 0 5px' : '5px 15px',
    overflow: 'hidden',
}))

export default function ChoiceView(props: ChoiceViewProps) {
    const { choice, showImage = false, ...rest } = props

    const {
        id,
        label = '',
        image = '',
        buttonVariant = 'contained',
        buttonColor = '',
        buttonTextColor = '',
    } = choice

    return (
        <StyledButton
            id={id}
            variant={buttonVariant}
            showImage={showImage}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
            {...rest}
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
        </StyledButton>
    )
}
