import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box, { BoxProps } from '@mui/material/Box'
import { setClasses } from 'utils/helper'

const classes = setClasses('Editor', ['root'])

const Root = styled((props: BoxProps) => <Box {...props} />)(({ theme }) => ({
    [`&.${classes.root}`]: {
        textAlign: 'center',
        backgroundColor: theme.palette.background.default,
    },
}))

export default function Editor() {
    React.useEffect(() => {}, [])

    const [value, setValue] = React.useState('one')

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    return (
        <Root sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value="one" label="Item One" />
                <Tab value="two" label="Item Two" />
                <Tab value="three" label="Item Three" />
            </Tabs>
        </Root>
    )
}
