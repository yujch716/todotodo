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
  disabledTimes?: string[]; // ["09:00", "09:10", "10:00"] 형식
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

  // 04시부터 시작하여 다음날 04시까지 (04, 05, 06, ..., 23, 00, 01, 02, 03)
  let hours = Array.from({ length: 24 }, (_, i) => {
    const hourValue = (4 + i) % 24;
    return String(hourValue).padStart(2, "0");
  });

  if (isEnd) {
    hours = [...hours, "24"];
  }

  const minutes = ["00", "10", "20", "30", "40", "50"];

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
            const hourNum = parseInt(h);
            const isNextDay = hourNum >= 0 && hourNum <= 3;
            
            return (
              <SelectItem key={h} value={h} disabled={isDisabled}>
                {h}시
                {isNextDay && (
                  <span className="text-xs text-muted-foreground ml-1">(다음날)</span>
                )}
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