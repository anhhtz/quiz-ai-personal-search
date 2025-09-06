import {
	Anchor,
	Breadcrumbs,
	Container,
	ContainerProps,
	Group,
	Space,
	Stack,
	Title,
} from '@mantine/core';
import { FC, ReactNode } from 'react';

type PageContainerProps = {
	children: ReactNode;
	title: string;
	description?: string;
	breadcrumbs?: { label: string; href: string }[];
	rightSection?: ReactNode;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	mt?: number;
} & Pick<ContainerProps, 'fluid'>;

export const PageContainer: FC<PageContainerProps> = ({
	children,
	title,
	description,
	breadcrumbs,
	fluid = false,
	rightSection,
	size = 'xl',
	mt = 30,
}) => {
	return (
		<Container px={0} fluid={fluid} size={size} mt={mt}>
			{breadcrumbs && breadcrumbs.length > 0 ? (
				<Breadcrumbs>
					{breadcrumbs.map(item => (
						<Anchor key={item.label} href={item.href}>
							{item.label}
						</Anchor>
					))}
				</Breadcrumbs>
			) : null}

			<Group justify="space-between">
				<Stack gap={'xs'}>
					<Title order={1} mt={8}>
						{title}
					</Title>
					<Title
						order={5}
						style={{ color: 'var(--mantine-color-gray-7)', fontWeight: 'none' }}
						mt={6}
					>
						{description}
					</Title>
				</Stack>
				{rightSection}
			</Group>

			<Space h="lg" />

			{children}
		</Container>
	);
};
