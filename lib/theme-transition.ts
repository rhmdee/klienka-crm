import { useAppStore, type ThemeMode } from "@/stores/useAppStore";
import { flushSync } from "react-dom";

export function toggleThemeWithWave(
  targetTheme: ThemeMode,
  event?: React.MouseEvent | { clientX?: number; clientY?: number }
) {
  const currentTheme = useAppStore.getState().theme;
  if (currentTheme === targetTheme) return;

  const isAppearanceTransition =
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isAppearanceTransition) {
    useAppStore.getState().setTheme(targetTheme);
    return;
  }

  // Ambil titik koordinat klik atau default ke sudut kanan atas
  const x = event?.clientX ?? (typeof window !== "undefined" ? window.innerWidth - 30 : 0);
  const y = event?.clientY ?? 30;

  // Hitung radius terjauh dari titik klik ke sudut layar paling jauh (bawah-kiri)
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = document.startViewTransition(() => {
    // flushSync memaksa React 19 mengupdate DOM secara sinkron sebelum screenshot snapshot diambil
    flushSync(() => {
      useAppStore.getState().setTheme(targetTheme);

      const root = document.documentElement;
      if (targetTheme === "dark") {
        root.classList.add("dark");
      } else if (targetTheme === "light") {
        root.classList.remove("dark");
      } else {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", isSystemDark);
      }
    });
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    // Animasi expanding circular wave pada layer baru (::view-transition-new)
    document.documentElement.animate(
      {
        clipPath: clipPath,
      },
      {
        duration: 700,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
}
