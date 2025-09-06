import { LandingContainer } from "@/components/Landing/LandingContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
	title:
		"Home page",
	description: `Home page`,
};
export default function Page() {
	return (
		<LandingContainer>
			<></>
		</LandingContainer>
	);
}
