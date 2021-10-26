import * as React from 'react'
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
