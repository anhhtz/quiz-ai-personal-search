'use client';
import { Badge, Button, Card, Grid, Group, Image, Text } from '@mantine/core';

export function ServiceCard() {
	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Card.Section component="a" href="https://mantine.dev/">
				<Image
					src="https://miro.medium.com/v2/resize:fit:1400/1*isB_mIPLZqoURUupfv7Llw.jpeg"
					height={160}
					alt="Norway"
				/>
			</Card.Section>

			<Group justify="space-between" mt="md" mb="xs">
				<Text fw={500}>Thông báo dữ liệu Quyết toán năm</Text>
				{/* <Badge color="pink" variant="light">
					FREE
				</Badge> */}
			</Group>

			<Text size="sm" c="dimmed">
				Dịch vụ thông báo khi dữ liệu quyết toán năm được tạo hoàn tất trên máy chủ.
			</Text>

			<Button color="blue" fullWidth mt="md" radius="md">
				Đăng ký
			</Button>
		</Card>
	);
}
