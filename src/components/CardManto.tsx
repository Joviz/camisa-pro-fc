import { Link } from "react-router-dom";

interface MantoProps {
  id: string;
  nome: string;
  precoOriginal: number;
  precoAtual: number;
  imagem: string;
  tag?: string;
  categoria: string;
}

interface CardMantoProps {
  produto: MantoProps;
}

export const CardManto = ({ produto }: CardMantoProps) => {
  const temDesconto = produto.precoOriginal > produto.precoAtual;
  const porcentagemDesconto = temDesconto
    ? Math.round(
        ((produto.precoOriginal - produto.precoAtual) / produto.precoOriginal) *
          100,
      )
    : 0;

  return (
    <Link
      to={`/produto/${produto.id}`}
      className="group bg-painel/40 border-borda flex w-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:cursor-pointer hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/2"
    >
      <div className="border-borda/30 relative aspect-3/4 w-full overflow-hidden border-b bg-zinc-950/40">
        {temDesconto && (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-black tracking-wider text-zinc-100 uppercase shadow-md">
            -{porcentagemDesconto}% OFF 🔥
          </span>
        )}
        {produto.tag && !temDesconto && (
          <span className="bg-ouro-metal absolute top-3 left-3 z-10 rounded-md px-2 py-0.5 text-[10px] font-black tracking-wider text-zinc-950 uppercase shadow-md">
            {produto.tag}
          </span>
        )}

        <img
          src={`https://weserv.nl{encodeURIComponent(produto.imagem)}&default=ssl`}
          alt={produto.nome}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <h4 className="line-clamp-2 text-sm font-semibold tracking-wide text-zinc-200 uppercase transition-colors group-hover:text-zinc-100">
          {produto.nome}
        </h4>

        <div className="mt-auto flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
          <span
            className={`text-base font-bold ${temDesconto ? "font-extrabold text-amber-400" : "text-zinc-100"}`}
          >
            {produto.precoAtual.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>

          {temDesconto && (
            <span className="text-xs font-medium text-zinc-500 line-through">
              {produto.precoOriginal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
