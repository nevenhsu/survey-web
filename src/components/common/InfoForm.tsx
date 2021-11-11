import * as React from 'react'
import _ from 'lodash'
import Stack from '@mui/material/Stack'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import { toISOString, toDate } from 'utils/helper'
import { FinalInfo, OnChangeInput } from 'common/types'

type InfoFormProps = {
    data?: FinalInfo
    onChange?: OnChangeInput
}

export default function InfoForm(props: InfoFormProps) {
    const { data, onChange } = props

    const { name, gender, birthday, mobile, email } = data ?? {}

    const handleChangeDate = (newValue: Date | null) => {
        if (onChange) {
            onChange({
                target: {
                    name: 'birthday',
                    value: toISOString(newValue ?? undefined),
                },
            } as any)
        }
    }

    return (
        <Stack
            direction="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            spacing={2}
            sx={{ p: 2 }}
        >
            <TextField
                label="姓名"
                name="name"
                variant="outlined"
                value={name ?? ''}
                onChange={onChange}
                fullWidth
            />

            <FormControl component="fieldset">
                <FormLabel component="legend">性別</FormLabel>
                <RadioGroup
                    row
                    name="gender"
                    value={gender ?? ''}
                    onChange={onChange}
                >
                    <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="女生"
                    />
                    <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="男生"
                    />
                    <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="不公開"
                    />
                </RadioGroup>
            </FormControl>

            <MobileDatePicker
                label="生日"
                inputFormat="MM/dd/yyyy"
                renderInput={(params) => <TextField fullWidth {...params} />}
                value={toDate(birthday) ?? null}
                onChange={handleChangeDate}
                maxDate={new Date()}
            />

            <TextField
                label="手機"
                name="mobile"
                variant="outlined"
                value={mobile ?? ''}
                onChange={onChange}
                fullWidth
            />

            <TextField
                label="信箱"
                name="email"
                variant="outlined"
                value={email ?? ''}
                onChange={onChange}
                fullWidth
            />
        </Stack>
    )
}
