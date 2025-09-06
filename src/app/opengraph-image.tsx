import { OGImage } from '@/components/OGImage/OGImage';
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.

export const runtime = 'edge';

export const alt = 'Quiz.AI';
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
	return new ImageResponse(<OGImage />, {
		...size,
	});
}
