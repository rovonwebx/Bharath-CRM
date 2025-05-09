
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Computer, Moon, Sun } from "lucide-react";

type AppearanceOption = "light" | "dark" | "system";

interface AppearanceToggleProps {
  appearance: AppearanceOption;
  onAppearanceChange: (value: AppearanceOption) => void;
}

const AppearanceToggle: React.FC<AppearanceToggleProps> = ({
  appearance,
  onAppearanceChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-medium">Appearance</Label>
      </div>
      <RadioGroup
        defaultValue={appearance}
        onValueChange={(value) => onAppearanceChange(value as AppearanceOption)}
        className="grid grid-cols-3 gap-4"
      >
        <div>
          <RadioGroupItem
            value="light"
            id="light"
            className="peer sr-only"
          />
          <Label
            htmlFor="light"
            className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-card p-5 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:glow-effect transition-all duration-300"
          >
            <Sun className="mb-3 h-7 w-7" />
            <span className="font-medium">Light</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="dark"
            id="dark"
            className="peer sr-only"
          />
          <Label
            htmlFor="dark"
            className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-card p-5 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:glow-effect transition-all duration-300"
          >
            <Moon className="mb-3 h-7 w-7" />
            <span className="font-medium">Dark</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="system"
            id="system"
            className="peer sr-only"
          />
          <Label
            htmlFor="system"
            className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-card p-5 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:glow-effect transition-all duration-300"
          >
            <Computer className="mb-3 h-7 w-7" />
            <span className="font-medium">System</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AppearanceToggle;
