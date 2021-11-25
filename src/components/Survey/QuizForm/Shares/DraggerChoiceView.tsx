import * as React from 'react'
import _ from 'lodash'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import AspectRatioBox from 'components/common/AspectRatioBox'
import ImageUploader from 'components/common/ImageUploader'
import { StyledTextField } from 'components/Survey/QuizForm/Shares'
import type { DraggerChoiceType } from 'common/types'

type DraggerChoiceViewProps = {
    choice: DraggerChoiceType
    showImage: boolean
    onChange: (value: DraggerChoiceType) => void
}

export default function DraggerChoiceView(props: DraggerChoiceViewProps) {
    const { choice: rawChoice, onChange } = props

    const choice = {
        ...rawChoice,
        text: rawChoice.label,
    }
    const { image, bgcolor } = choice ?? {}

    const hasImage = Boolean(image)

    const handleChange = (name: string, value: any) => {
        // use label, remove text,
        const val = {
            ...rawChoice,
            [name]: value,
        }
        onChange(val)
    }

    return (
        <Box
            sx={{
                boxShadow: 4,
                borderRadius: 1,
                overflow: 'hidden',
            }}
        >
            <AspectRatioBox sx={{ bgcolor }}>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ height: '100%', overflow: 'hidden' }}
                >
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{ minHeight: 48 }}
                    >
                        <ImageUploader
                            bgImage={image}
                            onUploaded={(value) => {
                                handleChange('image', value)
                            }}
                            sx={{
                                width: '100%',
                                height: '100%',
                            }}
                            loadingButtonProps={{
                                variant: 'text',
                            }}
                            hideButton={hasImage}
                        />
                    </Box>

                    <StyledTextField
                        variant="standard"
                        placeholder="請輸入名稱"
                        textProps={choice}
                        onCustomize={(value) => {
                            const { label, ...r } = rawChoice
                            const { text, ...v } = value
                            const newValue: DraggerChoiceType = {
                                ...r,
                                ...v,
                                label: `${text || label || ''}`,
                            }
                            onChange(newValue)
                        }}
                        sx={{ pb: 2 }}
                        multiline
                    />
                </Stack>
            </AspectRatioBox>
        </Box>
    )
}
