import * as React from 'react'
import _ from 'lodash'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useQuery } from 'hooks'
import { Mode } from 'types/customTypes'

type OptionType = {
    value: string
    label: string
}

type OptionsObj = { [k: string]: OptionType }

type OptionsType = OptionType & {
    options: OptionsObj
}

const customerOptions: { [k: string]: OptionsType } = {
    behavior: {
        value: 'behavior',
        label: '購物行為',
        options: {
            temp: {
                value: 'temp',
                label: '頻率',
            },
        },
    },
}

export default function PickForm() {
    const options1 = [
        {
            value: Mode.customer,
            label: '洞察消費者輪廓',
        },
        {
            value: Mode.product,
            label: '從多種商品中推薦商品給消費者',
        },
    ]

    const [query, updateQuery] = useQuery(['mode'])
    const [option2, setOption2] = React.useState('')
    const options3 = _.get(
        customerOptions,
        [option2, 'options'],
        {}
    ) as OptionsObj
    const [option3, setOption3] = React.useState('')

    const handleChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateQuery({ mode: event.target.value })
    }

    return (
        <>
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 3 }}
            >
                <Grid item>
                    <Typography variant="h6">選擇測驗類型</Typography>
                    <Typography variant="body1">
                        請選擇您的測驗需求，讓我們為您推薦測驗範本
                    </Typography>
                </Grid>
                <Grid item>
                    <Button variant="outlined">建立測驗</Button>
                </Grid>
            </Grid>

            <Grid
                container
                sx={{ p: 3, pt: 0, mt: 0, backgroundColor: 'grey.100' }}
                rowSpacing={3}
            >
                <Grid item xs={12} container alignItems="center">
                    <Grid item xs={4}>
                        <Box component="span">01</Box> 測驗目的
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            select
                            value={query.mode}
                            onChange={handleChangeMode}
                            fullWidth
                        >
                            {options1.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                {query.mode === Mode.customer && (
                    <>
                        <Grid item xs={12} container alignItems="center">
                            <Grid item xs={4}>
                                <Box component="span">02</Box>{' '}
                                你想了解消費者的...
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    select
                                    value={option2}
                                    onChange={(e) => setOption2(e.target.value)}
                                    fullWidth
                                >
                                    {_.map(customerOptions, (option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        {option2 && (
                            <Grid item xs={12} container alignItems="center">
                                <Grid item xs={4}>
                                    <Box component="span">03</Box>{' '}
                                    {`你想了解消費者${customerOptions[option2].label}的...`}
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        select
                                        value={option3}
                                        onChange={(e) =>
                                            setOption3(e.target.value)
                                        }
                                        fullWidth
                                    >
                                        {_.map(options3, (option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        )}
                    </>
                )}
            </Grid>
        </>
    )
}
