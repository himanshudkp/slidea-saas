import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Page = "create" | "creative-ai" | "create-from-scratch";

type PromptStore = {
  page: Page;
  setPage: (page: Page) => void;
};

export const usePromptStore = create<PromptStore>()(
  devtools(
    persist<PromptStore>(
      (set) => ({
        page: "create",
        setPage: (page) => set({ page }),
      }),
      { name: "prompt-store" }
    )
  )
);
