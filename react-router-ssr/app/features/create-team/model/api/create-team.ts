import { api } from "~/shared/api";
import type { CreateTeamApiRequest, TeamApiResponse } from "../types";

export const createTeam = async (
	request: CreateTeamApiRequest,
): Promise<TeamApiResponse> => {
	const response = await api.post("teams", { json: request });
	return response.json<TeamApiResponse>();
};
