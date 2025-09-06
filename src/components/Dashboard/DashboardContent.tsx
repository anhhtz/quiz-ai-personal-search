'use client';

import { Flex, Grid, GridCol } from '@mantine/core';
import { WelcomeCard } from './WelcomeCard';

export function DashboardContent() {
	return (
		<Grid>
			{/* <GridCol span={{ sm: 12, md: 12, lg: 4 }}>
				<ProfileCard />
			</GridCol> */}
			<GridCol span={{ sm: 12, md: 12, lg: 12 }}>
				<Flex direction="column" h="100%" justify="space-between" gap="md">
					<WelcomeCard />
					{/* <StatsGroup data={mockData} /> */}
				</Flex>
			</GridCol>

			{/* <GridCol span={{ sm: 12, md: 12, lg: 8 }}>
				<BalanceCard />
			</GridCol>
			<GridCol span={{ sm: 12, md: 12, lg: 4 }}>
				<OverviewCard />
			</GridCol>
			<GridCol span={12}>
				<TransactionCard />
			</GridCol> */}
		</Grid>
	);
}
