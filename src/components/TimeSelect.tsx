import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

interface TimeSelectProps {
  value: string; // "09:00" 형식
  onValueChange: (value: string) => void;
  disabledTimes?: string[]; // ["09:00", "09:30", "10:00"] 형식
  placeholder?: string;
  isEnd?: boolean;
}

const TimeSelect = ({
  value,
  onValueChange,
  disabledTimes = [],
  isEnd,
}: TimeSelectProps) => {
  const [hour, minute] = value.split(":");

  let hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

  if (isEnd) {
    hours = [...hours, "24"];
  }

  const minutes = ["00", "30"];

  const handleHourChange = (newHour: string) => {
    onValueChange(`${newHour}:${minute}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    onValueChange(`${hour}:${newMinute}`);
  };

  const isTimeDisabled = (h: string, m: string) => {
    return disabledTimes.includes(`${h}:${m}`);
  };

  return (
    <div className="flex gap-2 w-full">
      <Select value={hour} onValueChange={handleHourChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="시" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {hours.map((h) => {
            const isDisabled = minutes.every((m) => isTimeDisabled(h, m));
            return (
              <SelectItem key={h} value={h} disabled={isDisabled}>
                {h}시
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select value={minute} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="분" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((m) => {
            const isDisabled = isTimeDisabled(hour, m);
            return (
              <SelectItem key={m} value={m} disabled={isDisabled}>
                {m}분
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelect;
