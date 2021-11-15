import * as React from 'react'
import _ from 'lodash'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import AspectRatioBox from 'components/common/AspectRatioBox'
import ImageUploader from 'components/common/ImageUploader'
import { StyledTextField } from 'components/Survey/QuizForm/Shares'
import type { OnChangeInput } from 'common/types'

type DraggerChoiceViewProps = {
    label: string
    showImage: boolean
    image?: string
    onChange: OnChangeInput
}

export default function DraggerChoiceView(props: DraggerChoiceViewProps) {
    const { label, showImage, image, onChange } = props
    return (
        <Box
            sx={{
                boxShadow: 4,
                borderRadius: 1,
                overflow: 'hidden',
            }}
        >
            <AspectRatioBox>
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
                                onChange({
                                    target: {
                                        value,
                                        name: 'image',
                                    },
                                } as any)
                            }}
                            sx={{
                                width: '100%',
                                height: '100%',
                            }}
                            loadingButtonProps={{
                                variant: 'text',
                            }}
                            hideButton={Boolean(image)}
                        />
                    </Box>

                    <StyledTextField
                        variant="standard"
                        placeholder="請輸入名稱"
                        typoVariant="body1"
                        name="label"
                        value={label ?? ''}
                        onChange={onChange}
                        sx={{ pb: 2 }}
                        multiline
                    />
                </Stack>
            </AspectRatioBox>
        </Box>
    )
}
