import { create } from 'zustand';
import type { Issue } from '@/types';

interface IssueState {
  issues: Issue[];
  isLoading: boolean;
  setIssues: (issues: Issue[]) => void;
  addIssue: (issue: Issue) => void;
  updateIssueStatus: (id: string, status: Issue['status']) => void;
}

export const useIssueStore = create<IssueState>((set) => ({
  issues: [],
  isLoading: false,
  setIssues: (issues) => set({ issues }),
  addIssue: (issue) => set((state) => ({ issues: [issue, ...state.issues] })),
  updateIssueStatus: (id, status) =>
    set((state) => ({
      issues: state.issues.map((i) => (i.id === id ? { ...i, status } : i)),
    })),
}));
