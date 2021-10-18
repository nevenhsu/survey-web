import * as React from 'react'
import ImageUploader from 'components/common/ImageUploader'

export default function Dev() {
    return (
        <div>
            <ImageUploader onUploaded={(url) => console.log({ url })} />
        </div>
    )
}
