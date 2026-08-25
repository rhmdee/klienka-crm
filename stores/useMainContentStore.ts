import { create } from "zustand";
import type { ContentTopState } from "@/types/main-content-types";

export const useContentTopStore = create<ContentTopState>((set) => ({
  title: null,
  breadcrumbs: null,
  actions: null,
  extraContent: null,
  noPadding: null,
  padding: null,
  setContentTop: (data) =>
    set((state) => ({
      title: data.title !== undefined ? data.title : state.title,
      breadcrumbs:
        data.breadcrumbs !== undefined ? data.breadcrumbs : state.breadcrumbs,
      actions: data.actions !== undefined ? data.actions : state.actions,
      extraContent:
        data.extraContent !== undefined
          ? data.extraContent
          : state.extraContent,
      noPadding:
        data.noPadding !== undefined ? data.noPadding : state.noPadding,
      padding: data.padding !== undefined ? data.padding : state.padding,
    })),
  resetContentTop: () =>
    set({
      title: null,
      breadcrumbs: null,
      actions: null,
      extraContent: null,
      noPadding: null,
      padding: null,
    }),
}));
