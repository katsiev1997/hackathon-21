import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { createTeam } from "../api/create-team";
import { teamsMutationKeys } from "../query-keys";
import type { CreateTeamApiRequest, TeamApiResponse } from "../types";

type CreateTeamMutationOptions = Omit<
	UseMutationOptions<TeamApiResponse, Error, CreateTeamApiRequest>,
	"mutationFn" | "mutationKey"
>;

export function useCreateTeamMutation(options?: CreateTeamMutationOptions) {
	return useMutation({
		mutationKey: teamsMutationKeys.create,
		mutationFn: createTeam,
		...options,
	});
}
