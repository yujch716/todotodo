import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Calendar, NotebookPen } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Memo } from "@/types/memo";

interface MemoListProps {
  memos: Memo[];
  selectedMemo: Memo | null;
  onMemoSelect: (memo: Memo) => void;
  onCreateMemo: () => void;
  loading: boolean;
}

const MemoList: React.FC<MemoListProps> = ({
  memos,
  selectedMemo,
  onMemoSelect,
  onCreateMemo,
  loading,
}) => {
  const extractTitle = (content: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.slice(0, 50) || "제목 없음";
  };

  if (loading) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <div>로딩 중...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <NotebookPen className="w-5 h-5" />
            Memo
          </span>
          <Button
            onClick={onCreateMemo}
            variant="outline"
            size="icon"
            className="flex items-center gap-1 bg-sky-200 hover:bg-sky-300 text-black"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {memos.map((memo) => (
              <div key={memo.id}>
                <div
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${
                    selectedMemo?.id === memo.id
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-white"
                  }`}
                  onClick={() => onMemoSelect(memo)}
                >
                  <h3 className="font-medium text-sm line-clamp-1 mb-1">
                    {memo.title}
                  </h3>
                  <div className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {extractTitle(memo.content)}
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(memo.updated_at), "MM/dd HH:mm", {
                      locale: ko,
                    })}
                  </div>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
            {memos.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <NotebookPen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>메모가 없습니다.</p>
                <p className="text-sm">새 메모를 만들어보세요!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MemoList;
