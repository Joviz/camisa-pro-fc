import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import {
  type MantoProduto,
  listarMantosDoFirestore,
} from "@/services/produtoService";

import { Banner } from "@/components/Banner";
import { CardManto } from "@/components/CardManto";
import { FilterBar } from "@/components/FilterBar";
import { Header } from "@/components/Header";

import type { RootState } from "@/store/store";

export const Home = () => {
  const [categoriaFiltrada, setCategoriaFiltrada] = useState("TODOS");
  const termoConfirmado = useSelector(
    (state: RootState) => state.search.termoConfirmado,
  );

  const [mantosBanco, setMantosBanco] = useState<MantoProduto[]>([]);
  const [carregandoCatalogo, setCarregandoCatalogo] = useState(true);

  useEffect(() => {
    const buscarProdutosDoFirebase = async () => {
      try {
        setCarregandoCatalogo(true);
        const dados = await listarMantosDoFirestore();
        setMantosBanco(dados);
      } catch (error) {
        console.error(
          "Erro critico ao sincronizar vitrine com o Firestore:",
          error,
        );
      } finally {
        setCarregandoCatalogo(false);
      }
    };

    buscarProdutosDoFirebase();
  }, []);

  const mantosExibidos = mantosBanco.filter((manto) => {
    const bateCategoria =
      categoriaFiltrada === "TODOS" || manto.categoria === categoriaFiltrada;
    const batePesquisa = manto.nome
      .toLowerCase()
      .includes(termoConfirmado.toLowerCase());
    return bateCategoria && batePesquisa;
  });

  return (
    <div className="bg-fundo min-h-screen w-full text-zinc-100 antialiased select-none">
      <Header />

      <FilterBar
        categoriaAtiva={categoriaFiltrada}
        onMudarCategoria={setCategoriaFiltrada}
      />

      <Banner />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {carregandoCatalogo ? (
          <div className="flex h-64 animate-pulse items-center justify-center text-xs font-black tracking-[0.2em] text-zinc-500 uppercase">
            Sincronizando vitrine com a nuvem...
          </div>
        ) : mantosExibidos.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-sm font-bold tracking-widest text-zinc-500 uppercase">
            Nenhum manto encontrado para a sua busca
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {mantosExibidos.map((manto) => (
              <CardManto
                key={manto.id}
                produto={{
                  ...manto,
                  id: manto.id || "", // Garante ao TypeScript que o ID nunca vira undefined
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
