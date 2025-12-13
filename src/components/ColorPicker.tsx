import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";

const presetColors = [
  "#fee2e2", // red-100
  "#ffedd5", // orange-100
  "#fef9c3", // yellow-100
  "#dcfce7", // green-100
  "#e0f2fe", // sky-100
  "#dbeafe", // blue-100
  "#ede9fe", // violet-100
  "#fce7f3", // pink-100
  "#f3e8ff", // purple-100
  "#f1f5f9", // slate-100
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
