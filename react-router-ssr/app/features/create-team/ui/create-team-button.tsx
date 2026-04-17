import { Plus } from "lucide-react";
import { useState } from "react";
import type { TeamCardData } from "~/entities/team/model/types";
import { CreateTeamDialog } from "~/features/create-team/ui/create-team-dialog";
import { Button } from "~/shared/components/ui/button";

type CreateTeamButtonProps = {
	onTeamCreated?: (team: TeamCardData) => void;
};

export function CreateTeamButton({ onTeamCreated }: CreateTeamButtonProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button type="button" size="default" onClick={() => setOpen(true)}>
				<Plus data-icon="inline-start" />
				Create Team
			</Button>
			<CreateTeamDialog
				open={open}
				onOpenChange={setOpen}
				onTeamCreated={onTeamCreated}
			/>
		</>
	);
}
