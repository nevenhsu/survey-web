import * as React from 'react'
import _ from 'lodash'
import { Link, Element } from 'react-scroll'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box, { BoxProps } from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton'
import ThemeProvider from 'theme/ThemeProvider'
import type { OnChangeInput, OptionType } from 'common/types'

type BlockType = {
    label: string
    value: Array<OptionType>
}

type LinkListProps = {
    blocks: Array<BlockType>
    blockId: string
}

type SelectorBarProps = {
    devices?: Array<OptionType>
    sources?: Array<OptionType>
    onChange?: OnChangeInput
}

export function LinkList(props: LinkListProps) {
    const { blocks = [], blockId } = props

    return (
        <Box
            sx={{
                '& ul:last-child': {
                    borderBottom: 'none',
                },
            }}
        >
            {blocks.map((el) => (
                <List
                    key={el.label}
                    subheader={<ListSubheader>{el.label}</ListSubheader>}
                    sx={{
                        borderBottom: (theme) =>
                            `1px solid ${theme.palette.grey[300]}`,
                    }}
                >
                    {el.value.map((o) => (
                        <Link
                            key={o.value}
                            to={o.value}
                            containerId={blockId}
                            duration={250}
                            smooth
                        >
                            <ListItemButton>{o.label}</ListItemButton>
                        </Link>
                    ))}
                </List>
            ))}
        </Box>
    )
}

export const StyledBox = styled(Box)({
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
})

export function ElementBox(
    props: React.PropsWithChildren<BoxProps & { name: string }>
) {
    const { name, children, style, ...rest } = props
    return (
        <Element name={name} style={style}>
            <StyledBox {...rest}>{children}</StyledBox>
        </Element>
    )
}

export function Title(props: { title?: string; text?: string }) {
    const { title, text } = props
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
        >
            <Box>
                <Typography variant="subtitle1" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2">{text}</Typography>
            </Box>
        </Stack>
    )
}

export function SelectorBar(props: SelectorBarProps) {
    const { devices = [], sources = [], onChange } = props

    const [device, setDevice] = React.useState(' ')
    const [source, setSource] = React.useState(' ')

    const handleChange: OnChangeInput = (event) => {
        const { name, value } = event.target
        if (name === 'device') {
            setDevice(value)
            return
        }
        if (name === 'source') {
            setSource(value)
            return
        }
        if (onChange) {
            onChange(event)
        }
    }

    return (
        <ThemeProvider mode="dark">
            <Paper
                elevation={12}
                sx={{
                    boxShadow: 'none',
                }}
                square
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="start"
                    spacing={4}
                    sx={{
                        width: '100%',
                        height: 48,
                        px: 2,
                    }}
                >
                    <Typography>檢視不同流量來源</Typography>

                    <TextField
                        value={device}
                        onChange={handleChange}
                        variant="standard"
                        name="device"
                        select
                        InputProps={{ disableUnderline: true }}
                    >
                        <MenuItem value={' '}>所有裝置</MenuItem>
                        {devices.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        value={source}
                        onChange={handleChange}
                        variant="standard"
                        name="source"
                        select
                        InputProps={{ disableUnderline: true }}
                    >
                        <MenuItem value={' '}>所有來源</MenuItem>
                        {sources.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </Paper>
        </ThemeProvider>
    )
}
