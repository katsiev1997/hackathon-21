import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ROLE_LABELS } from "~/entities/team/lib/role-labels";
import type { TeamRole } from "~/entities/team/model/types";
import { useGetProfile } from "~/entities/user";
import { useParticipantsQuery } from "~/features/participants/model/queries/use-participants-query";
import type { Participant } from "~/features/participants/model/types";
import { useInviteUserToTeamMutation } from "~/features/team-invite/model/mutations/use-invite-user-to-team-mutation";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { getApiErrorMessage } from "~/shared/lib/get-api-error-message";

function hasTeamId(teamId: string | null | undefined): boolean {
  return Boolean(teamId?.trim());
}

function roleLabel(role: string): string {
  const r = role as TeamRole;
  return ROLE_LABELS[r] ?? role;
}

function ParticipantRow({
  participant,
  currentUserId,
  myTeamId,
  canInvite,
  inviting,
  onInvite,
}: {
  participant: Participant;
  currentUserId: string | undefined;
  myTeamId: string | undefined;
  canInvite: boolean;
  inviting: boolean;
  onInvite: (p: Participant) => void;
}) {
  const isSelf = participant.id === currentUserId;
  const canInviteThis = canInvite && !isSelf && myTeamId && participant.id !== currentUserId;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-base">{participant.name}</CardTitle>
          <CardDescription className="text-xs">
            {roleLabel(participant.role)}
            {participant.lookingForTeam ? " · Looking for a team" : null}
          </CardDescription>
        </div>
        {canInviteThis ? (
          <Button type="button" size="sm" disabled={inviting} onClick={() => onInvite(participant)}>
            {inviting ? <Loader2Icon className="size-4 animate-spin" aria-hidden /> : null}
            Invite
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">
          {participant.skills?.length ? participant.skills.join(" · ") : "No skills listed"}
        </p>
      </CardContent>
    </Card>
  );
}

export function ParticipantsBoard() {
  const { data: profile } = useGetProfile();
  const { data: participants = [], isPending, isError, error, refetch } = useParticipantsQuery();
  const inviteMutation = useInviteUserToTeamMutation();
  const [invitingId, setInvitingId] = useState<string | null>(null);

  const myTeamId = profile?.teamId;
  const canInvite = hasTeamId(myTeamId);

  const handleInvite = async (participant: Participant) => {
    if (!myTeamId) return;
    setInvitingId(participant.id);
    try {
      await inviteMutation.mutateAsync({
        teamId: myTeamId,
        inviteeUserId: participant.id,
      });
      toast.success("Invitation sent.");
    } catch (err) {
      toast.error(await getApiErrorMessage(err));
    } finally {
      setInvitingId(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Participants</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          People looking for a team. If you are already in a team, use Invite to send them an
          invitation from your account (captain or teammate — per backend rules).
        </p>
      </div>

      {isPending ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" aria-hidden />
          <span className="text-sm">Loading…</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load list."}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : participants.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">No participants found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {participants.map((p) => (
            <ParticipantRow
              key={p.id}
              participant={p}
              currentUserId={profile?.id}
              myTeamId={myTeamId}
              canInvite={canInvite}
              inviting={invitingId === p.id}
              onInvite={handleInvite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
