import { icons } from "lucide-react";

export const Icon = ({
  name,
  color,
  size,
  className,
}: {
  name: keyof typeof icons;
  color?: string;
  size?: number;
  className?: string;
}) => {
  const aliases: Partial<Record<string, keyof typeof icons>> = {
    LineChart: "ChartLine",
  };

  const resolvedName = aliases[name as string] ?? name;
  const LucideIcon = icons[resolvedName as keyof typeof icons];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon color={color} size={size ?? 20} className={className} />;
};
