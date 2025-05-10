import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card.tsx";
import { Label } from "../components/ui/label.tsx";
import { Input } from "../components/ui/input.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient.ts";
import LoadingModal from "@/components/LoadingModal.tsx";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(
        "이메일 인증이 완료되지 않았거나, 이메일 또는 비밀번호가 올바르지 않습니다.",
      );
    } else {
      navigate("/");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <LoadingModal open={isLoading} />

      <Card className="w-full max-w-sm sm:max-w-md p-6 shadow-xl">
        <CardContent className="space-y-4">
          <h1 className="py-6 text-2xl font-semibold text-center">todotodo</h1>
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            <Button className="w-full mt-4 bg-slate-800 hover:bg-slate-700">
              로그인
            </Button>
          </form>

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
}
