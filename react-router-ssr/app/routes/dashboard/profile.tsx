import { DashboardPlaceholderPage } from "~/shared/components/dashboard-placeholder-page";

export function meta() {
	return [{ title: "User Profile — HackForge" }];
}

export default function Profile() {
	return (
		<DashboardPlaceholderPage
			title="User Profile"
			description="Your profile, skills, and team preferences."
		/>
	);
}
