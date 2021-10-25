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
import ImageRemoveIcon from 'mdi-react/ImageRemoveIcon'
import surveyApi from 'services/surveyApi'

type ImageUploaderProps = BoxProps & {
    bgImage?: string
    dataUrl?: string
    hideButton?: boolean
    hideDeleteButton?: boolean
    hideImage?: boolean
    onUploaded?: (dataUrl: string) => void
    loadingButtonProps?: LoadingButtonProps
    deleteButtonProps?: IconButtonProps
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

const StyledLoadingButton = styled(LoadingButton)({
    whiteSpace: 'nowrap',
})

const StyledIconButton = styled(IconButton)({
    position: 'absolute',
    top: 4,
    right: 4,
})

export default function ImageUploader(props: ImageUploaderProps) {
    const {
        bgImage,
        onUploaded,
        hideButton,
        hideDeleteButton,
        hideImage,
        loadingButtonProps,
        deleteButtonProps,
        dataUrl = 'dataUrl',
        ...rest
    } = props

    const { enqueueSnackbar } = useSnackbar()

    const [images, setImages] = React.useState<ImageListType>([])
    const [uploading, setUploading] = React.useState(false)
    const [failed, setFailed] = React.useState(false)

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

    const notify = (message: string, variant: VariantType) => () => {
        // variant could be success, error, warning, info, or default
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
                            <StyledLoadingButton
                                className="absolute-center"
                                variant="outlined"
                                size="small"
                                loadingPosition="start"
                                startIcon={<AddIcon />}
                                onClick={onImageUpload}
                                loading={uploading}
                                disabled={uploading}
                                {...loadingButtonProps}
                            >
                                新增圖片
                            </StyledLoadingButton>
                        )}

                        {!hideDeleteButton && !uploading && Boolean(imgSrc) && (
                            <Tooltip title="刪除圖片">
                                <StyledIconButton
                                    size="small"
                                    color="error"
                                    onClick={onImageRemoveAll}
                                    {...deleteButtonProps}
                                >
                                    <ImageRemoveIcon />
                                </StyledIconButton>
                            </Tooltip>
                        )}
                    </StyledBox>
                )
            }}
        </ImageUploading>
    )
}
