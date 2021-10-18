import * as React from 'react'
import _ from 'lodash'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { Img } from 'react-image'
import { styled } from '@mui/material'
import Stack, { StackProps } from '@mui/material/Stack'
import Box, { BoxProps } from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ImageIcon from 'mdi-react/ImageIcon'
import ImagePlusIcon from 'mdi-react/ImagePlusIcon'
import ImageRemoveIcon from 'mdi-react/ImageRemoveIcon'
import surveyApi from 'services/surveyApi'

type ImageUploaderProps = {
    value?: ImageListType
    dataUrl?: string
    boxProps?: BoxProps
    stackProps?: StackProps
    onUploaded?: (dataUrl: string) => void
}

type StyledBoxProps = BoxProps & {
    isDragging?: boolean
}

const Unloader = () => (
    <Box
        sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: 48,
            color: 'white',
        }}
    >
        <ImageIcon className="absolute-center" />
    </Box>
)

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isDragging',
})<StyledBoxProps>(({ theme, isDragging }) => ({
    position: 'relative',
    backgroundColor: theme.palette.grey[300],
    opacity: isDragging ? 0.9 : 1,
    '& img': {
        display: 'inherit',
        width: 'inherit',
        height: 'inherit',
        objectFit: 'cover',
    },
}))

const StyledStack = styled(Stack)({
    position: 'absolute',
    top: 0,
    right: 0,
})

export default function ImageUploader(props: ImageUploaderProps) {
    const {
        value,
        boxProps,
        stackProps,
        onUploaded,
        dataUrl = 'dataUrl',
    } = props

    const [images, setImages] = React.useState<ImageListType>(value ?? [])
    const [uploading, setUploading] = React.useState(false)
    const [failed, setFailed] = React.useState(false)

    const handleChange = (
        value: ImageListType,
        addUpdateIndex?: Array<number>
    ) => {
        setImages(value)
        setFailed(false)

        if (_.isFunction(onUploaded)) {
            const [image = {}] = value

            setUploading(true)

            surveyApi
                .uploadMedia(image.dataUrl)
                .then((val) => {
                    onUploaded(val)
                    setUploading(false)
                })
                .catch((err) => {
                    console.error(err)
                    setFailed(true)
                    setUploading(false)
                })
        }
    }

    return (
        <ImageUploading
            value={images}
            onChange={handleChange}
            dataURLKey={dataUrl}
            acceptType={['jpg', 'jpeg', 'gif', 'png']}
            maxFileSize={1024 * 1024 * 10}
        >
            {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
                errors,
            }) => (
                <StyledBox isDragging={isDragging} {...boxProps} {...dragProps}>
                    {imageList.map((image, index) => (
                        <Img
                            key={image.file?.name ?? index}
                            src={image['dataUrl'] ?? ''}
                            alt=""
                            unloader={<Unloader />}
                        />
                    ))}

                    {images.length === 0 && <Unloader />}

                    {(failed || Boolean(errors)) && (
                        <Box
                            sx={{
                                position: 'absolute',
                                p: 1,
                                left: 0,
                                bottom: 0,
                                color: 'white',
                                width: '100%',
                                bgcolor: (theme) => theme.palette.error.main,
                                opacity: 0.8,
                            }}
                        >
                            {failed && (
                                <Typography variant="overline">
                                    Slow or no internet connection
                                </Typography>
                            )}
                            {errors?.maxNumber && (
                                <Typography variant="overline">
                                    Number of selected images exceed maxNumber
                                </Typography>
                            )}
                            {errors?.acceptType && (
                                <Typography variant="overline">
                                    Your selected file type is not allow
                                </Typography>
                            )}
                            {errors?.maxFileSize && (
                                <Typography variant="overline">
                                    Selected file size exceed maxFileSize
                                </Typography>
                            )}
                            {errors?.resolution && (
                                <Typography variant="overline">
                                    Selected file is not match your desired
                                    resolution
                                </Typography>
                            )}
                        </Box>
                    )}

                    <StyledStack
                        direction="row"
                        justifyContent="right"
                        alignItems="center"
                        spacing={0.5}
                        {...stackProps}
                    >
                        <IconButton onClick={onImageUpload} color="primary">
                            <ImagePlusIcon />
                        </IconButton>
                        <IconButton onClick={onImageRemoveAll} color="error">
                            <ImageRemoveIcon />
                        </IconButton>
                    </StyledStack>
                    {uploading && (
                        <LinearProgress
                            sx={{ position: 'absolute', top: 0, width: '100%' }}
                        />
                    )}
                </StyledBox>
            )}
        </ImageUploading>
    )
}
