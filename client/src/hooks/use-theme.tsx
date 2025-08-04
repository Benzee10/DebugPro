import { useTheme as useThemeContext } from "@/components/ui/theme-provider";

export const useTheme = () => {
  return useThemeContext();
};
