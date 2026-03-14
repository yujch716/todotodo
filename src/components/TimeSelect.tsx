import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

interface TimeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabledTimes?: string[];
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
  const END_TIME_MAX_HOUR_STRING = "28";

  let hours = Array.from({ length: 24 }, (_, i) => {
    const hourValue = (4 + i) % 24;
    return String(hourValue).padStart(2, "0");
  });

  if (isEnd) {
    hours = [...hours, END_TIME_MAX_HOUR_STRING];
  }

  const minutes = ["00", "10", "20", "30", "40", "50"];

  const handleHourChange = (newHour: string) => {
    if (newHour === END_TIME_MAX_HOUR_STRING) {
      onValueChange(`${END_TIME_MAX_HOUR_STRING}:00`);
    } else {
      onValueChange(`${newHour}:${minute}`);
    }
  };

  const handleMinuteChange = (newMinute: string) => {
    onValueChange(`${hour}:${newMinute}`);
  };

  const isTimeDisabled = (h: string, m: string) => {
    return disabledTimes.includes(`${h}:${m}`);
  };

  const getHourLabel = (h: string) => {
    const n = parseInt(h);
    if (n >= 24) return `${String(n - 24).padStart(2, "0")}시`;
    return `${h}시`;
  };

  const isNextDay = (h: string) => {
    const n = parseInt(h);
    return (n >= 0 && n <= 3) || n >= 24;
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
                {getHourLabel(h)}
                {isNextDay(h) && (
                  <span className="text-xs text-muted-foreground ml-1">
                    (다음날)
                  </span>
                )}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select
        value={minute}
        onValueChange={handleMinuteChange}
        disabled={hour === END_TIME_MAX_HOUR_STRING}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="분" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((m) => (
            <SelectItem key={m} value={m} disabled={isTimeDisabled(hour, m)}>
              {m}분
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelect;
