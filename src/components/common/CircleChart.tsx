import * as React from 'react'
import _ from 'lodash'
import { animated } from '@react-spring/web'
import {
    ResponsiveCirclePacking,
    CircleProps,
    useNodeMouseHandlers,
} from '@nivo/circle-packing'
import Box from '@mui/material/Box'
import type { TreeData } from 'common/types'
import { getMuiColor, Color } from 'theme/palette'

const CircleSvg = <RawDatum,>({
    node,
    style,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onClick,
}: CircleProps<RawDatum>) => {
    const handlers = useNodeMouseHandlers<RawDatum>(node, {
        onMouseEnter,
        onMouseMove,
        onMouseLeave,
        onClick,
    })

    const color = _.get(node, ['data', 'color'])

    if (color) {
        node.color = color
    }

    return (
        <animated.circle
            key={node.id}
            cx={style.x}
            cy={style.y}
            r={style.radius}
            fill={color || node.fill || style.color}
            stroke={style.borderColor}
            strokeWidth={style.borderWidth}
            opacity={style.opacity}
            onMouseEnter={handlers.onMouseEnter}
            onMouseMove={handlers.onMouseMove}
            onMouseLeave={handlers.onMouseLeave}
            onClick={handlers.onClick}
        />
    )
}

export default function CircleChart(props: {
    data: TreeData
    id?: string
    value?: string
    label?: string
}) {
    const { data, id = 'name', value = 'value', label = 'id' } = props
    const { valueFormat } = data

    const [zoomedId, setZoomedId] = React.useState<string | null>(null)

    const coloredData = React.useMemo(() => {
        return setDataColor(data)
    }, [data])

    return (
        <Box
            sx={{ width: '100%', height: '100%' }}
            onClick={() => setZoomedId(null)}
        >
            <ResponsiveCirclePacking
                id={id}
                value={value}
                label={label}
                data={coloredData}
                labelsSkipRadius={12}
                zoomedId={zoomedId}
                valueFormat={valueFormat}
                circleComponent={CircleSvg}
                labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
                onClick={(node, event) => {
                    event.stopPropagation()
                    setZoomedId(zoomedId === node.id ? null : node.id)
                }}
                motionConfig="slow"
                colorBy="id"
                enableLabels
                leavesOnly
            />
        </Box>
    )
}

function setDataColor(data: TreeData, colorName?: string) {
    const { color, children = [] } = data

    if (!color || !data.colorName) {
        const { name, color: colors } = getMuiColor(colorName)
        data.colorName = name
        data.color = colors[300]
    }

    if (children.length) {
        const { name: childrenColorName } = getColor(data.colorName)
        data.children = _.map(children, (el) =>
            setDataColor(el, childrenColorName)
        )
    }

    return data
}

function getColor(exclude?: string): { name: string; color: Color } {
    const { name, color } = getMuiColor()

    if (name === exclude) {
        return getColor(exclude)
    }

    return { name, color }
}
