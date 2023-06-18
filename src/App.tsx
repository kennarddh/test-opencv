import { FC, useEffect, useRef, useState } from 'react'

import cv from '@techstark/opencv-js'

import Canvas from 'Utils/Canvas'
import ImagePromise from 'Utils/ImagePromise'

const App: FC = () => {
	const [OriginalImage, SetOriginalImage] = useState<string>('')

	const GrayCanvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		if (!OriginalImage) return

		const asyncWrapper = async () => {
			if (!GrayCanvasRef.current) return

			const image = await ImagePromise(OriginalImage)

			const canvas = Canvas(image.width, image.height)

			const ctx = canvas.getContext('2d')

			ctx?.drawImage(image, 0, 0)

			const img = cv.imread(canvas)

			console.log(img)

			// to gray scale
			const imgGray = new cv.Mat()
			cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY)
			cv.imshow(GrayCanvasRef.current, imgGray)

			img.delete()
			imgGray.delete()
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

			<canvas ref={GrayCanvasRef} />
		</div>
	)
}

export default App
