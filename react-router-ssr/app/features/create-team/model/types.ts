import type { TeamRole } from "~/entities/team/model/types";

/** Тело POST /api/teams (CreateTeamRequest на бэкенде). */
export interface CreateTeamApiRequest {
	name: string;
	description: string;
}

export interface TeamMemberApiResponse {
	id: string;
	name: string;
	role: string | null;
	skills: string[];
}

export interface TeamApiResponse {
	id: string;
	name: string;
	description: string | null;
	captainId: string;
	members: TeamMemberApiResponse[];
	createdAt: string;
}

/** Поля формы; track и openRoles пока не отправляются в API, только в UI после создания. */
export interface CreateTeamFormValues {
	name: string;
	description: string;
	track: string;
	openRoles: TeamRole[];
}
