import { TeamCard } from "@/entities/team";
import type { TeamCardData } from "@/entities/team/model/types";
import { TeamCardActions } from "@/features/team-invite/ui/team-card-actions";
import type { ComponentChildren } from "preact";

type TeamGridProps = {
  teams: TeamCardData[];
  renderActions?: (team: TeamCardData) => ComponentChildren;
  onBookmarkToggle?: (teamId: string) => void;
};

export function TeamGrid({
  teams,
  renderActions,
  onBookmarkToggle,
}: TeamGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onBookmarkToggle={onBookmarkToggle}
          actions={
            renderActions ? (
              renderActions(team)
            ) : (
              <TeamCardActions teamId={team.id} />
            )
          }
        />
      ))}
    </div>
  );
}
