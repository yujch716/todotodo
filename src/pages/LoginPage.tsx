import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card.tsx";
import { Label } from "../components/ui/label.tsx";
import { Input } from "../components/ui/input.tsx";

export default function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <Card className="w-full max-w-sm sm:max-w-md p-6 shadow-xl">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">로그인</h1>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full mt-4">로그인</Button>
        </CardContent>
      </Card>
    </div>
  );
}
