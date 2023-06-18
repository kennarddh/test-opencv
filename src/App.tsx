import { FC, useEffect, useRef, useState } from 'react'

import cv from '@techstark/opencv-js'

import Canvas from 'Utils/Canvas'
import ImagePromise from 'Utils/ImagePromise'

const App: FC = () => {
	const [OriginalImage, SetOriginalImage] = useState<string>('')

	const PreviewCanvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		if (!OriginalImage) return

		const asyncWrapper = async () => {
			if (!PreviewCanvasRef.current) return

			const image = await ImagePromise(OriginalImage)

			const canvas = Canvas(image.width, image.height)

			const ctx = canvas.getContext('2d')

			ctx?.drawImage(image, 0, 0)

			const img = cv.imread(canvas)

			const imgPreview = new cv.Mat()

			// Process
			cv.morphologyEx(
				img,
				imgPreview,
				cv.MORPH_CLOSE,
				cv.Mat.ones(15, 15, cv.CV_8U)
			)

			cv.imshow(PreviewCanvasRef.current, imgPreview)

			img.delete()
			imgPreview.delete()
		}

		asyncWrapper()
	}, [OriginalImage])

	return (
		<div>
			<input
				type='file'
				name='file'
				accept='image/*'
				onChange={event => {
					SetOriginalImage(prev => {
						if (!event.target.files?.[0]) return prev

						if (prev) URL.revokeObjectURL(prev)

						return URL.createObjectURL(event.target.files[0])
					})
				}}
			/>
			<img alt='Original input' src={OriginalImage} />

			<canvas ref={PreviewCanvasRef} />
		</div>
	)
}

export default App
