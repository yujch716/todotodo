import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";

const presetColors = [
  "#fecaca", // red-200
  "#fed7aa", // orange-200
  "#fef08a", // yellow-200
  "#bbf7d0", // green-200
  "#a5f3fc", // sky-200
  "#bfdbfe", // blue-200
  "#ddd6fe", // violet-200
  "#fbcfe8", // pink-200
  "#e9d5ff", // purple-200
  "#e2e8f0", // slate-200
];

const ColorPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => {
  const selectedColor = presetColors.includes(value) ? value : presetColors[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="w-6 h-6 rounded-full aspect-square p-0"
          style={{ backgroundColor: selectedColor }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex flex-col gap-2">
          {[0, 1].map((row) => (
            <div key={row} className="flex items-center gap-2">
              {presetColors.slice(row * 5, row * 5 + 5).map((c) => (
                <Button
                  key={c}
                  onClick={() => onChange(c)}
                  className={`w-6 h-6 rounded-full aspect-square p-0 ${
                    selectedColor === c
                      ? "ring-2 ring-offset-2 ring-black"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
