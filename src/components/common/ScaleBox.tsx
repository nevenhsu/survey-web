import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import type { DeviceType } from 'common/types'

export default function ScaleBox(
    props: React.PropsWithChildren<{
        device: DeviceType
        containerWidth: number | string
    }>
) {
    const { device, containerWidth, children } = props

    const { width, height, scale } = calcValue(device, Number(containerWidth))

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <Box
                sx={{
                    width,
                    height,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                }}
            >
                {children}
            </Box>
        </Box>
    )
}

function calcValue(device: DeviceType, w: number) {
    const full = {
        width: '100%',
        height: '100%',
        scale: 1,
    }
    if (w) {
        switch (device) {
            case 'mobile': {
                if (w < 375) {
                    const scale = _.round(w / 375, 2)
                    return {
                        width: 375,
                        height: 667,
                        scale,
                    }
                }

                return full
            }
            case 'laptop': {
                if (w < 768) {
                    const scale = _.round(w / 768, 2)
                    return {
                        width: 768,
                        height: 576,
                        scale,
                    }
                }

                return full
            }
            case 'desktop': {
                if (w < 1200) {
                    const scale = _.round(w / 1200, 2)
                    return {
                        width: 1200,
                        height: 675,
                        scale,
                    }
                }
                return full
            }
        }
    }

    return {
        width: 375,
        height: 667,
        scale: 1,
    }
}
