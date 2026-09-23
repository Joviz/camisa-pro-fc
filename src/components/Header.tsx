import { useDispatch, useSelector } from "react-redux";

import { Search, ShoppingBag, User } from "lucide-react";

import { Logo } from "@/assets/images/Logo";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { setCarrinhoAberto } from "@/store/cartSlice";
import { definirTermoBusca, dispararBuscaOficial } from "@/store/searchSlice";
import type { RootState } from "@/store/store";

import { SacolaLateral } from "./SacolaLateral";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

export const Header = () => {
  const dispatch = useDispatch();
  const { estaLogado, deslogar } = useAuth();

  const itensCarrinho = useSelector((state: RootState) => state.cart.itens);
  const carrinhoAberto = useSelector(
    (state: RootState) => state.cart.carrinhoAberto,
  );
  const termoBusca = useSelector((state: RootState) => state.search.termo);

  const totalItens = itensCarrinho.reduce(
    (acumulador, item) => acumulador + item.quantidade,
    0,
  );

  const handleExecutarBusca = (e: React.FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar e quebrar o estado do Redux
    dispatch(dispararBuscaOficial()); // Envia o sinal para a vitrine filtrar
    console.log("Busca executada oficialmente!");
  };

  return (
    <>
      <header className="border-borda from-painel to-fundo relative flex w-full items-center justify-between overflow-hidden border-b bg-gradient-to-r px-6 py-4">
        <div className="pointer-events-none absolute top-[-50px] right-[-50px] -z-10 h-44 w-44 rounded-full bg-amber-500/20 blur-[60px]" />

        <Link to="/" className="transition-opacity hover:opacity-90">
          <Logo className="h-10 w-auto" />
        </Link>
        <form
          onSubmit={handleExecutarBusca}
          className="hidden w-full max-w-md sm:block"
        >
          <Field>
            <FieldLabel htmlFor="input-button-group" className="sr-only">
              Buscar mantos
            </FieldLabel>
            <ButtonGroup>
              <Input
                id="input-button-group"
                value={termoBusca}
                onChange={(e) => dispatch(definirTermoBusca(e.target.value))}
                placeholder="Busque pelo manto do seu time..."
                className="bg-fundo border-borda rounded-l-full text-zinc-100"
              />
              <Button
                type="submit"
                className="bg-ouro-metal rounded-r-full px-5 py-2 font-bold text-zinc-950 shadow-lg shadow-amber-500/5 transition-all hover:scale-[1.02] hover:cursor-pointer hover:brightness-110"
              >
                <Search />
              </Button>
            </ButtonGroup>
          </Field>
        </form>
        <div className="flex items-center gap-6">
          {estaLogado ? (
            <button
              onClick={deslogar}
              title="Clique para deslogar"
              className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-amber-500/40 bg-zinc-900/60 transition-all hover:cursor-pointer hover:border-red-500"
            >
              <User className="h-4 w-4 text-amber-500/90 transition-colors group-hover:text-red-400" />
              <span className="absolute inset-0 flex items-center justify-center bg-zinc-950/95 text-[9px] font-black text-red-400 uppercase opacity-0 transition-opacity group-hover:opacity-100">
                Sair
              </span>
            </button>
          ) : (
            <Link
              to="/login"
              className="text-zinc-400 transition-colors hover:cursor-pointer hover:text-zinc-100"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          <Sheet
            open={carrinhoAberto}
            onOpenChange={(moduloAberto) =>
              dispatch(setCarrinhoAberto(moduloAberto))
            }
          >
            <SheetTrigger
              type="button"
              onClick={() => dispatch(setCarrinhoAberto(true))}
              className="relative border-0 bg-transparent p-1 text-zinc-400 transition-colors outline-none hover:cursor-pointer hover:text-zinc-100"
            >
              <ShoppingBag className="h-6 w-6 text-zinc-200" />
              {totalItens > 0 && (
                <span className="bg-ouro-metal absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-zinc-950">
                  {totalItens}
                </span>
              )}
            </SheetTrigger>
            <SheetContent className="bg-painel border-borda flex flex-col border-l p-6 text-zinc-100 sm:max-w-md">
              <SheetHeader className="border-borda/40 border-b pb-4 text-left">
                <SheetTitle className="text-lg font-black tracking-wide text-zinc-100 uppercase">
                  Sua Sacola 🛒
                </SheetTitle>
                <SheetDescription className="text-xs text-zinc-400">
                  Confira suas armaduras antes da retirada presencial.
                </SheetDescription>
              </SheetHeader>
              <SacolaLateral />
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <form
        onSubmit={handleExecutarBusca}
        className="border-borda/40 block w-full border-b bg-zinc-950 px-6 py-2 sm:hidden"
      >
        <Field>
          <FieldLabel htmlFor="input-mobile" className="sr-only">
            Buscar mantos celular
          </FieldLabel>
          <ButtonGroup className="h-8">
            <Input
              id="input-mobile"
              value={termoBusca}
              onChange={(e) => dispatch(definirTermoBusca(e.target.value))}
              placeholder="Pesquisar..."
              className="border-borda/50 h-full rounded-l-full bg-zinc-900/40 text-xs text-zinc-200 placeholder-zinc-500"
            />
            <Button
              type="submit"
              className="bg-ouro-metal h-full rounded-r-full px-4 font-bold text-zinc-950 hover:cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </ButtonGroup>
        </Field>
      </form>
    </>
  );
};
