/** Ключи списка команд (инвалидация при появлении useTeamsQuery и т.п.). */
export const teamsQueryKeys = {
	all: ["teams"] as const,
	list: () => [...teamsQueryKeys.all, "list"] as const,
};

export const teamsMutationKeys = {
	create: [...teamsQueryKeys.all, "create"] as const,
};
