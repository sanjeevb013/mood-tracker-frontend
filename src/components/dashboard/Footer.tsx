import { useTheme } from "next-themes";

export default function Footer() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
  return (
    <footer
      className={`w-full py-4 text-center z-50 border-t ${
        isDark
          ? 'bg-[var(--background)] text-white border-gray-700'
          : 'bg-white text-black border-gray-200'
      }`}
    >
      © {new Date().getFullYear()} My Dashboard. All rights reserved.
    </footer>
  );
}

