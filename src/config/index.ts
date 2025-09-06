import { NavItem } from '@/types/nav-item';
import { IconClockPlay, IconDashboard, IconMessage2Question, IconUserCircle } from '@tabler/icons-react';

export const navLinks: NavItem[] = [
	{ label: 'Dashboard', icon: IconDashboard, link: '/dashboard' },
	{ label: 'Feedbacks', icon: IconMessage2Question, link: '/dashboard/feedbacks' },
	{
		label: 'Profile', icon: IconUserCircle,
		links: [
			{
				label: 'Profile',
				link: '/dashboard/profile'
			},
			{
				label: 'Social accounts',
				link: '/dashboard/profile/link'
			}
		]
	},
	{
		label: 'Activities',
		icon: IconClockPlay,
		links: [
			{
				label: 'All activities',
				link: '/dashboard/activities',
			},
			{
				label: 'Quizzes History',
				link: '/dashboard/activities/quizzes/history',
			},
		],
	},
	// {
	// 	label: 'Auth',
	// 	icon: IconLock,
	// 	initiallyOpened: true,
	// 	links: [
	// 		{
	// 			label: 'Login',
	// 			link: '/login',
	// 		},
	// 		{
	// 			label: 'Register',
	// 			link: '/register',
	// 		},
	// 	],
	// },
	// { label: 'Settings', icon: IconSettings, link: '/dashboard/settings' },
];
