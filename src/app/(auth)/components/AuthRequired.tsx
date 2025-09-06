import { Box, Button, Image, Text, Title } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import classes from './AuthRequired.module.css';
// import image from '/public/static/images/20945597.jpg';

const DEFAULT_IMAGE = './../../public/static/images/20945597.jpg';

export default function AuthRequired() {
	return (
		<Box size={'md'}>
			<div className={classes.wrapper} style={{ width: '100%' }}>
				<div className={classes.body}>
					<Title className={classes.title}>Authentication required</Title>
					<Text fw={500} fz="lg" mb={5}>
						Bạn cần đăng nhập để sử dụng chức năng này
					</Text>
					<Text fz="sm" c="dimmed">
						Vui lòng đăng ký/đăng nhập để sử dụng đầy đủ các chức năng của website. Thông tin của
						bạn được đảm bảo an toàn, bảo mật.
					</Text>

					<div className={classes.controls}>
						{/* <TextInput
							placeholder="Your email"
							classNames={{ input: classes.input, root: classes.inputWrapper }}
						/> */}
						<Button
							component="a"
							href="/auth"
							radius={'xl'}
							size="md"
							leftSection={<IconLock />}
							w={'50%'}
						>
							Sign in
						</Button>
					</div>
				</div>
				<Image src={DEFAULT_IMAGE} className={classes.image} alt="Auth required" />
			</div>
		</Box>
	);
}
