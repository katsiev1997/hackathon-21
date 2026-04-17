import type { TeamCardData, TeamRole } from "~/entities/team/model/types";
import type { TeamApiResponse } from "./types";

const DEFAULT_MAX_MEMBERS = 5;

/** Собирает карточку доски из ответа API и полей формы (track / open roles). */
export function mapTeamApiResponseToCardData(
	response: TeamApiResponse,
	extras: { track: string; openRoles: TeamRole[] },
): TeamCardData {
	return {
		id: response.id,
		name: response.name,
		description: response.description ?? "",
		track: extras.track,
		openRoles: extras.openRoles,
		techStack: [],
		members: response.members.map((m) => ({
			id: m.id,
			name: m.name,
		})),
		maxMembers: DEFAULT_MAX_MEMBERS,
		isBookmarked: false,
	};
}
