import * as React from 'react'
import _ from 'lodash'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { Img } from 'react-image'
import { styled } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Stack, { StackProps } from '@mui/material/Stack'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ImageIcon from 'mdi-react/ImageIcon'
import ImagePlusIcon from 'mdi-react/ImagePlusIcon'
import ImageRemoveIcon from 'mdi-react/ImageRemoveIcon'
import surveyApi from 'services/surveyApi'

type ImageUploaderProps = {
    bgImage?: string
    dataUrl?: string
    boxProps?: BoxProps
    unloaderProps?: BoxProps
    stackProps?: StackProps
    onUploaded?: (dataUrl: string) => void
}

type StyledBoxProps = BoxProps & {
    isDragging?: boolean
    bgImage?: string
}

const StyledUnloaderBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: 'inherit',
    height: 'inherit',
    minHeight: 48,
    color: 'white',
    backgroundColor: theme.palette.grey[300],
}))

const Unloader = (props: BoxProps) => (
    <StyledUnloaderBox {...props}>
        <ImageIcon className="absolute-center" />
    </StyledUnloaderBox>
)

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => !_.includes(['bgImage', 'isDragging'], prop),
})<StyledBoxProps>(({ isDragging, bgImage }) => ({
    position: 'relative',
    opacity: isDragging ? 0.9 : 1,
    background: bgImage ? `center / cover no-repeat url(${bgImage})` : '',
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
        bgImage,
        boxProps,
        unloaderProps,
        stackProps,
        onUploaded,
        dataUrl = 'dataUrl',
    } = props

    const [images, setImages] = React.useState<ImageListType>([])
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
            }) => {
                const [img] = imageList

                return (
                    <StyledBox
                        bgImage={bgImage}
                        isDragging={isDragging}
                        {...boxProps}
                        {...dragProps}
                    >
                        <Img
                            src={img?.dataUrl ?? ''}
                            alt=""
                            unloader={<Unloader {...unloaderProps} />}
                        />

                        {(failed || Boolean(errors)) && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    p: 1,
                                    left: 0,
                                    bottom: 0,
                                    color: 'white',
                                    width: '100%',
                                    bgcolor: (theme) =>
                                        theme.palette.error.main,
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
                                        Number of selected images exceed
                                        maxNumber
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
                            <Tooltip title="上傳圖片">
                                <IconButton
                                    onClick={
                                        uploading ? undefined : onImageUpload
                                    }
                                    color="primary"
                                >
                                    {uploading ? (
                                        <CircularProgress
                                            size={20}
                                            thickness={6}
                                        />
                                    ) : (
                                        <ImagePlusIcon />
                                    )}
                                </IconButton>
                            </Tooltip>
                            {!uploading && Boolean(img) && (
                                <Tooltip title="刪除圖片">
                                    <IconButton
                                        onClick={onImageRemoveAll}
                                        color="error"
                                    >
                                        <ImageRemoveIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </StyledStack>
                    </StyledBox>
                )
            }}
        </ImageUploading>
    )
}
