'use client';
import { Container } from '@mantine/core';

interface Props {
	children: React.ReactNode;
}
export const dynamic = "force-dynamic";
export default function AuthLayout({ children }: Props) {
	return (
		<Container size="md" mt="xl">
			{children}
		</Container>
	);
}
