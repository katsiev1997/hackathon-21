import { ParticipantsPage } from "~/pages/participants-page";

export function meta() {
  return [
    { title: "Participants — HackForge" },
    {
      name: "description",
      content: "People looking for a team — send invitations from your team",
    },
  ];
}

export default function Participants() {
  return <ParticipantsPage />;
}
