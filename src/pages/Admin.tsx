import { useEffect, useState } from "react";

import {
  Boxes,
  LayoutDashboard,
  PlusCircle,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";

import { db } from "@/lib/firebase";
// 🔌 Importamos o atualizador de status do servico de pedidos
import { atualizarStatusDoPedido } from "@/services/pedidoService";
import {
  type MantoProduto,
  atualizarDadosDoManto,
  cadastrarNovoManto,
  listarMantosDoFirestore,
} from "@/services/produtoService";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const cadastroMantoSchema = z.object({
  nome: z.string().min(5, "O nome do manto precisa ter pelo menos 5 letras"),
  precoOriginal: z.number().min(1, "Digite o preco cheio original do manto"),
  precoAtual: z.number().min(1, "Digite o preco final de venda"),
  imagem: z.string().url("Insira um link de imagem valido"),
  tag: z.string().optional(),
  categoria: z.string(),
  estoque: z.number().min(0, "O estoque nao pode ser negativo"),
});

type CadastroMantoData = z.infer<typeof cadastroMantoSchema>;

// Contrato de interface para a listagem de pedidos de todos os clientes no painel
interface PedidoPainel {
  id: string;
  clienteNome: string;
  clienteCpf: string;
  clienteWhatsapp: string;
  status: "Pendente" | "Pronto para Retirada" | "Entregue";
  itens: Array<{ nome: string; tamanho: string; quantidade: number }>;
}

export const Admin = () => {
  const [abaAtiva, setAbaAtiva] = useState<"PEDIDOS" | "ESTOQUE" | "CADASTRO">(
    "PEDIDOS",
  );
  const [produtosBanco, setProdutosBanco] = useState<MantoProduto[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(false);

  // 🟢 ESTADOS NOVOS: Gerenciam a lista e o carregador dos agendamentos de todos os clientes
  const [pedidosBanco, setPedidosBanco] = useState<PedidoPainel[]>([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CadastroMantoData>({
    resolver: zodResolver(cadastroMantoSchema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      precoOriginal: 0,
      precoAtual: 0,
      imagem: "",
      tag: "",
      categoria: "NACIONAL",
      estoque: 10,
    },
  });

  // 📡 BUSCADOR MASTER DE ENCOMENDAS: Puxa todos os agendamentos feitos na loja de uma vez
  const carregarPedidosDoBanco = async () => {
    try {
      setCarregandoPedidos(true);
      const pedidosRef = collection(db, "pedidos");
      const consultaOrdenada = query(pedidosRef, orderBy("criadoEm", "desc"));
      const snapshot = await getDocs(consultaOrdenada);

      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PedidoPainel[];

      setPedidosBanco(lista);
    } catch (error) {
      console.error(
        "Erro ao carregar lista de pedidos global no Admin:",
        error,
      );
    } finally {
      setCarregandoPedidos(false);
    }
  };

  // 📡 CARREGADOR REATIVO DA TABELA DE ESTOQUE
  const carregarCatalogoDoBanco = async () => {
    try {
      setCarregandoProdutos(true);
      const lista = await listarMantosDoFirestore();
      setProdutosBanco(lista);
    } catch (error) {
      console.error("Erro ao sincronizar catalogo no painel:", error);
    } finally {
      setCarregandoProdutos(false);
    }
  };

  // Dispara a busca certa dependendo de qual aba o lojista clicou no monitor
  useEffect(() => {
    if (abaAtiva === "PEDIDOS") {
      carregarPedidosDoBanco();
    } else if (abaAtiva === "ESTOQUE") {
      carregarCatalogoDoBanco();
    }
  }, [abaAtiva]);

  // ⚡ MODIFICADOR DE STATUS DE AGENDAMENTO: Altera na nuvem e atualiza a linha da tela local na hora
  const handleMudarStatusPedido = async (
    idPedido: string,
    novoStatus: "Pendente" | "Pronto para Retirada" | "Entregue",
  ) => {
    const resultado = await atualizarStatusDoPedido(idPedido, novoStatus);
    if (resultado.sucesso) {
      setPedidosBanco((listaAntiga) =>
        listaAntiga.map((p) =>
          p.id === idPedido ? { ...p, status: novoStatus } : p,
        ),
      );
    } else {
      alert("Falha ao atualizar status do agendamento no Firebase.");
    }
  };

  const handleAlterarDadosManto = async (
    id: string,
    chavesAtualizadas: Partial<MantoProduto>,
  ) => {
    const resultado = await atualizarDadosDoManto(id, chavesAtualizadas);
    if (resultado.sucesso) {
      setProdutosBanco((listaAntiga) =>
        listaAntiga.map((p) =>
          p.id === id ? { ...p, ...chavesAtualizadas } : p,
        ),
      );
    }
  };

  const onSubmitNovoManto = async (dados: CadastroMantoData) => {
    const resultado = await cadastrarNovoManto({
      ...dados,
      categoria: dados.categoria as "NACIONAL" | "INTERNACIONAL" | "PROMOCAO",
    });
    if (resultado.sucesso) {
      alert("Manto inserido com sucesso!");
      reset();
    }
  };

  return (
    <div className="bg-fundo min-h-screen w-full text-zinc-100 antialiased select-none">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="border-borda/40 mb-8 flex items-center gap-3 border-b pb-6">
          <LayoutDashboard className="h-6 w-6 text-amber-500" />
          <h1 className="text-xl font-black tracking-wider text-zinc-100 uppercase">
            Painel de Controle do Lojista
          </h1>
        </div>

        <div className="border-borda/40 mb-8 flex items-center gap-2 border-b pb-[1px] text-xs font-bold tracking-wider uppercase">
          <button
            onClick={() => setAbaAtiva("PEDIDOS")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition-all hover:cursor-pointer ${abaAtiva === "PEDIDOS" ? "border-amber-500 font-black text-amber-400" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            <ShoppingCart className="h-4 w-4" />
            Pedidos Pendentes
          </button>
          <button
            onClick={() => setAbaAtiva("ESTOQUE")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition-all hover:cursor-pointer ${abaAtiva === "ESTOQUE" ? "border-amber-500 font-black text-amber-400" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            <Boxes className="h-4 w-4" />
            Controle de Estoque
          </button>
          <button
            onClick={() => setAbaAtiva("CADASTRO")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition-all hover:cursor-pointer ${abaAtiva === "CADASTRO" ? "border-amber-500 font-black text-amber-400" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            <PlusCircle className="h-4 w-4" />
            Cadastrar Manto
          </button>
        </div>
        {/* ⚽ ABA 1 COMPLETA: LISTAGEM DE ENCOMENDAS DE TODOS OS CLIENTES REAL EM TEMPO REAL */}
        {abaAtiva === "PEDIDOS" && (
          <div className="space-y-6">
            <div className="bg-painel border-borda flex items-center justify-between rounded-xl border p-4">
              <span className="text-xs font-black tracking-wider text-zinc-400 uppercase">
                Agendamentos de Retirada Física na Loja
              </span>
              <button
                type="button"
                onClick={carregarPedidosDoBanco}
                title="Atualizar Pedidos"
                className="border-borda/60 rounded-xl border bg-zinc-900 p-2 text-zinc-400 transition-colors hover:cursor-pointer hover:bg-zinc-800 hover:text-zinc-100"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${carregandoPedidos ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {carregandoPedidos ? (
              <div className="animate-pulse py-12 text-center text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Sincronizando banco de agendamentos...
              </div>
            ) : pedidosBanco.length === 0 ? (
              <div className="bg-painel border-borda rounded-2xl border py-12 text-center text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Nenhum agendamento realizado no site ate o momento
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {pedidosBanco.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="bg-painel border-borda relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 shadow-xl"
                  >
                    <div>
                      <div className="border-borda/40 mb-4 flex items-center justify-between border-b pb-3">
                        <div className="space-y-0.5">
                          <span className="block text-[9px] font-black tracking-wider text-zinc-500 uppercase">
                            Codigo do Pedido
                          </span>
                          <span className="border-borda/40 rounded border bg-zinc-950 px-2 py-0.5 font-mono text-xs font-black text-amber-400 select-all">
                            {pedido.id}
                          </span>
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase ${
                            pedido.status === "Entregue"
                              ? "border-zinc-700 bg-zinc-800 text-zinc-400"
                              : pedido.status === "Pronto para Retirada"
                                ? "border-green-500/20 bg-green-500/10 text-green-400"
                                : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {pedido.status}
                        </span>
                      </div>
                      <div className="border-borda/40 mb-4 space-y-1 rounded-xl border bg-zinc-950/40 p-3 text-[11px] font-bold tracking-wide uppercase">
                        <div className="truncate text-zinc-200">
                          <span className="text-zinc-500">Cliente:</span>{" "}
                          {pedido.clienteNome}
                        </div>
                        <div className="font-mono text-zinc-300">
                          <span className="font-sans text-zinc-500">CPF:</span>{" "}
                          {pedido.clienteCpf}
                        </div>
                        <div className="font-mono text-zinc-300">
                          <span className="font-sans text-zinc-500">
                            WhatsApp:
                          </span>{" "}
                          {pedido.clienteWhatsapp}
                        </div>
                      </div>
                      <div className="mb-4 space-y-2">
                        <span className="block text-[9px] font-black tracking-wider text-zinc-500 uppercase">
                          Produtos Solicitados
                        </span>
                        {pedido.itens?.map((item, idx) => (
                          <div
                            key={`${pedido.id}-item-${idx}`}
                            className="border-borda/20 flex items-center justify-between rounded-lg border bg-zinc-950/20 p-2.5 text-xs"
                          >
                            <span className="line-clamp-1 font-bold text-zinc-300">
                              {item.nome}
                            </span>
                            <span className="ml-2 shrink-0 rounded border border-amber-500/20 bg-zinc-950/40 px-1.5 py-0.5 text-[10px] font-black text-amber-500">
                              G - {item.quantidade}x
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-borda/40 mt-auto flex items-center gap-2 border-t pt-4">
                      {pedido.status === "Pendente" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMudarStatusPedido(
                              pedido.id,
                              "Pronto para Retirada",
                            )
                          }
                          className="border-borda/80 h-9 flex-1 rounded-xl border bg-zinc-900 text-[10px] font-black tracking-wider text-green-400 uppercase transition-all hover:cursor-pointer hover:bg-zinc-800"
                        >
                          Separar Manto
                        </button>
                      )}
                      {pedido.status !== "Entregue" ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleMudarStatusPedido(pedido.id, "Entregue")
                          }
                          className="bg-ouro-metal h-9 flex-1 rounded-xl text-[10px] font-black tracking-wider text-zinc-950 uppercase shadow-md shadow-amber-500/5 transition-all hover:scale-[1.01] hover:cursor-pointer hover:brightness-110"
                        >
                          Dar Baixa Retirada
                        </button>
                      ) : (
                        <div className="border-borda/20 flex h-9 w-full items-center justify-center rounded-xl border bg-zinc-900/40 text-[10px] font-black tracking-wider text-zinc-500 uppercase">
                          Entrega Concluida
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {abaAtiva === "ESTOQUE" && (
          <div className="bg-painel border-borda space-y-4 rounded-2xl border p-6 shadow-xl">
            <div className="border-borda/40 flex items-center justify-between border-b pb-4">
              <span className="text-xs font-black tracking-wider text-zinc-400 uppercase">
                Armaduras Cadastradas no Sistema
              </span>
              <button
                type="button"
                onClick={carregarCatalogoDoBanco}
                title="Atualizar dados"
                className="border-borda/60 rounded-xl border bg-zinc-900 p-2 text-zinc-400 transition-colors hover:cursor-pointer hover:bg-zinc-800 hover:text-zinc-100"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${carregandoProdutos ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {carregandoProdutos ? (
              <div className="animate-pulse py-10 text-center text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Sincronizando prateleiras...
              </div>
            ) : produtosBanco.length === 0 ? (
              <div className="py-10 text-center text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Nenhum produto localizado na nuvem do Google
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs font-bold tracking-wider uppercase">
                  <thead>
                    <tr className="border-borda/40 border-b text-[10px] text-zinc-500">
                      <th className="px-2 py-3">Manto</th>
                      <th className="w-28 px-2 py-3">Preco Original</th>{" "}
                      {/* 🟢 Nova Coluna de Preço Cheio */}
                      <th className="w-28 px-2 py-3">Preco Venda</th>{" "}
                      {/* 🟢 Nova Coluna de Venda com Desconto */}
                      <th className="w-24 px-2 py-3">Estoque</th>
                      <th className="w-44 px-2 py-3">Categoria Exibicao</th>
                    </tr>
                  </thead>
                  <tbody className="divide-borda/20 divide-y text-zinc-200">
                    {produtosBanco.map((produto) => (
                      <tr
                        key={produto.id}
                        className="transition-colors hover:bg-zinc-950/20"
                      >
                        <td className="max-w-xs truncate px-2 py-4 font-black text-zinc-100">
                          {produto.nome}
                        </td>
                        <td className="px-2 py-4">
                          <div className="relative flex items-center">
                            <span className="absolute left-2 text-[10px] text-zinc-500">
                              R$
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              value={produto.precoOriginal}
                              onChange={(e) =>
                                handleAlterarDadosManto(produto.id!, {
                                  precoOriginal: Number(e.target.value),
                                })
                              }
                              className="border-borda/60 h-8 w-24 rounded-lg border bg-zinc-950 pr-2 pl-6 text-left font-mono text-xs font-bold text-zinc-300 outline-none focus:border-amber-500"
                            />
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <div className="relative flex items-center">
                            <span className="absolute left-2 text-[10px] text-amber-600">
                              R$
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              value={produto.precoAtual}
                              onChange={(e) =>
                                handleAlterarDadosManto(produto.id!, {
                                  precoAtual: Number(e.target.value),
                                })
                              }
                              className="border-borda/60 h-8 w-24 rounded-lg border bg-zinc-950 pr-2 pl-6 text-left font-mono text-xs font-black text-amber-400 outline-none focus:border-amber-500"
                            />
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <input
                            type="number"
                            value={produto.estoque}
                            onChange={(e) =>
                              handleAlterarDadosManto(produto.id!, {
                                estoque: Number(e.target.value),
                              })
                            }
                            className="border-borda/60 h-8 w-16 rounded-lg border bg-zinc-950 px-2 text-center text-xs font-black text-zinc-100 outline-none focus:border-amber-500"
                          />
                        </td>
                        <td className="px-2 py-4">
                          <select
                            value={produto.categoria}
                            onChange={(e) =>
                              handleAlterarDadosManto(produto.id!, {
                                categoria: e.target.value as any,
                              })
                            }
                            className="border-borda/60 h-8 rounded-lg border bg-zinc-950 px-2 text-xs font-black tracking-wide text-zinc-300 uppercase outline-none focus:border-amber-500"
                          >
                            <option value="NACIONAL">Nacionais</option>
                            <option value="INTERNACIONAL">
                              Internacionais
                            </option>
                            <option value="PROMOCAO">Em Promocao</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {abaAtiva === "CADASTRO" && (
          <div className="bg-painel border-borda max-w-2xl rounded-2xl border p-6 shadow-xl">
            <form
              onSubmit={handleSubmit(onSubmitNovoManto)}
              className="space-y-5"
            >
              <Field>
                <FieldLabel
                  htmlFor="nome"
                  className="mb-1.5 block text-[10px] font-black tracking-wider text-zinc-400 uppercase"
                >
                  Nome Oficial do Manto
                </FieldLabel>
                <Input
                  id="nome"
                  placeholder="Ex: Camisa Real Madrid Away 26/27 - Torcedor"
                  {...register("nome")}
                  className="border-borda/80 h-10 rounded-xl border bg-zinc-950/60 px-3 text-sm text-zinc-100 focus:border-amber-500"
                />
                {errors.nome && (
                  <span className="mt-1 block text-[10px] font-bold tracking-wide text-red-400 uppercase">
                    {errors.nome.message}
                  </span>
                )}
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="precoOriginal"
                    className="mb-1.5 block text-[10px] font-black tracking-wider text-zinc-400 uppercase"
                  >
                    Preco Original (Sem Desconto)
                  </FieldLabel>
                  <Input
                    id="precoOriginal"
                    type="number"
                    step="0.01"
                    placeholder="299.90"
                    {...register("precoOriginal", { valueAsNumber: true })}
                    className="border-borda/80 h-10 rounded-xl border bg-zinc-950/60 px-3 text-sm text-zinc-100 focus:border-amber-500"
                  />
                  {errors.precoOriginal && (
                    <span className="mt-1 block text-[10px] font-bold tracking-wide text-red-400 uppercase">
                      {errors.precoOriginal.message}
                    </span>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="precoAtual"
                    className="mb-1.5 block text-[10px] font-black tracking-wider text-zinc-400 uppercase"
                  >
                    Preco Final de Venda (Com Desconto)
                  </FieldLabel>
                  <Input
                    id="precoAtual"
                    type="number"
                    step="0.01"
                    placeholder="199.90"
                    {...register("precoAtual", { valueAsNumber: true })}
                    className="border-borda/80 h-10 rounded-xl border bg-zinc-950/60 px-3 text-sm text-zinc-100 focus:border-amber-500"
                  />
                  {errors.precoAtual && (
                    <span className="mt-1 block text-[10px] font-bold tracking-wide text-red-400 uppercase">
                      {errors.precoAtual.message}
                    </span>
                  )}
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="categoria"
                    className="mb-1.5 block text-[10px] font-black tracking-wider text-zinc-400 uppercase"
                  >
                    Selecione a Categoria Inicial
                  </FieldLabel>
                  <select
                    id="categoria"
                    {...register("categoria")}
                    className="border-borda/80 h-10 w-full rounded-xl border bg-zinc-950/60 px-3 text-sm text-xs font-black tracking-wider text-zinc-100 uppercase outline-none focus:border-amber-500"
                  >
                    <option value="NACIONAL" className="bg-zinc-900">
                      Nacionais
                    </option>
                    <option value="INTERNACIONAL" className="bg-zinc-900">
                      Internacionais
                    </option>
                    <option value="PROMOCAO" className="bg-zinc-900">
                      Em Promocao
                    </option>
                  </select>
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="estoque"
                    className="mb-1.5 block text-[10px] font-black tracking-wider text-zinc-400 uppercase"
                  >
                    Quantidade em Estoque
                  </FieldLabel>
                  <Input
                    id="estoque"
                    type="number"
                    placeholder="10"
                    {...register("estoque", { valueAsNumber: true })}
                    className="border-borda/80 h-10 rounded-xl border bg-zinc-950/60 px-3 text-sm text-zinc-100 focus:border-amber-500"
                  />
                  {errors.estoque && (
                    <span className="mt-1 block text-[10px] font-bold tracking-wide text-red-400 uppercase">
                      {errors.estoque.message}
                    </span>
                  )}
                </Field>
              </div>
              <Field>
                <FieldLabel
                  htmlFor="imagem"
                  className="mb-1.5 block text-[10px] font-black tracking-wider text-zinc-400 uppercase"
                >
                  URL da Imagem do Manto
                </FieldLabel>
                <Input
                  id="imagem"
                  placeholder="https://unsplash.com..."
                  {...register("imagem")}
                  className="border-borda/80 h-10 rounded-xl border bg-zinc-950/60 px-3 text-sm text-zinc-100 focus:border-amber-500"
                />
                {errors.imagem && (
                  <span className="mt-1 block text-[10px] font-bold tracking-wide text-red-400 uppercase">
                    {errors.imagem.message}
                  </span>
                )}
              </Field>
              <Button
                type="submit"
                disabled={!isValid}
                className="bg-ouro-metal mt-4 h-12 w-full rounded-xl font-black tracking-wider text-zinc-950 uppercase shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01] hover:cursor-pointer hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-20"
              >
                Confirmar Cadastro de Armadura
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
