import { DashboardPlaceholderPage } from "~/shared/components/dashboard-placeholder-page";

export function meta() {
	return [{ title: "Ideas & Voting — HackForge" }];
}

export default function Ideas() {
	return (
		<DashboardPlaceholderPage
			title="Ideas & Voting"
			description="Publish ideas and vote on community submissions."
		/>
	);
}
