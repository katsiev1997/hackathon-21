import { Button } from "~/shared/components/ui/button";

type TeamCardActionsProps = {
	teamId: string;
};

export function TeamCardActions({ teamId }: TeamCardActionsProps) {
	return (
		<div className="flex items-center gap-2">
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="text-muted-foreground"
				onClick={() => {
					console.log("Message team:", teamId);
				}}
			>
				Message
			</Button>
			<Button
				type="button"
				size="sm"
				onClick={() => {
					console.log("Request invite:", teamId);
				}}
			>
				Request Invite
			</Button>
		</div>
	);
}
