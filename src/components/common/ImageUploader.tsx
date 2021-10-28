import * as React from 'react'
import _ from 'lodash'
import ImageUploading, {
    ImageListType,
    ErrorsType,
} from 'react-images-uploading'
import { VariantType, useSnackbar } from 'notistack'
import { styled } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Box, { BoxProps } from '@mui/material/Box'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton'
import AddIcon from 'mdi-react/AddIcon'
import CloseIcon from 'mdi-react/CloseIcon'
import surveyApi from 'services/surveyApi'

type ImageUploaderProps = BoxProps & {
    bgImage?: string
    dataUrl?: string
    hideButton?: boolean
    hideDeleteButton?: boolean
    hideImage?: boolean
    onUploaded?: (dataUrl: string) => void
    loadingButtonProps?: LoadingButtonProps<'div'>
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
    width: '100%',
    height: 'auto',
    minWidth: 88,
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
        loadingButtonProps,
        dataUrl = 'dataUrl',
        ...rest
    } = props

    const { enqueueSnackbar } = useSnackbar()

    const [images, setImages] = React.useState<ImageListType>([])
    const [uploading, setUploading] = React.useState(false)

    const handleChange = (
        value: ImageListType,
        addUpdateIndex?: Array<number>
    ) => {
        setImages(value)

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
                    setUploading(false)
                    notify('Slow or no internet connection', 'error')
                })
        }
    }

    const notify = (message: string, variant: VariantType) => {
        enqueueSnackbar(message, { variant })
    }

    const handleError = (errors: ErrorsType) => {
        if (errors) {
            if (errors.maxNumber) {
                notify('Number of selected images exceed 1 image', 'error')
            }

            if (errors.acceptType) {
                notify('Your selected file type is not allow', 'error')
            }

            if (errors.maxFileSize) {
                notify('Selected file size exceed 10MB', 'error')
            }

            if (errors.resolution) {
                notify(
                    'Selected file is not match your desired resolution',
                    'error'
                )
            }
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

                handleError(errors)

                return (
                    <StyledBox
                        bgImage={hideImage ? '' : bgImage}
                        isDragging={isDragging}
                        {...rest}
                        {...dragProps}
                    >
                        {!hideImage && Boolean(imgSrc) && (
                            <img src={imgSrc} alt="" />
                        )}

                        {!hideButton && (
                            <LoadingButton
                                className="absolute-center"
                                variant="outlined"
                                size="small"
                                loadingPosition="start"
                                startIcon={<AddIcon />}
                                onClick={onImageUpload}
                                loading={uploading}
                                disabled={uploading}
                                component="div"
                                sx={{
                                    whiteSpace: 'nowrap',
                                }}
                                {...loadingButtonProps}
                            >
                                新增圖片
                            </LoadingButton>
                        )}

                        {!hideDeleteButton && !uploading && Boolean(imgSrc) && (
                            <Tooltip title="刪除圖片">
                                <IconButton
                                    size="small"
                                    color="error"
                                    component="div"
                                    onClick={onImageRemoveAll}
                                    sx={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        opacity: 0.5,
                                        '&:hover': {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </StyledBox>
                )
            }}
        </ImageUploading>
    )
}
