import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import { ChevronLeft, ShoppingBag } from "lucide-react";

// 🔌 CONEXÕES DO BANCO DE DADOS REAL
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
// 🟢 CORREÇÃO CRUCIAL: Adicionados todos os sub-componentes do Dialog exigidos no HTML visual
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { abrirCarrinho, adicionarManto } from "@/store/cartSlice";

// Contrato estrito para o TypeScript aceitar os dados vindos do Firebase
interface MantoProduto {
  id: string;
  nome: string;
  precoOriginal: number;
  precoAtual: number;
  imagem: string;
  tag?: string;
  categoria: string;
  estoque: number;
}

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Estados do banco de dados real
  const [produto, setProduto] = useState<MantoProduto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(
    null,
  );
  const [mostrarModalEscolha, setMostrarModalEscolha] = useState(false);

  // 📡 FILTRADOR DINÂMICO DO FIRESTORE
  useEffect(() => {
    const buscarMantoNoBanco = async () => {
      if (!id) return;
      try {
        setCarregando(true);
        const docRef = doc(db, "produtos", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setProduto({
            id: snapshot.id,
            ...snapshot.data(),
          } as MantoProduto);
        } else {
          // Se o ID for inválido, aguarda 2 segundos e joga para a vitrine
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {
        console.error("Erro ao carregar manto do Firestore:", error);
        navigate("/");
      } finally {
        setCarregando(false);
      }
    };

    buscarMantoNoBanco();
  }, [id, navigate]);

  const handleAdicionarAoCarrinho = () => {
    if (!tamanhoSelecionado || !produto) return;

    // Dispara os dados do Firebase direto para o Redux
    dispatch(
      adicionarManto({
        id: produto.id,
        nome: produto.nome,
        precoAtual: produto.precoAtual,
        imagem: produto.imagem,
        tamanho: tamanhoSelecionado,
      }),
    );

    console.log("Manto enviado com sucesso para a sacola global do Redux!");
    setMostrarModalEscolha(true);
  };

  // Tela de transição estática mantida idêntica ao seu padrão original
  if (carregando || !produto) {
    return (
      <div className="bg-fundo relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 text-zinc-100 antialiased">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[80px]" />
        <div className="border-borda/60 bg-painel/30 max-w-sm animate-pulse rounded-2xl border p-8 text-center shadow-xl backdrop-blur-md">
          <h2 className="mb-2 text-lg font-black tracking-wider text-zinc-200 uppercase">
            Sincronizando Manto...
          </h2>
          <p className="text-xs leading-relaxed tracking-widest text-zinc-500 uppercase">
            Conectando com o servidor de dados do Firebase...
          </p>
        </div>
      </div>
    );
  }

  const exibirDesconto = produto.precoOriginal > produto.precoAtual;

  return (
    <div className="bg-fundo relative min-h-screen w-full overflow-hidden text-zinc-100 antialiased">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group mb-8 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase transition-colors hover:text-zinc-100"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Voltar para a vitrine
        </Link>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="bg-painel/20 border-borda relative aspect-[3/4] max-h-[580px] w-full overflow-hidden rounded-2xl border shadow-2xl">
            <img
              src={produto.imagem}
              alt={produto.nome}
              referrerPolicy="no-referrer" // 🟢 Proteção de imagem do Yupoo ativa!
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="flex h-full flex-col justify-center">
            <h1 className="mb-4 text-2xl leading-tight font-black tracking-tight text-zinc-100 uppercase sm:text-4xl">
              {produto.nome}
            </h1>
            <div className="mb-4 flex items-baseline gap-3">
              {exibirDesconto && (
                <span className="font-mono text-base font-bold text-zinc-500 line-through">
                  {produto.precoOriginal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              )}
              <span className="font-mono text-3xl font-black text-amber-400">
                {produto.precoAtual.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <div className="mb-6 text-[11px] font-black tracking-wider uppercase">
              {produto.estoque > 0 ? (
                <span className="text-emerald-400">
                  Armadura em Estoque: {produto.estoque} Unidades Disponíveis
                </span>
              ) : (
                <span className="text-red-400">
                  Produto Esgotado Temporariamente
                </span>
              )}
            </div>

            <p className="border-borda/40 mb-8 border-t pt-6 text-sm leading-relaxed text-zinc-400">
              Manto oficial de alta performance da temporada 2026/2027. Tecido
              ultra-respirável com tecnologia de evaporação de suor, escudo
              bordado em alta definição e acabamento texturizado premium.
              Disponível para reserva online com retirada e pagamento
              presenciais.
            </p>
            <div className="mb-8">
              <label className="mb-4 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                Selecione o Tamanho da Armadura:
              </label>
              <div className="grid max-w-xs grid-cols-4 gap-4">
                {["P", "M", "G", "GG"].map((tamanho) => {
                  const isSelected = tamanhoSelecionado === tamanho;
                  return (
                    <button
                      key={tamanho}
                      type="button"
                      onClick={() => setTamanhoSelecionado(tamanho)}
                      className={`flex h-11 w-full items-center justify-center rounded-xl border text-xs font-black transition-all hover:cursor-pointer ${
                        isSelected
                          ? "border-amber-500 bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20"
                          : "border-borda/80 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
                      }`}
                    >
                      {tamanho}
                    </button>
                  );
                })}
              </div>
            </div>
            <Button
              type="button"
              onClick={handleAdicionarAoCarrinho}
              disabled={!tamanhoSelecionado}
              className="bg-ouro-metal flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl border-0 text-xs font-black tracking-wider text-zinc-950 uppercase hover:cursor-pointer hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-20"
            >
              <ShoppingBag className="h-4 w-4" />
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      </main>
      <Dialog open={mostrarModalEscolha} onOpenChange={setMostrarModalEscolha}>
        <DialogContent className="bg-painel border-borda max-w-sm rounded-2xl text-zinc-100">
          <DialogHeader className="text-left">
            <DialogTitle className="text-base font-black tracking-wide uppercase">
              Manto Adicionado!
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Sua armadura tamanho {tamanhoSelecionado} foi guardada na sacola
              com sucesso.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex gap-3">
            <Button
              onClick={() => setMostrarModalEscolha(false)}
              className="border-borda/60 h-10 flex-1 rounded-xl border bg-zinc-900 text-xs font-bold uppercase hover:cursor-pointer hover:bg-zinc-800"
            >
              Continuar Navegando
            </Button>
            <Button
              onClick={() => {
                setMostrarModalEscolha(false);
                dispatch(abrirCarrinho());
              }}
              className="bg-ouro-metal h-10 flex-1 rounded-xl text-xs font-black text-zinc-950 uppercase hover:cursor-pointer hover:brightness-110"
            >
              Ver Minha Sacola
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
