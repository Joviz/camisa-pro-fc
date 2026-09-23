import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Minus, Plus, Trash2 } from "lucide-react";

import { processarAgendamentoRetirada } from "@/services/pedidoService";
import { useNavigate } from "react-router-dom";

import {
  aumentarQuantidade,
  diminuirQuantidade,
  limparCarrinho,
  removerItem,
  setCarrinhoAberto,
} from "@/store/cartSlice";
import type { RootState } from "@/store/store";

import { FormularioRetirada } from "./FormularioRetirada";
import { Button } from "./ui/button";

export const SacolaLateral = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const itensCarrinho = useSelector((state: RootState) => state.cart.itens);

  const [etapaFormulario, setEtapaFormulario] = useState(false);
  const { cpf, whatsapp, estaLogado, nome, uid } = useSelector(
    (state: RootState) => state.user,
  );

  const handleAvançarParaAgendamento = async () => {
    if (!estaLogado) {
      navigate("/login");
      return;
    }

    if (cpf && whatsapp && nome && uid) {
      const clienteConfirmou = window.confirm(
        "Confirmacao de Agendamento:\n\nApos realizada a encomenda, nao sera possivel realizar o cancelamento.\n\nDeseja continuar?",
      );

      if (!clienteConfirmou) {
        console.log(
          "Agendamento abortado pelo usuario no pop-up de confirmacao.",
        );
        return;
      }

      console.log(
        "Cenário A ativado! Enviando agendamento direto para o Firebase...",
      );

      const resultado = await processarAgendamentoRetirada({
        usuarioUid: uid || "",
        clienteNome: nome || "",
        clienteCpf: cpf || "",
        clienteWhatsapp: whatsapp || "",
        itens: itensCarrinho, // Manda os mantos da sacola
      });

      if (resultado.sucesso) {
        alert(
          `Agendamento Confirmado Direto! Código do Pedido: ${resultado.idPedido}`,
        );
        dispatch(limparCarrinho());
        dispatch(setCarrinhoAberto(false)); // Fecha o painel lateral de forma suave
      } else {
        alert("Erro de rede ao tentar processar o agendamento direto.");
      }
    } else {
      console.log("Cenário B ativado! Abrindo formulário na gaveta.");
      setEtapaFormulario(true);
    }
  };
  return (
    <div className="flex flex-1 flex-col justify-between overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto py-4 pr-1">
        {itensCarrinho.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-sm font-semibold text-zinc-500 uppercase">
            <span>Sacola vazia </span>
          </div>
        ) : (
          itensCarrinho.map((item) => (
            <div
              key={`${item.id}-${item.tamanho}`}
              className="border-borda/60 group relative flex items-center gap-4 rounded-xl border bg-zinc-950/40 p-3"
            >
              <div className="border-borda/40 h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-zinc-900">
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex h-20 flex-1 flex-col justify-between py-0.5">
                <div>
                  <h4 className="line-clamp-1 text-xs font-bold tracking-wide text-zinc-200 uppercase">
                    {item.nome}
                  </h4>
                  <span className="border-borda/40 mt-1 inline-block rounded border bg-zinc-900 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-amber-400 uppercase">
                    Tamanho: {item.tamanho}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-black text-zinc-100">
                    {(item.precoAtual * item.quantidade).toLocaleString(
                      "pt-BR",
                      { style: "currency", currency: "BRL" },
                    )}
                  </span>
                  <div className="border-borda/60 flex h-7 items-center gap-1 overflow-hidden rounded-lg border bg-zinc-900">
                    <button
                      onClick={() =>
                        dispatch(
                          diminuirQuantidade({
                            id: item.id,
                            tamanho: item.tamanho,
                          }),
                        )
                      }
                      className="h-full px-2 text-zinc-400 transition-colors hover:cursor-pointer hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 px-1.5 text-center text-xs font-bold text-zinc-200">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(
                          aumentarQuantidade({
                            id: item.id,
                            tamanho: item.tamanho,
                          }),
                        )
                      }
                      className="h-full px-2 text-zinc-400 transition-colors hover:cursor-pointer hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  dispatch(removerItem({ id: item.id, tamanho: item.tamanho }))
                }
                className="absolute top-2 right-2 rounded-md p-1 text-zinc-600 opacity-0 transition-all group-hover:opacity-100 hover:cursor-pointer hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
      {itensCarrinho.length > 0 && (
        <div className="border-borda/40 bg-painel border-t pt-4">
          {etapaFormulario ? (
            <FormularioRetirada
              totalPreco={itensCarrinho
                .reduce(
                  (acc, item) => acc + item.precoAtual * item.quantidade,
                  0,
                )
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-bold tracking-wider text-zinc-300 uppercase">
                <span>Total da Sacola:</span>
                <span className="text-lg font-black text-amber-400">
                  {itensCarrinho
                    .reduce(
                      (acc, item) => acc + item.precoAtual * item.quantidade,
                      0,
                    )
                    .toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                </span>
              </div>
              <Button
                onClick={handleAvançarParaAgendamento}
                className="bg-ouro-metal h-12 w-full rounded-xl font-black tracking-wider text-zinc-950 uppercase shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01] hover:cursor-pointer hover:brightness-110"
              >
                Agendar Retirada Presencial
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
