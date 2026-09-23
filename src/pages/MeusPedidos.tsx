import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { Calendar, ClipboardList, Clock, Package } from "lucide-react";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import { Header } from "@/components/Header";

import type { RootState } from "@/store/store";

interface PedidoGeral {
  id: string;
  clienteNome: string;
  status: "Pendente" | "Pronto para Retirada" | "Entregue";
  criadoEm: any;
  itens: Array<{
    id: string;
    nome: string;
    precoAtual: number;
    tamanho: string;
    quantidade: number;
  }>;
}

export const MeusPedidos = () => {
  const { uid } = useSelector((state: RootState) => state.user);

  const [pedidos, setPedidos] = useState<PedidoGeral[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarHistoricoDePedidos = async () => {
      if (!uid) return;

      try {
        setCarregando(true);

        const pedidosRef = collection(db, "pedidos");
        const consultaFiltrada = query(
          pedidosRef,
          where("usuarioUid", "==", uid), // O Firestore aceita esse filtro direto sem precisar criar índices!
        );

        const snapshot = await getDocs(consultaFiltrada);

        const listaPedidos: PedidoGeral[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PedidoGeral[];

        setPedidos(listaPedidos);
      } catch (error) {
        console.error(
          "Erro ao carregar historico de agendamentos no Firestore:",
          error,
        );
      } finally {
        setCarregando(false);
      }
    };

    buscarHistoricoDePedidos();
  }, [uid]);

  const obterEstiloStatus = (status: string) => {
    switch (status) {
      case "Pronto para Retirada":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "Entregue":
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="bg-fundo min-h-screen w-full text-zinc-100 antialiased select-none">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="border-borda/40 mb-8 flex items-center gap-3 border-b pb-6">
          <ClipboardList className="h-6 w-6 text-amber-500" />
          <h1 className="text-xl font-black tracking-wider text-zinc-100 uppercase">
            Meus Agendamentos de Retirada
          </h1>
        </div>

        {carregando ? (
          <div className="flex h-64 animate-pulse items-center justify-center text-xs font-bold tracking-widest text-zinc-500 uppercase">
            Carregando historico de Mantos...
          </div>
        ) : pedidos.length === 0 ? (
          <div className="border-borda/60 flex h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-zinc-950/20 text-xs font-bold tracking-widest text-zinc-500 uppercase">
            <Package className="mb-1 h-8 w-8 text-zinc-700" />
            <span>Nenhum pedido realizado ate o momento</span>
          </div>
        ) : (
          /* CARD INDIVIDUAL DO AGENDAMENTO COMPLETO */
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-painel border-borda group relative overflow-hidden rounded-2xl border p-5 shadow-xl"
              >
                <div className="border-borda/40 mb-4 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-black tracking-wider text-zinc-500 uppercase">
                      Codigo do Agendamento (Apresentar na Loja)
                    </span>
                    <span className="border-borda/60 rounded border bg-zinc-950 px-2 py-1 font-mono text-sm font-black text-amber-400 select-text">
                      {pedido.id}
                    </span>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-black tracking-wider uppercase ${obterEstiloStatus(pedido.status)}`}
                  >
                    {pedido.status}
                  </span>
                </div>
                <div className="space-y-3">
                  {pedido.itens?.map((item, index) => (
                    <div
                      key={`${pedido.id}-item-${index}`}
                      className="border-borda/40 flex items-center justify-between rounded-xl border bg-zinc-950/40 p-3 text-xs"
                    >
                      <div className="space-y-1">
                        <span className="block font-bold tracking-wide text-zinc-200 uppercase">
                          {item.nome}
                        </span>
                        <span className="border-borda/40 inline-block rounded border bg-zinc-900 px-1.5 py-0.5 text-[9px] font-black text-amber-500">
                          Tamanho: {item.tamanho}
                        </span>
                      </div>
                      <span className="font-bold text-zinc-400">
                        {item.quantidade}x
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-borda/40 mt-4 flex items-center justify-between border-t pt-4 text-[11px] font-medium text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                    <span>Retirada Presencial Solicitada</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-zinc-600" />
                    <span>Aguardando separacao</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
