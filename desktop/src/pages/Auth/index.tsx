import { useState } from "react";
import { useForm } from "react-hook-form";

// shadcn/ui components (assumes you have shadcn installed and set up)
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth-store";

type AuthForm = {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
};

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showStoreSelect, setShowStoreSelect] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setSelectedStore, setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthForm>({
    mode: "onTouched",
    defaultValues: {
      email: "matheus2018i@gmail.com",
      password: "12345678",
      confirmPassword: "",
      name: "",
    },
  });

  const onSubmit = async (data: AuthForm) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/${mode}`,
        data
      );
      if (res.status === 200) {
        const { user, token } = res.data;

        setAuth({
          user,
          token,
        });

        if (user.stores.length === 1) {
          setSelectedStore(user.stores[0]);
          navigate(`/store/${user.stores[0].store.id}`);
        } else if (user.stores.length > 1) {
          setShowStoreSelect(true);
        }
      }
    } catch (error) {
      console.error("Auth error", error);
    } finally {
      setLoading(false);
      reset();
    }
  };

  const handleStoreSelect = (storeLink: any) => {
    setSelectedStore(storeLink);
    navigate(`/store/${storeLink.store.id}`);
  };

  const password = watch("password");

  if (showStoreSelect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md border-primary-foreground/20">
          <CardHeader>
            <CardTitle className="text-lg text-center">Escolha sua loja</CardTitle>
            <CardDescription className="text-sm text-muted-foreground text-center">
              Você possui acesso a múltiplas lojas. Selecione uma para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user?.stores.map((storeLink) => (
              <Button
                key={storeLink.store.id}
                variant="outline"
                className="w-full justify-start h-auto py-4 px-6 flex flex-col items-start gap-1"
                onClick={() => handleStoreSelect(storeLink)}
              >
                <span className="font-semibold text-base">{storeLink.store.name}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{storeLink.role}</span>
              </Button>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full text-xs text-muted-foreground"
              onClick={() => setShowStoreSelect(false)}
            >
              Voltar para o login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-primary-foreground/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {mode === "login" ? "Entrar" : "Criar conta"}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {mode === "login"
                  ? "Entre na sua conta para continuar."
                  : "Crie uma conta nova para começar."}
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login" ? "Quero criar conta" : "Já tenho conta"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label className="mb-2 block text-sm">Nome</Label>
                <Input
                  {...register("name", {
                    required: mode === "signup" ? "Nome é obrigatório" : false,
                  })}
                  placeholder="Seu nome"
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {errors?.name?.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label className="mb-2 block text-sm">Email</Label>
              <Input
                {...register("email", {
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email inválido",
                  },
                })}
                placeholder="email@exemplo.com"
                type="email"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">
                  {errors?.email?.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Label className="mb-2 block text-sm">Senha</Label>
              <Input
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                placeholder="Senha (mín. 6 caracteres)"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                aria-label="Alternar visibilidade da senha"
                className="absolute right-3 top-8 rounded px-2 py-1 opacity-70 hover:opacity-100"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors?.password?.message}
                </p>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <Label className="mb-2 block text-sm">Confirmar senha</Label>
                <Input
                  {...register("confirmPassword", {
                    required: "Confirmação é obrigatória",
                    validate: (val) =>
                      val === password || "As senhas não coincidem",
                  })}
                  placeholder="Repita a senha"
                  type={showPassword ? "text" : "password"}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">
                    {errors?.confirmPassword?.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || loading}
              >
                {mode === "login" ? "Entrar" : "Criar conta"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <div className="w-full text-center text-xs text-muted-foreground">
            Ao continuar, você concorda com nossos termos de serviço.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
