import { Container, Image, SimpleGrid, Text, Title } from '@mantine/core';
import classes from './DataNotFound.module.css';

export default function DataNotFound() {
	return (
		<Container className={classes.root}>
			<SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
				<Image
					alt="Empty data"
					src="/static/images/errors/empty-state.svg"
					className={classes.mobileImage}
				/>
				<div>
					<Title className={classes.title}>Không có dữ liệu nào</Title>
					<Text c="dimmed" size="lg">
						Hiện tại chúng tôi chưa cập nhật dữ liệu ở nội dung này. Anh/chị vui lòng thử lại hoặc
						liên hệ với nhóm hỗ trợ
					</Text>
					{/* <Button
						variant="outline"
						size="md"
						mt="xl"
						radius={'xl'}
						className={classes.control}
						component="a"
						href="/"
					>
						Get back to home page
					</Button> */}
				</div>
				<Image
					src="/static/images/errors/empty-state.svg"
					className={classes.desktopImage}
					alt="Empty data"
				/>
			</SimpleGrid>
		</Container>
	);
}
