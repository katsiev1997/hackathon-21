import { DashboardPlaceholderPage } from "~/shared/components/dashboard-placeholder-page";

export function meta() {
	return [{ title: "Kanban Board — HackForge" }];
}

export default function Kanban() {
	return (
		<DashboardPlaceholderPage
			title="Kanban Board"
			description="Track tasks across your team workflow."
		/>
	);
}
