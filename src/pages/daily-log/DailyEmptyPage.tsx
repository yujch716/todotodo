import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import { BookX } from "lucide-react";
import CreateDailyLogModal from "@/pages/daily-log/CreateDailyLogModal.tsx";

interface DailyEmptyPageProps {
  date?: Date;
}

const DailyEmptyPage = ({ date }: DailyEmptyPageProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookX />
        </EmptyMedia>
        <EmptyTitle>기록이 없습니다</EmptyTitle>
        <EmptyDescription>
          이 날짜에 작성된 기록이 없어요.
          <br />
          오늘의 하루를 기록해보세요.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <CreateDailyLogModal defaultDate={date} />
        </div>
      </EmptyContent>
    </Empty>
  );
};
export default DailyEmptyPage;
