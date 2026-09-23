import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export const Login = () => {
  const { estaLogado, loginComGoogle } = useAuth();
  const navigate = useNavigate(); // Inicializa o motorista de rotas

  useEffect(() => {
    if (estaLogado) {
      console.log(
        "Barragem ativada! Usuário já logado tentando acessar o login. Expulsando para a Home...",
      );
      navigate("/"); // Arremessa o usuário de volta para a página principal
    }
  }, [estaLogado, navigate]); // Fica vigiando o status de login o tempo todo!

  return (
    <div className="bg-fundo relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 text-zinc-100 antialiased">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="border-borda bg-painel/40 w-full max-w-sm rounded-2xl border p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="mb-8">
          <h2 className="text-2xl font-black tracking-wider text-zinc-100 uppercase">
            Clube CamisaProFC
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Acesse sua conta instantaneamente para gerenciar seus mantos e
            pedidos
          </p>
        </div>
        <Button
          onClick={loginComGoogle}
          className="bg-ouro-metal flex h-12 w-full items-center justify-center gap-3 rounded-lg font-black tracking-wider text-zinc-950 uppercase shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01] hover:cursor-pointer hover:brightness-110"
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.435 1.21 15.62 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z" />
          </svg>
          Entrar com o Google
        </Button>

        <p className="mt-8 text-center text-[11px] leading-relaxed tracking-widest text-zinc-500 uppercase">
          🔒 Conexão segura e autenticada diretamente via Google Accounts
        </p>
      </div>
    </div>
  );
};
