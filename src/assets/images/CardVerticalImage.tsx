import * as React from 'react'

const CardHorizonImage = (props: React.SVGAttributes<any>) => {
    return (
        <svg
            width="56"
            height="41"
            viewBox="0 0 56 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect
                x="0.869141"
                width="54.7613"
                height="40.9849"
                fill="#C4C4C4"
            />
            <rect x="8.68457" y="5" width="40" height="10" fill="#737373" />
            <rect x="21" y="18" width="14" height="5" fill="#737373" />
            <rect x="21" y="25" width="14" height="5" fill="#737373" />
            <rect x="21" y="32" width="14" height="5" fill="#737373" />
        </svg>
    )
}

export default CardHorizonImage
