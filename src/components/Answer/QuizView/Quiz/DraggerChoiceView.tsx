import * as React from 'react'
import _ from 'lodash'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AspectRatioBox from 'components/common/AspectRatioBox'
import ImageBox from 'components/common/ImageBox'
import type { DraggerChoiceType } from 'common/types'

type DraggerChoiceViewProps = {
    choice?: DraggerChoiceType
}

const DraggerChoiceView = React.forwardRef<unknown, DraggerChoiceViewProps>(
    (props, ref) => {
        const { choice } = props
        const { label, image } = choice ?? {}

        return (
            <Box
                sx={{
                    boxShadow: 4,
                    borderRadius: 1,
                    overflow: 'hidden',
                }}
                ref={ref}
            >
                <AspectRatioBox>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                        sx={{ height: '100%', overflow: 'hidden' }}
                    >
                        {Boolean(image) && (
                            <ImageBox
                                imageUrl={image}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        )}

                        <Typography
                            variant="body1"
                            width="100%"
                            sx={{
                                textTransform: 'none',
                                pb: 2,
                            }}
                        >
                            {label}
                        </Typography>
                    </Stack>
                </AspectRatioBox>
            </Box>
        )
    }
)

export default DraggerChoiceView
