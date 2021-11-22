import * as React from 'react'
import _ from 'lodash'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AspectRatioBox from 'components/common/AspectRatioBox'
import ImageBox from 'components/common/ImageBox'
import type { DraggerChoiceType } from 'common/types'
import { mq } from 'utils/helper'

type DraggerChoiceViewProps = {
    choice?: DraggerChoiceType
}

const DraggerChoiceView = React.forwardRef<unknown, DraggerChoiceViewProps>(
    (props, ref) => {
        const { choice } = props
        const {
            label,
            image,
            color,
            variant,
            fontWeight,
            padding,
            bgcolor = '#ffffff',
        } = choice ?? {}

        const hasImage = Boolean(image)

        return (
            <Box
                sx={{
                    boxShadow: 4,
                    borderRadius: 1,
                    overflow: 'hidden',
                    width: '50%',
                    marginX: 'auto',
                    [mq(768)]: {
                        width: 'auto',
                    },
                }}
                ref={ref}
            >
                <AspectRatioBox sx={{ bgcolor }}>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                        sx={{
                            height: '100%',
                            overflow: 'hidden',
                            pointerEvents: 'none',
                        }}
                    >
                        {hasImage && (
                            <ImageBox
                                imageUrl={image}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        )}

                        <Typography
                            width="100%"
                            variant={variant}
                            sx={{
                                color,
                                pb: 2,
                                fontWeight,
                                padding,
                                textTransform: 'none',
                            }}
                        >
                            {label || '選項'}
                        </Typography>
                    </Stack>
                </AspectRatioBox>
            </Box>
        )
    }
)

export default DraggerChoiceView
