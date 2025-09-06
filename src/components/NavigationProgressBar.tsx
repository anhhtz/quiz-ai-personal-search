"use client";
import {
	completeNavigationProgress,
	NavigationProgress,
	startNavigationProgress,
} from "@mantine/nprogress";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function NavigationProgressBar() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		startNavigationProgress();

		// Complete the progress after a short delay to show the animation
		const timer = setTimeout(() => {
			completeNavigationProgress();
		}, 100);

		return () => clearTimeout(timer);
	}, [pathname, searchParams]);

	return <NavigationProgress color="gray" />;
}
