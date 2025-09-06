import { Container } from '@mantine/core';
import SearchForm from './SearchForm';

export async function generateMetadata() {
	return {
		title: 'Search',
	};
}

export default function AppMIS_Search() {
	return (
		<>
			<Container size={680} m={'auto'} mt={20} mb={20} p={20}>
				<SearchForm />
			</Container>
		</>
	);
}
