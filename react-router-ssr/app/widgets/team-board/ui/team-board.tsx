import { CircleHelp, Loader2Icon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTeamsQuery } from "~/entities/team/model/queries/use-teams";
import { EMPTY_FILTERS, TeamFilterBar } from "~/features/team-filter";
import type { TeamBoardFilters } from "~/features/team-filter/model/types";
import { Button } from "~/shared/components/ui/button";
import { filterTeams } from "~/widgets/team-board/lib/filter-teams";
import { TeamBoardHeader } from "~/widgets/team-board/ui/team-board-header";
import { TeamGrid } from "~/widgets/team-board/ui/team-grid";

export function TeamBoard() {
  const [filters, setFilters] = useState<TeamBoardFilters>(EMPTY_FILTERS);
  const [query, setQuery] = useState("");
  const [bookmarkOverrides, setBookmarkOverrides] = useState<Record<string, boolean>>({});

  const { data: teamsFromApi = [], isPending, isError, error, refetch } = useTeamsQuery();

  const teams = useMemo(
    () =>
      teamsFromApi.map((t) => ({
        ...t,
        isBookmarked: bookmarkOverrides[t.id] ?? t.isBookmarked,
      })),
    [teamsFromApi, bookmarkOverrides],
  );

  const handleSearchQueryChange = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const visible = useMemo(() => filterTeams(teams, filters, query), [teams, filters, query]);

  const toggleBookmark = useCallback(
    (teamId: string) => {
      setBookmarkOverrides((prev) => {
        const base = prev[teamId] ?? teamsFromApi.find((t) => t.id === teamId)?.isBookmarked;
        const current = base ?? false;
        return { ...prev, [teamId]: !current };
      });
    },
    [teamsFromApi],
  );

  return (
    <div className="relative flex flex-1 flex-col gap-6 px-4 py-6 md:px-8">
      <TeamBoardHeader onSearchQueryChange={handleSearchQueryChange} />
      <TeamFilterBar filters={filters} onChange={setFilters} />
      {isPending ? (
        <div className="flex flex-1 items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" aria-hidden />
          <span className="text-sm">Loading teams…</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load teams."}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <TeamGrid teams={visible} onBookmarkToggle={toggleBookmark} />
          {visible.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No teams match your filters. Try clearing filters or search.
            </p>
          )}
        </>
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
