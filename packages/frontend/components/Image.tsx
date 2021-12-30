import { useEffect, useState } from 'react'

import NextImage, { ImageProps } from 'next/image'

export default function Image(
  props: ImageProps & { fallbackSrc?: ImageProps['src'] }
) {
  const { src, fallbackSrc, ...rest } = props
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <NextImage
      {...rest}
      src={imgSrc}
      unoptimized={true}
      alt={props.alt || ''}
      onError={() => {
        fallbackSrc && setImgSrc(fallbackSrc) // only change to fallback if defined
      }}
    />
  )
}
