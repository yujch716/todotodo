import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Bell, BellOff, Smartphone, TriangleAlert } from "lucide-react";
import {
  getCurrentSubscription,
  isIos,
  isPushSupported,
  isStandalone,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push.ts";
import {
  deletePushSubscriptionByEndpoint,
  upsertPushSubscription,
} from "@/api/push-subscription.ts";
import { toast } from "sonner";

const NotificationPanel = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supported = isPushSupported();
  // iOS 는 홈 화면에 설치해야만 푸시 구독이 가능하다
  const needsInstall = isIos() && !isStandalone();
  const isDenied = supported && Notification.permission === "denied";

  const loadSubscription = useCallback(async () => {
    if (!supported) {
      setIsLoading(false);
      return;
    }

    const subscription = await getCurrentSubscription();
    setIsSubscribed(!!subscription);
    setIsLoading(false);
  }, [supported]);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const handleSubscribe = async () => {
    setIsSubmitting(true);

    try {
      // iOS Safari 는 반드시 사용자 제스처 안에서 호출해야 한다
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast.error("알림 권한이 허용되지 않았습니다.");
        return;
      }

      const subscription = await subscribeToPush();
      await upsertPushSubscription(subscription);

      setIsSubscribed(true);
      toast.success("알림이 켜졌습니다.");
    } catch {
      toast.error("알림을 켜지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsSubmitting(true);

    try {
      const subscription = await unsubscribeFromPush();
      if (subscription) {
        await deletePushSubscriptionByEndpoint(subscription.endpoint);
      }

      setIsSubscribed(false);
      toast.success("알림이 꺼졌습니다.");
    } catch {
      toast.error("알림을 끄지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="flex flex-col h-full w-full overflow-hidden shadow-lg border-1">
      <CardHeader>
        <CardTitle className="text-base">
          <div className="flex items-center gap-2">
            <Bell /> Notification
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Card className="p-4 text-sm text-muted-foreground">
          타임테이블 일정의 시작·종료 시각에 맞춰 알림을 보내드려요.
        </Card>

        {!supported && (
          <Card className="flex items-start gap-2 p-4 text-sm">
            <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>이 브라우저는 웹 푸시 알림을 지원하지 않아요.</span>
          </Card>
        )}

        {supported && needsInstall && (
          <Card className="flex items-start gap-2 p-4 text-sm">
            <Smartphone className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              공유 버튼에서 <b>홈 화면에 추가</b>한 뒤, 홈 화면 아이콘으로
              실행하면 알림을 사용할 수 있어요.
            </span>
          </Card>
        )}

        {supported && !needsInstall && isDenied && (
          <Card className="flex items-start gap-2 p-4 text-sm">
            <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              알림이 차단되어 있어요. 브라우저 설정에서 이 사이트의 알림을
              허용해 주세요.
            </span>
          </Card>
        )}

        {supported && !needsInstall && !isDenied && !isLoading && (
          <div className="flex items-center justify-between gap-4 px-1">
            <span className="text-sm">
              {isSubscribed
                ? "이 기기에서 알림을 받고 있어요."
                : "이 기기에서는 아직 알림을 받지 않아요."}
            </span>

            {isSubscribed ? (
              <Button
                onClick={handleUnsubscribe}
                disabled={isSubmitting}
                variant="outline"
              >
                <BellOff className="w-4 h-4" />
                알림 끄기
              </Button>
            ) : (
              <Button
                onClick={handleSubscribe}
                disabled={isSubmitting}
                variant="outline"
                className="bg-sky-200 hover:bg-sky-300 text-black"
              >
                <Bell className="w-4 h-4" />
                알림 켜기
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
