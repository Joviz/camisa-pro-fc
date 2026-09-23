import { ClipboardList } from "lucide-react";

import { Link } from "react-router-dom";

interface FilterBarProps {
  categoriaAtiva: string;
  onMudarCategoria: (categoria: string) => void;
}

export const FilterBar = ({
  categoriaAtiva,
  onMudarCategoria,
}: FilterBarProps) => {
  const CATEGORIAS = [
    { id: "TODOS", label: "Todos os Mantos" },
    { id: "PROMOCAO", label: "Em Promocao" },
    { id: "NACIONAL", label: "Nacionais" },
    { id: "INTERNACIONAL", label: "Internacionais" },
  ];

  return (
    <div className="border-borda/40 w-full scrollbar-none overflow-x-auto border-b bg-zinc-950">
      <div className="flex h-12 w-full items-center justify-between gap-6 px-0 text-xs font-bold tracking-widest whitespace-nowrap uppercase">
        <div className="flex h-full items-center gap-6 pl-6">
          {CATEGORIAS.map((cat) => {
            const isSelected = categoriaAtiva === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onMudarCategoria(cat.id)}
                className={`relative flex h-full items-center transition-colors hover:cursor-pointer hover:text-zinc-100 ${
                  isSelected ? "font-black text-amber-400" : "text-zinc-400"
                }`}
              >
                {cat.label}
                {isSelected && (
                  <span className="absolute right-0 bottom-0 left-0 h-[2px] rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
        <Link
          to="/meus-pedidos"
          className="group border-borda/40 flex h-full items-center gap-2 border-l pr-6 pl-6 text-zinc-400 transition-colors hover:cursor-pointer hover:text-amber-400"
        >
          <ClipboardList className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-amber-500" />
          <span className="text-[11px] font-bold tracking-wider uppercase">
            Meus Pedidos
          </span>
        </Link>
      </div>
    </div>
  );
};
