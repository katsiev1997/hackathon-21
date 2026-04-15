import type { TeamCardData } from "~/entities/team/model/types";

export const MOCK_TEAMS: TeamCardData[] = [
	{
		id: "nexus-ai",
		name: "Nexus AI",
		track: "AI & Machine Learning Track",
		description:
			"Building a real-time collaborative whiteboard with AI-powered sticky note clustering. Looking for creative minds to join our mission of revolutionizing remote brainstorming.",
		openRoles: ["frontend", "designer"],
		techStack: ["React", "Python", "AWS"],
		members: [
			{ id: "m1", name: "Sarah Chen" },
			{ id: "m2", name: "James Wilson" },
		],
		maxMembers: 4,
		isBookmarked: false,
		availability: "Full-time",
	},
	{
		id: "cryptoflow",
		name: "CryptoFlow",
		track: "Web3 & FinTech",
		description:
			"Developing a decentralized micro-lending platform for freelance developers. We need someone who understands both Solidity and React to bridge our smart contracts with the frontend.",
		openRoles: ["frontend", "backend"],
		techStack: ["Solidity", "React", "Ethereum"],
		members: [
			{ id: "m3", name: "Alex Rivera" },
			{ id: "m4", name: "Priya Singh" },
			{ id: "m5", name: "Tom Blake" },
		],
		maxMembers: 5,
		isBookmarked: false,
		availability: "Part-time",
	},
];
