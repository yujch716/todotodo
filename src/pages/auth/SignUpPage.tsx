import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import LoadingModal from "@/components/LoadingModal.tsx";
import AlertModal from "@/components/AlertModal.tsx";
import PasswordInput from "@/components/PasswordInput";
import { signUp } from "@/api/auth.ts";
import { upsertUserProfile } from "@/api/profile.ts";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    const { data, error } = await signUp(email, password);

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    } else {
      const user = data.user;
      if (user?.id) {
        await upsertUserProfile(user.id, name);

        setIsLoading(false);
        setIsSuccess(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <LoadingModal open={isLoading} />
      <AlertModal
        open={isSuccess}
        message="이메일 인증메일이 발송되었습니다. 메일함을 확인해주세요."
      />

      <Card className="w-full max-w-sm sm:max-w-md p-6 shadow-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <img
            src="/todotodo-logo.png"
            alt="todotodo logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-semibold">회원가입</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignUp}>
            <div className="py-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="py-2">
              <Label htmlFor="password">비밀번호</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="py-2">
              <Label htmlFor="confirm-password">비밀번호 확인</Label>
              <PasswordInput
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="py-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {errorMessage && (
              <p className="pt-2 text-red-500">{errorMessage}</p>
            )}
            <Button className="w-full mt-4 bg-sky-600 hover:bg-sky-500">
              회원가입
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
