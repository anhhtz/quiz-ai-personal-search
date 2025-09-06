import { Button, Container, Image, Mark, SimpleGrid, Text, Title } from '@mantine/core';
import classes from './error.module.css';

export default function Unauthorized() {
	return (
		<Container className={classes.root}>
			<SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
				<Image alt="" src="/static/images/errors/401.svg" className={classes.mobileImage} />
				<div>
					<Title className={classes.title}>Access dennied...</Title>
					<Text c="dimmed" size="lg">
						You are not authorized to access this page or resource.{' '}
						<Mark>May be your account has been deactivated.</Mark> If you think this is an error
						contact support.
					</Text>
					<Button
						variant="outline"
						size="md"
						mt="xl"
						radius={'xl'}
						className={classes.control}
						component="a"
						href="/"
					>
						Get back to home page
					</Button>
				</div>
				<Image src="/static/images/errors/401.svg" className={classes.desktopImage} alt="" />
			</SimpleGrid>
		</Container>
	);
}
