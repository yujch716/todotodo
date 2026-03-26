import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { getMemos, createMemo, updateMemo, deleteMemo } from "@/api/memo.ts";
import type { Memo } from "@/types/memo";
import MemoList from "@/pages/memo/MemoList.tsx";
import MemoDetail from "@/pages/memo/MemoDetail.tsx";

const MemoPage = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMemos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMemos();
      setMemos(data);
    } catch (error) {
      console.error("메모 목록 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateMemo = async () => {
    try {
      const title = `새 메모`;
      const content = "<p></p>";

      const newMemo = await createMemo(title, content);

      if (newMemo) {
        setMemos((prev) => [newMemo, ...prev]);
        setSelectedMemo(newMemo);
      }
    } catch (error) {
      console.error("메모 생성 실패:", error);
    }
  };

  const updateMemoHandler = async (
    memoId: string,
    title: string,
    content: string,
  ) => {
    try {
      await updateMemo(memoId, title, content);

      const updatedAt = new Date().toISOString();
      setMemos((prev) =>
        prev.map((memo) =>
          memo.id === memoId
            ? { ...memo, content, title, updated_at: updatedAt }
            : memo,
        ),
      );

      if (selectedMemo?.id === memoId) {
        setSelectedMemo((prev) =>
          prev
            ? {
                ...prev,
                content,
                title,
                updated_at: updatedAt,
              }
            : null,
        );
      }
    } catch (error) {
      console.error("메모 업데이트 실패:", error);
    }
  };

  const handleMemoDelete = async (memoId: string) => {
    try {
      await deleteMemo(memoId);

      setMemos((prev) => prev.filter((memo) => memo.id !== memoId));

      if (selectedMemo?.id === memoId) {
        setSelectedMemo(null);
      }
    } catch (error) {
      console.error("메모 삭제 실패:", error);
    }
  };

  const debouncedUpdateMemoHandler = useCallback(
    debounce((memoId: string, title: string, content: string) => {
      updateMemoHandler(memoId, title, content);
    }, 1000),
    [],
  );

  const handleMemoSelect = (memo: Memo) => {
    setSelectedMemo(memo);
  };

  const handleMemoUpdate = (memoId: string, title: string, content: string) => {
    setSelectedMemo((prev) => (prev ? { ...prev, title, content } : null));
    debouncedUpdateMemoHandler(memoId, title, content);
  };

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <MemoList
        memos={memos}
        selectedMemo={selectedMemo}
        onMemoSelect={handleMemoSelect}
        onCreateMemo={handleCreateMemo}
        loading={loading}
      />
      <MemoDetail
        selectedMemo={selectedMemo}
        onMemoUpdate={handleMemoUpdate}
        onMemoDelete={handleMemoDelete}
      />
    </div>
  );
};

export default MemoPage;
