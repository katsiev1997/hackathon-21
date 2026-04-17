import { api } from "~/shared/api";
import type { IdeaStatus } from "../types";
import type { IdeaApiResponse } from "./types";

export type GetIdeasParams = {
  status?: IdeaStatus;
};

export async function getIdeas(params?: GetIdeasParams): Promise<IdeaApiResponse[]> {
  const searchParams = new URLSearchParams();
  if (params?.status) {
    searchParams.set("status", params.status);
  }
  const query = searchParams.toString();
  const response = await api.get(query ? `ideas?${query}` : "ideas");
  return response.json<IdeaApiResponse[]>();
}
