import { Anchor, Avatar, Box, Container, Flex, Notification, Text, Title } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface Prop {
	results: any[];
}

export default function Result({ results }: Prop) {
	if (!results || results.length <= 0)
		return (
			<>
				<Notification
					mt={40}
					icon={<IconX size={16} />}
					color="orange"
					title=""
					withBorder={false}
					withCloseButton={false}
				>
					Không tìm thấy kết quả nào
				</Notification>
			</>
		);

	return (
		<Container size={'lg'} mt={30}>
			{results.map(result => {
				const { Sid, Description, Name, Syntax } = result;
				return (
					<SearchResult key={Sid} name={Name} sid={Sid} description={Description} syntax={Syntax} />
				);
			})}
		</Container>
	);
}

interface ResultProp {
	sid: string;
	description: string;
	name: string;
	syntax?: string;
}
function SearchResult({ sid, description, name, syntax }: ResultProp) {
	const url = `/mis/f/${sid}`;
	const content = `Tên hàm: ${name} - Mô tả:  ${description} - Cú pháp: ${syntax}`;

	return (
		<Box mb={30}>
			<Flex gap={'xs'} mb={0}>
				<Avatar radius={'sm'} color={getRandomColors()}>
					MIS
				</Avatar>
				<Anchor href={url} target="_blank">
					<Title order={4} mb={10}>
						{name}
					</Title>
				</Anchor>
			</Flex>
			<Text>{content}</Text>
		</Box>
	);
}
const getRandomColors = () => {
	const commonColors = [
		'red',
		'blue',
		'green',
		'yellow',
		'orange',
		'pink',
		'purple',
		'brown',
		'gray',
	];

	return commonColors[Math.floor(Math.random() * commonColors.length)];
};
