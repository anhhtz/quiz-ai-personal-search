import { Center, Group, Loader, Text } from '@mantine/core';

export const CustomLoader = () => {
	return (
		// <Box pos={'absolute'} w={'500px'} h={'300px'}>
		<Group justify="center" w={500}>
			<Center>
				<Loader />
				<Text size="md" ml={16} lineClamp={2}>
					Đang tạo dữ liệu cho bạn. Tuỳ số lượng câu hỏi và đáp án, có thể sẽ mất vài phút. Xin vui
					lòng chờ...
				</Text>
			</Center>
		</Group>
		// </Box>
	);
};
