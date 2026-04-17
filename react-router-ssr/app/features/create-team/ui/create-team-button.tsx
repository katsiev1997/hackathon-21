import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { TeamCardData } from "~/entities/team/model/types";
import { useGetProfile } from "~/entities/user";
import { CreateTeamDialog } from "~/features/create-team/ui/create-team-dialog";
import { Button } from "~/shared/components/ui/button";

type CreateTeamButtonProps = {
  onTeamCreated?: (team: TeamCardData) => void;
};

export function CreateTeamButton({ onTeamCreated }: CreateTeamButtonProps) {
  const [open, setOpen] = useState(false);
  const { data } = useGetProfile();
  const { lookingForTeam } = data ?? {};

  const handleClick = () => {
    if (lookingForTeam) {
      () => setOpen(true);
    } else {
      toast.error("У вас уже есть команда");
    }
  };

  return (
    <>
      <Button type="button" size="default" onClick={handleClick}>
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
