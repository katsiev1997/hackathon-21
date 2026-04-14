import { CircleHelp } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { EMPTY_FILTERS, TeamFilterBar } from "@/features/team-filter";
import type { TeamBoardFilters } from "@/features/team-filter/model/types";
import { useCallback, useMemo, useState } from "preact/hooks";
import { filterTeams } from "@/widgets/team-board/lib/filter-teams";
import { MOCK_TEAMS } from "@/widgets/team-board/lib/mock-teams";
import { TeamBoardHeader } from "@/widgets/team-board/ui/team-board-header";
import { TeamGrid } from "@/widgets/team-board/ui/team-grid";
import type { TeamCardData } from "@/entities/team/model/types";

export function TeamBoard() {
  const [filters, setFilters] = useState<TeamBoardFilters>(EMPTY_FILTERS);
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<TeamCardData[]>(MOCK_TEAMS);

  const handleSearchQueryChange = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const visible = useMemo(() => filterTeams(teams, filters, query), [teams, filters, query]);

  const toggleBookmark = useCallback((teamId: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, isBookmarked: !t.isBookmarked } : t)),
    );
  }, []);

  return (
    <div className="relative flex flex-1 flex-col gap-6 px-4 py-6 md:px-8">
      <TeamBoardHeader onSearchQueryChange={handleSearchQueryChange} />
      <TeamFilterBar filters={filters} onChange={setFilters} />
      <TeamGrid teams={visible} onBookmarkToggle={toggleBookmark} />
      {visible.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No teams match your filters. Try clearing filters or search.
        </p>
      )}
      <Button
        type="button"
        size="icon"
        className="fixed right-4 bottom-4 size-10 rounded-full shadow-md"
        aria-label="Help"
      >
        <CircleHelp />
      </Button>
    </div>
  );
}
