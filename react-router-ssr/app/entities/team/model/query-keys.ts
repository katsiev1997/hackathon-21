export const teamsQueryKeys = {
  all: ["teams"] as const,
  list: () => [...teamsQueryKeys.all, "list"] as const,
};

export const teamsMutationKeys = {
  create: [...teamsQueryKeys.all, "create"] as const,
  invite: [...teamsQueryKeys.all, "invite"] as const,
};
