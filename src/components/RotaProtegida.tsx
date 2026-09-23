import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

import type { RootState } from "@/store/store";

interface RotaProtegidaProps {
  children: React.ReactNode;
}

export const RotaProtegida = ({ children }: RotaProtegidaProps) => {
  const { estaLogado, carregandoAutenticacao } = useSelector(
    (state: RootState) => state.user,
  );

  if (carregandoAutenticacao) {
    return (
      <div className="bg-fundo flex min-h-screen w-full animate-pulse items-center justify-center bg-zinc-950 text-xs font-black tracking-[0.2em] text-zinc-500 uppercase">
        Autenticando credenciais...
      </div>
    );
  }

  if (!estaLogado) {
    console.log(
      "Acesso negado! Rota protegida detectou usuario anonimo. Ejetando...",
    );
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
