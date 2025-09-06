import { Box, Button, Image, Text, Title } from '@mantine/core';
import classes from './SystemMessage.module.css';
// import image from '/public/static/images/20945597.jpg';

const DEFAULT_IMAGE = './../../public/static/images/20945597.jpg';
interface SystemMessageProps {
	Thumbnail: string;
	HeadingTitle: string;
	SummaryMessage: string;
	Message: string;
	ButtonText: string;
	ButtonIcon: any;
	ButtonTarget: string;
	TargetBlank?: boolean;
}
export default function SystemMessage({
	Thumbnail,
	HeadingTitle,
	SummaryMessage,
	Message,
	ButtonText,
	ButtonIcon,
	ButtonTarget,
	TargetBlank,
}: SystemMessageProps) {
	return (
		<Box size={'md'}>
			<div className={classes.wrapper} style={{ width: '100%' }}>
				<div className={classes.body}>
					<Title className={classes.title}>{HeadingTitle}</Title>
					<Text fw={500} fz="lg" mb={5}>
						{SummaryMessage}
					</Text>
					<Text fz="sm" c="dimmed">
						{Message}
					</Text>

					<div className={classes.controls}>
						<Button
							component="a"
							href={ButtonTarget}
							radius={'xl'}
							size="md"
							leftSection={ButtonIcon}
							w={'80%'}
							target={TargetBlank ? '_blank' : '_self'}
						>
							{ButtonText}
						</Button>
					</div>
				</div>
				<Image src={Thumbnail || DEFAULT_IMAGE} className={classes.image} alt="" />
			</div>
		</Box>
	);
}
