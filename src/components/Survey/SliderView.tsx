import * as React from 'react'
import _ from 'lodash'
import { useAppSelector, useAppDispatch } from 'hooks'
import type { CustomButton, OnChangeInput, SliderType } from 'common/types'

type SliderViewProps = {
    title: string
    slider: SliderType
    buttonProps: CustomButton
    onChange: OnChangeInput
}

export default function SliderView(props: SliderViewProps) {
    return <div />
}
