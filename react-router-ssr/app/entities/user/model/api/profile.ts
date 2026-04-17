import { api } from "~/shared/api";

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  skills: string[];
  lookingForTeam: boolean;
  teamId: string;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get("profile/me");
  return response.json<ProfileResponse>();
};
