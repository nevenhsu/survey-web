import * as ImagesUploading from 'react-images-uploading'

declare module 'react-images-uploading' {
    export interface ImageType {
        dataUrl?: string
        dataURL?: 'never'
    }
}
