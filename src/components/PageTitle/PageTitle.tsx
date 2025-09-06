import { Flex, Text } from '@mantine/core';
import Link from 'next/link';
import classes from './PageTitle.module.css';

// interface Props {
// 	width?: string;
// 	height?: string;
// }

interface PageTitleProps {
	title: string;
	color?: any;
	href?: string;
}

export const PageTitle = ({ title, color, href }: PageTitleProps) => {
	return (
		<Flex direction="row" align="center" gap={4}>
			<Link href={href ? href : '/'} style={{ textDecoration: 'none' }} className={classes.heading}>
				<Text fw="bolder" size="xl" style={{ color }}>
					{title} {''}
					{/* <Text
						component="span"
						fw="normal"
						className={classes.subheading}
						style={{ color: 'black' }}
					>
						Quiz 🚀
					</Text> */}
				</Text>
			</Link>
		</Flex>
	);
};
