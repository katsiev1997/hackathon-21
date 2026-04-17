import type { IdeaStatus } from "./types";

export const ideasQueryKeys = {
  all: ["ideas"] as const,
  list: (status?: IdeaStatus | "all") => [...ideasQueryKeys.all, "list", status ?? "all"] as const,
};

export const ideasMutationKeys = {
  create: [...ideasQueryKeys.all, "create"] as const,
  vote: [...ideasQueryKeys.all, "vote"] as const,
};
