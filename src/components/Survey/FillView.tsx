import * as React from 'react'
import _ from 'lodash'
import { useAppSelector, useAppDispatch } from 'hooks'
import type { CustomButton, OnChangeInput } from 'common/types'

type FillViewProps = {
    title: string
    value: string
    buttonProps: CustomButton
    onChange: OnChangeInput
}

export default function FillView(props: FillViewProps) {
    return <div />
}
