import type { LucideIcon } from "lucide-react";
import {
  Rocket,
  Plane,
  Globe,
  Telescope,
  Orbit,
  Satellite,
  Moon,
  Leaf,
  Wind,
  Zap,
} from "lucide-react";

export const PROGRAMS = [
  "Apollo",
  "Space Shuttle",
  "Mars Exploration",
  "Space Telescopes",
  "Deep Space",
  "Space Station",
  "Artemis",
  "Earth Science",
  "Aeronautics",
  "Propulsion & Technology",
] as const;

interface ProgramConfig {
  icon: LucideIcon;
  badge: string;
  border: string;
  text: string;
}

const CONFIG: Record<string, ProgramConfig> = {
  Apollo: {
    icon: Rocket,
    badge: "bg-program-apollo/15 text-program-apollo",
    border: "border-l-program-apollo",
    text: "text-program-apollo",
  },
  "Space Shuttle": {
    icon: Plane,
    badge: "bg-program-shuttle/15 text-program-shuttle",
    border: "border-l-program-shuttle",
    text: "text-program-shuttle",
  },
  "Mars Exploration": {
    icon: Globe,
    badge: "bg-program-mars/15 text-program-mars",
    border: "border-l-program-mars",
    text: "text-program-mars",
  },
  "Space Telescopes": {
    icon: Telescope,
    badge: "bg-program-telescopes/15 text-program-telescopes",
    border: "border-l-program-telescopes",
    text: "text-program-telescopes",
  },
  "Deep Space": {
    icon: Orbit,
    badge: "bg-program-deep-space/15 text-program-deep-space",
    border: "border-l-program-deep-space",
    text: "text-program-deep-space",
  },
  "Space Station": {
    icon: Satellite,
    badge: "bg-program-station/15 text-program-station",
    border: "border-l-program-station",
    text: "text-program-station",
  },
  Artemis: {
    icon: Moon,
    badge: "bg-program-artemis/15 text-program-artemis",
    border: "border-l-program-artemis",
    text: "text-program-artemis",
  },
  "Earth Science": {
    icon: Leaf,
    badge: "bg-program-earth/15 text-program-earth",
    border: "border-l-program-earth",
    text: "text-program-earth",
  },
  Aeronautics: {
    icon: Wind,
    badge: "bg-program-aeronautics/15 text-program-aeronautics",
    border: "border-l-program-aeronautics",
    text: "text-program-aeronautics",
  },
  "Propulsion & Technology": {
    icon: Zap,
    badge: "bg-program-propulsion/15 text-program-propulsion",
    border: "border-l-program-propulsion",
    text: "text-program-propulsion",
  },
};

const DEFAULT: ProgramConfig = {
  icon: Globe,
  badge: "bg-gray-100 text-gray-600",
  border: "border-l-gray-300",
  text: "text-gray-600",
};

export function getProgramConfig(program: string): ProgramConfig {
  return CONFIG[program] ?? DEFAULT;
}

export function getProgramBadgeStyle(program: string): string {
  return (CONFIG[program] ?? DEFAULT).badge;
}
