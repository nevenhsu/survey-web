import * as React from 'react'
import _ from 'lodash'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { Img } from 'react-image'
import { styled } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LoadingButton from '@mui/lab/LoadingButton'
import AddIcon from 'mdi-react/AddIcon'
import ImageRemoveIcon from 'mdi-react/ImageRemoveIcon'
import surveyApi from 'services/surveyApi'

type ImageUploaderProps = BoxProps & {
    bgImage?: string
    dataUrl?: string
    hideButton?: boolean
    hideDeleteButton?: boolean
    hideImage?: boolean
    onUploaded?: (dataUrl: string) => void
}

type StyledBoxProps = BoxProps & {
    isDragging?: boolean
    bgImage?: string
}

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

export default function ImageUploader(props: ImageUploaderProps) {
    const {
        bgImage,
        onUploaded,
        hideButton,
        hideDeleteButton,
        hideImage,
        dataUrl = 'dataUrl',
        ...rest
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
                const imgSrc = img?.dataUrl ?? bgImage ?? ''

                return (
                    <StyledBox
                        bgImage={hideImage ? '' : bgImage}
                        isDragging={isDragging}
                        {...rest}
                        {...dragProps}
                    >
                        {!hideImage && <Img src={imgSrc} alt="" />}

                        {!hideImage && (failed || Boolean(errors)) && (
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

                        {!hideButton && (
                            <LoadingButton
                                className="absolute-center"
                                loading={uploading}
                                loadingPosition="start"
                                startIcon={<AddIcon />}
                                variant="outlined"
                                onClick={onImageUpload}
                                disabled={uploading}
                            >
                                新增圖片
                            </LoadingButton>
                        )}

                        {!hideDeleteButton && !uploading && Boolean(imgSrc) && (
                            <Tooltip title="刪除圖片">
                                <IconButton
                                    onClick={onImageRemoveAll}
                                    color="error"
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                    }}
                                >
                                    <ImageRemoveIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </StyledBox>
                )
            }}
        </ImageUploading>
    )
}
