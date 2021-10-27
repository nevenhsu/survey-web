import * as React from 'react'
import _ from 'lodash'
import { useAppSelector, useAppDispatch } from 'hooks'
import type { CustomButton, OnChangeInput, SelectionType } from 'common/types'

type SortViewProps = {
    title: string
    selectionProps: SelectionType
    buttonProps: CustomButton
    onChange: OnChangeInput
}

export default function SortView(props: SortViewProps) {
    return <div />
}
