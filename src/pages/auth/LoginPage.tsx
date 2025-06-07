import { Button } from "../../components/ui/button.tsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.tsx";
import { Label } from "../../components/ui/label.tsx";
import { Input } from "../../components/ui/input.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingModal from "@/components/LoadingModal.tsx";
import PasswordInput from "@/components/PasswordInput.tsx";
import { googleLogin, login } from "@/api/auth.ts";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const { error } = await login(email, password);

    if (error) {
      setErrorMessage(error);
    } else {
      navigate("/");
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    await googleLogin();
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <LoadingModal open={isLoading} />

      <Card className="w-full max-w-sm sm:max-w-md p-6 shadow-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <img
            src="/todotodo-logo.png"
            alt="todotodo logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-semibold">todotodo</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            <Button
              type="submit"
              className="w-full mt-4 bg-sky-600 hover:bg-sky-500"
            >
              로그인
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">또는</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-sky-50"
            onClick={handleGoogleLogin}
          >
            <img src="/google-logo.png" alt="Google" className="w-5 h-5" />
            Google로 로그인
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            계정이 없으신가요?{" "}
            <a
              href="/signup"
              className="text-slate-800 hover:underline font-medium"
            >
              회원가입
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
