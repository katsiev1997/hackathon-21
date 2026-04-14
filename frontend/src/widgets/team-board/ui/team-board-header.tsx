import { Bell } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { CreateTeamButton } from "@/features/create-team/ui/create-team-button";
import { TeamSearchInput } from "@/features/team-search/ui/team-search-input";

type TeamBoardHeaderProps = {
  onSearchQueryChange: (query: string) => void;
};

export function TeamBoardHeader({ onSearchQueryChange }: TeamBoardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/80 pb-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Find Team Board</h1>
            <p className="text-sm text-muted-foreground">
              Discover and join teams matching your skills and interests.
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:max-w-xl">
        <TeamSearchInput onQueryChange={onSearchQueryChange} className="w-full sm:max-w-xs" />
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Notifications">
            <Bell />
          </Button>
          <CreateTeamButton />
        </div>
      </div>
    </div>
  );
}
