import * as React from 'react'
import _ from 'lodash'
import Stack, { StackProps } from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import LaptopIcon from 'mdi-react/LaptopIcon'
import CellphoneIcon from 'mdi-react/CellphoneIcon'
import DesktopMacIcon from 'mdi-react/DesktopMacIcon'
import { useAppSelector, useAppDispatch } from 'hooks'
import { selectDevice, setDevice } from 'store/slices/userDefault'
import type { DeviceType } from 'common/types'

export default function DeviceMode(props: StackProps) {
    const dispatch = useAppDispatch()
    const device = useAppSelector(selectDevice)

    const updateDevice = (value: DeviceType) => {
        dispatch(setDevice(value))
    }

    return (
        <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
            {...props}
        >
            <IconButton
                color={device === 'mobile' ? 'primary' : undefined}
                onClick={() => updateDevice('mobile')}
                size="small"
            >
                <CellphoneIcon />
            </IconButton>
            <IconButton
                color={device === 'laptop' ? 'primary' : undefined}
                onClick={() => updateDevice('laptop')}
                size="small"
            >
                <LaptopIcon />
            </IconButton>
            <IconButton
                color={device === 'desktop' ? 'primary' : undefined}
                onClick={() => updateDevice('desktop')}
                size="small"
            >
                <DesktopMacIcon />
            </IconButton>
        </Stack>
    )
}

export function getRatio(device: DeviceType) {
    switch (device) {
        case 'mobile': {
            return 1.777
        }
        case 'laptop': {
            return 0.75
        }
        case 'desktop': {
            return 0.5625
        }
    }
}

export function getWidth(
    device: DeviceType,
    dimensions: { width: number; height: number } | null
): number | string {
    if (dimensions) {
        const padding = 24 * 2
        const marginBottom = 64
        const { width, height: h } = dimensions
        const deviceRatio = getRatio(device)

        const height = h - marginBottom
        const ratio = _.round(height / width, 4)

        if (ratio > deviceRatio) {
            // height is enough
            const w = width - padding

            if (device === 'mobile' && w >= 375) {
                return 375
            }

            return w
        } else {
            // height is not enough

            const maxWidth = _.round(height / deviceRatio) - padding

            if (device === 'mobile' && maxWidth >= 375) {
                return 375
            }

            return maxWidth
        }
    } else {
        if (device === 'mobile') {
            return 375
        }

        return 'calc(100% - 32px)'
    }
}
