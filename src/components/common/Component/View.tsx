import * as React from 'react'
import _ from 'lodash'
import ImageBox from 'components/common/ImageBox'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Box from '@mui/material/Box'
import StyledButton from 'components/common/StyledButton'
import { ComponentType } from 'common/types'
import type { Component } from 'common/types'
import type { Variant } from '@mui/material/styles/createTypography'

export type ComponentListProps = {
    components: Component[]
}

type StyledTextFieldProps = TextFieldProps & {
    value: string
    typoVariant?: Variant
}

const StyledTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'typoVariant',
})<StyledTextFieldProps>(({ value, theme, typoVariant }) => ({
    '& .MuiInputBase-input': {
        ...theme.typography[typoVariant ?? 'body1'],
        textAlign: 'inherit',
        color: 'inherit',
        fontWeight: 'inherit',
    },
}))

function ComponentItem(props: { component: Component }) {
    const { component } = props

    const {
        id,
        type,
        value,
        underline,
        display,
        align,
        width,
        height,
        typoVariant,
        fontWeight,
        color,
        bgcolor,
        buttonColor,
        components = [],
    } = component

    const val = value ?? ''

    const [copied, setCopied] = React.useState(false)

    switch (type) {
        case ComponentType.title:
        case ComponentType.typography: {
            return (
                <Typography
                    variant={typoVariant}
                    sx={{
                        color,
                        fontWeight,
                        width,
                        height,
                        bgcolor,
                        textAlign: align,
                    }}
                >
                    {val}
                </Typography>
            )
        }
        case ComponentType.link: {
            return (
                <Link
                    underline={underline}
                    sx={{
                        color,
                        '&.MuiLink-root': { textDecorationColor: 'inherit' },
                    }}
                >
                    <Typography
                        variant={typoVariant}
                        sx={{
                            color,
                            fontWeight,
                            width,
                            height,
                            bgcolor,
                            textAlign: align,
                        }}
                    >
                        {val}
                    </Typography>
                </Link>
            )
        }
        case ComponentType.clipboard: {
            const margin = getMargin(align)

            return (
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    sx={{ width, ...margin }}
                >
                    <StyledTextField
                        value={val}
                        typoVariant={typoVariant}
                        variant="outlined"
                        InputProps={{
                            sx: {
                                color,
                            },
                        }}
                        sx={{
                            minWidth: 'calc(100% - 80px)',
                            height,
                            bgcolor,
                        }}
                        size="small"
                    />
                    <CopyToClipboard text={val} onCopy={() => setCopied(true)}>
                        <StyledButton
                            variant="contained"
                            sx={{ whiteSpace: 'nowrap' }}
                            colorName={buttonColor}
                        >
                            {copied ? '已複製' : '複製'}
                        </StyledButton>
                    </CopyToClipboard>
                </Stack>
            )
        }
        case ComponentType.image: {
            const margin = getMargin(align)

            return (
                <ImageBox
                    imageUrl={val}
                    sx={{
                        display,
                        bgcolor,
                        width,
                        height,
                        textAlign: align,
                        ...margin,
                    }}
                />
            )
        }
        case ComponentType.card:
            return (
                <Box
                    sx={{
                        display,
                        width: '100%',
                        height: '100%',
                        bgcolor,
                        textAlign: align,
                        borderRadius: 1,
                        border: `1px solid ${color}`,
                        overflow: 'hidden',
                    }}
                >
                    <ComponentList components={components} />
                </Box>
            )
    }
}

export function ComponentList(props: ComponentListProps) {
    const { components = [] } = props

    return (
        <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ width: '100%', height: '100%', mt: 0 }}
            rowSpacing={2}
        >
            {components.map((el) => (
                <Grid
                    key={el.id}
                    xs={el.display === 'block' ? 12 : undefined}
                    sx={{
                        width: el.width,
                        height: el.height,
                    }}
                    item
                >
                    <ComponentItem component={el} />
                </Grid>
            ))}
        </Grid>
    )
}

function getMargin(align?: string) {
    if (!align) {
        return { mx: 'auto' }
    }
    return align === 'center'
        ? { mx: 'auto' }
        : align === 'right'
        ? { ml: 'auto' }
        : { mr: 'auto' }
}
