import React, { useState, useEffect } from "react";

interface IconProps {
  name: string; // from backend, e.g. "shopping-bag" or "car"
  size?: number;
  color?: string;
  className?: string;
}

const toPascalCase = (name: string): string =>
  name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = "currentColor",
  className,
}) => {
  const [IconComponent, setIconComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) {
      setLoading(false);
      return;
    }

    const loadIcon = async () => {
      try {
        const icons = await import("lucide-react"); // import all icons once
        const pascalName = toPascalCase(name);
        const LucideIcon = (icons as any)[pascalName];

        if (LucideIcon) {
          setIconComponent(() => LucideIcon);
        } else {
          console.warn(`⚠️ Unknown icon name: ${name}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to load icon: ${name}`, error);
      } finally {
        setLoading(false);
      }
    };

    loadIcon();
  }, [name]);

  if (loading) {
    return (
      <span
        style={{ width: size, height: size }}
        className={`inline-block rounded-full bg-gray-200 animate-pulse ${className ?? ""}`}
      />
    );
  }

  if (!IconComponent) {
    return (
      <span
        style={{ fontSize: size, color }}
        className={`inline-block rounded-full border border-gray-400 p-1 ${className ?? ""}`}
      >
        ?
      </span>
    );
  }

  return <IconComponent size={size} color={color} className={className} />;
};

export default Icon;
