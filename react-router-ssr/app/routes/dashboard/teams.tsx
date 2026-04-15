import { DashboardPlaceholderPage } from "~/shared/components/dashboard-placeholder-page";

export function meta() {
	return [{ title: "Teams Dashboard — HackForge" }];
}

export default function Teams() {
	return (
		<DashboardPlaceholderPage
			title="Teams Dashboard"
			description="Manage your teams and invitations."
		/>
	);
}
