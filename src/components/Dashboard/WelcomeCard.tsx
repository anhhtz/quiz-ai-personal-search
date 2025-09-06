'use client';

import { Card, Space, Text, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';

export function WelcomeCard() {
	const { data: session } = useSession();
	return (
		<Card radius="md">
			<Title order={5}>
				Hi {''}
				{session?.user?.name}, Welcome back!
			</Title>
			<Text fz="sm" c="dimmed" fw="500">
				Hope you are having a great day!
			</Text>
			<Space h="sm" />
			{/* <List
				center
				size="sm"
				spacing="sm"
				icon={
					<ThemeIcon color="green.3" size={22} radius="xl">
						<IconCircleCheck size="1rem" />
					</ThemeIcon>
				}
			>
				<List.Item>If several languages coalesce</List.Item>
				<List.Item>Sed ut perspiciatis unde</List.Item>
				<List.Item>It would be necessary</List.Item>
			</List> */}
		</Card>
	);
}
