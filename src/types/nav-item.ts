import { TablerIconsProps } from '@tabler/icons-react';
import { JSX } from 'react';

export interface NavItem {
	label: string;
	icon: (props: TablerIconsProps) => JSX.Element;
	link?: string;
	initiallyOpened?: boolean;
	links?: { label: string; link: string }[];
}
