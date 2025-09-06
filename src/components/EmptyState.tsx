import { Container } from '@mantine/core';
import { Text } from '@mantine/core';
import classes from './EmptyState.module.css';

interface Props {
	icon: any;
	// title: string;
	description: string;
	color?: string;
}
export default function EmptyState({ icon, description, color }: Props) {
	return (
		<Container className={classes.inner}>
			<div className={classes.logo} style={{ color }}>
				{icon}
				<Text size="sm" className={classes.description} style={{ color: `${color} !important` }}>
					{description}
				</Text>
			</div>
		</Container>
	);
}
