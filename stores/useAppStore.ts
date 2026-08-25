import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";
export type DeviceType = "mobile" | "tablet" | "desktop";
export interface UserProfile {
  name: string;
  role: string;
}

interface AppState {
  // --- Theme State ---
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // --- Device Detection State ---
  device: DeviceType;
  isMobile: boolean;
  setDevice: (width: number) => void;

  // --- Sidebar State ---
  isSidebarOpen: boolean;
  isSidebarExpand: boolean;
  toggleSidebar: () => void;
  toggleSidebarExpand: () => void;
  setSidebarOpen: (isOpen: boolean) => void;

  // --- User State ---
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Default Values
      theme: "system",
      device: "desktop",
      isMobile: false,
      isSidebarOpen: false, // Default closed on mobile
      isSidebarExpand: true, // Default expanded on desktop/lg
      currentUser: null,

      // --- Actions: Theme ---
      setTheme: (theme: ThemeMode) => {
        set({ theme });
      },

      // --- Actions: Device Detection ---
      setDevice: (width: number) => {
        // Breakpoints selaras dengan Tailwind CSS (sm: 640px, md: 768px, lg: 1024px)
        let device: DeviceType = "desktop";
        let isMobile = false;

        if (width < 768) {
          device = "mobile";
          isMobile = true;
        } else if (width >= 768 && width < 1024) {
          device = "tablet";
          isMobile = false;
        } else {
          device = "desktop";
          isMobile = false;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const wasMobile = get().isMobile;
        if (width >= 1024 && get().isSidebarOpen) {
          set({ isSidebarOpen: false });
        }

        set({
          device,
          isMobile,
        });
      },

      // --- Actions: Sidebar ---
      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
      toggleSidebarExpand: () => {
        set((state) => ({ isSidebarExpand: !state.isSidebarExpand }));
      },
      setSidebarOpen: (isOpen: boolean) => {
        set({ isSidebarOpen: isOpen });
      },

      // --- ACtions: User ---
      setCurrentUser: (user: UserProfile | null) => {
        set({ currentUser: user });
      },
    }),
    {
      name: "klienka-app-settings", // Key di localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        isSidebarExpand: state.isSidebarExpand,
      }), // Simpan preferensi theme & sidebar expand ke storage
    },
  ),
);
