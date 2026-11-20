import { create } from "zustand";
import { DiningMember } from "@/types/profile";

interface GroupState {
  members: DiningMember[];
  addMember: (member: Omit<DiningMember, "id" | "avatarColor">) => void;
  removeMember: (id: string) => void;
  resetGroup: () => void;
}

const DEFAULT_MEMBERS: DiningMember[] = [
  {
    id: "member-1",
    name: "You",
    diet: "pure_veg",
    allergies: [],
    goal: "fat_loss",
    avatarColor: "#1F8A4C",
  },
  {
    id: "member-2",
    name: "Priya",
    diet: "jain",
    allergies: ["dairy"],
    goal: "clean_eating",
    avatarColor: "#D97706",
  },
  {
    id: "member-3",
    name: "Karan",
    diet: "non_veg",
    allergies: ["gluten"],
    goal: "muscle_gain",
    avatarColor: "#2563EB",
  },
];

const AVATAR_COLORS = ["#1F8A4C", "#D97706", "#2563EB", "#9333EA", "#DC2626", "#0D9488"];

export const useGroupStore = create<GroupState>((set) => ({
  members: DEFAULT_MEMBERS,
  addMember: (memberData) => {
    const id = `member-${Date.now()}`;
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    set((state) => ({
      members: [...state.members, { ...memberData, id, avatarColor }],
    }));
  },
  removeMember: (id) => {
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
    }));
  },
  resetGroup: () => set({ members: DEFAULT_MEMBERS }),
}));
