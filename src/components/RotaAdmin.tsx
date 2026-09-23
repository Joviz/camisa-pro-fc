import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

import type { RootState } from "@/store/store";

interface RotaAdminProps {
  children: React.ReactNode;
}

const EMAILS_ADMINISTRADORES = [
  "visuallize.cont@gmail.com",
  "seuemailreal@gmail.com",
];

export const RotaAdmin = ({ children }: RotaAdminProps) => {
  const { estaLogado, email, carregandoAutenticacao } = useSelector(
    (state: RootState) => state.user,
  );

  if (carregandoAutenticacao) {
    return (
      <div className="flex min-h-screen w-full animate-pulse items-center justify-center bg-zinc-950 text-xs font-black tracking-[0.2em] text-zinc-500 uppercase">
        Autenticando credenciais administrativas...
      </div>
    );
  }

  if (!estaLogado || !email) {
    console.log(
      "Acesso negado! Usuario nao autenticado tentando acessar o Admin.",
    );
    return <Navigate to="/" replace />;
  }

  const ehLojistaAutorizado = EMAILS_ADMINISTRADORES.includes(email);

  if (!ehLojistaAutorizado) {
    console.log(
      `Tentativa de invasao bloqueada! O usuario ${email} nao possui permissao de lojista.`,
    );

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
