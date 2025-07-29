import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";

const presetColors = [
  "#fca5a5",
  "#fdba74",
  "#fde047",
  "#86efac",
  "#67e8f9",
  "#93c5fd",
  "#c4b5fd",
  "#f9a8d4",
  "#d8b4fe",
  "#cbd5e1",
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
