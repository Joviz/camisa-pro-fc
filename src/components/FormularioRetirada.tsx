import { useDispatch, useSelector } from "react-redux";

import {
  type RetiradaFormData,
  retiradaSchema,
} from "@/schemas/retiradaSchema";
import { processarAgendamentoRetirada } from "@/services/pedidoService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { limparCarrinho, setCarrinhoAberto } from "@/store/cartSlice";
import type { RootState } from "@/store/store";

import { Button } from "./ui/button";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

interface FormularioRetiradaProps {
  totalPreco: string;
}

export const FormularioRetirada = ({ totalPreco }: FormularioRetiradaProps) => {
  const dispatch = useDispatch();

  const itensCarrinho = useSelector((state: RootState) => state.cart.itens);
  const usuario = useSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RetiradaFormData>({
    resolver: zodResolver(retiradaSchema),
    mode: "onChange",
  });

  const onSubmit = async (dados: RetiradaFormData) => {
    if (!usuario.uid) return;
    const clienteConfirmou = window.confirm(
      "Confirmacao de Agendamento:\n\nApos realizada a encomenda, nao sera possivel realizar o cancelamento.\n\nDeseja continuar?",
    );

    if (!clienteConfirmou) {
      console.log(
        "Agendamento abortado pelo usuario no pop-up de confirmacao.",
      );
      return;
    }
    console.log("Iniciando gravação dupla na nuvem...");

    const resultado = await processarAgendamentoRetirada({
      usuarioUid: usuario.uid,
      clienteNome: dados.nome,
      clienteCpf: dados.cpf,
      clienteWhatsapp: dados.whatsapp,
      itens: itensCarrinho, // Injeta todas as camisas do Redux no documento do pedido
    });

    if (resultado.sucesso) {
      alert(
        `Manto Reservado com Sucesso! Código do Pedido: ${resultado.idPedido}`,
      );
      dispatch(limparCarrinho());
      dispatch(setCarrinhoAberto(false)); // Fecha o painel lateral de forma elegante
    } else {
      alert("Falha de rede ao tentar agendar. Verifique a conexão.");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-borda/40 bg-painel space-y-4 border-t pt-4"
    >
      <Field>
        <FieldLabel
          htmlFor="nome"
          className="mb-1.5 block text-[10px] font-black tracking-wider text-zinc-400 uppercase"
        >
          Nome do Titular da Retirada
        </FieldLabel>
        <Input
          id="nome"
          placeholder="Digite seu nome completo"
          {...register("nome")}
          className={`h-10 rounded-xl border bg-zinc-950/60 px-3 text-sm text-zinc-100 focus:border-amber-500 ${
            errors.nome ? "border-red-500/60" : "border-borda/80"
          }`}
        />
        {errors.nome && (
          <span className="mt-1 block text-[10px] font-bold tracking-wide text-red-400 uppercase">
            {errors.nome.message}
          </span>
        )}
      </Field>
      <Field>
        <FieldLabel
          htmlFor="cpf"
          className="mb-1.5 block text-[10px] font-black tracking-wider text-zinc-400 uppercase"
        >
          CPF para Validação
        </FieldLabel>
        <Input
          id="cpf"
          placeholder="000.000.000-00"
          {...register("cpf")}
          className={`h-10 rounded-xl border bg-zinc-950/60 px-3 text-sm text-zinc-100 focus:border-amber-500 ${
            errors.cpf ? "border-red-500/60" : "border-borda/80"
          }`}
        />
        {errors.cpf && (
          <span className="mt-1 block text-[10px] font-bold tracking-wide text-red-400 uppercase">
            {errors.cpf.message}
          </span>
        )}
      </Field>
      <Field>
        <FieldLabel
          htmlFor="whatsapp"
          className="mb-1.5 block text-[10px] font-black tracking-wider text-zinc-400 uppercase"
        >
          WhatsApp para Notificação
        </FieldLabel>
        <Input
          id="whatsapp"
          placeholder="(11) 99999-9999"
          {...register("whatsapp")}
          className={`h-10 rounded-xl border bg-zinc-950/60 px-3 text-sm text-zinc-100 focus:border-amber-500 ${
            errors.whatsapp ? "border-red-500/60" : "border-borda/80"
          }`}
        />
        {errors.whatsapp && (
          <span className="mt-1 block text-[10px] font-bold tracking-wide text-red-400 uppercase">
            {errors.whatsapp.message}
          </span>
        )}
      </Field>
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs font-bold tracking-wider text-zinc-400 uppercase">
          <span>Total a pagar na retirada:</span>
          <span className="text-base font-black text-amber-400">
            {totalPreco}
          </span>
        </div>
        <Button
          type="submit"
          disabled={!isValid}
          className="bg-ouro-metal h-12 w-full rounded-xl font-black tracking-wider text-zinc-950 uppercase shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01] hover:cursor-pointer hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:scale-100 disabled:hover:brightness-100"
        >
          Finalizar Agendamento
        </Button>
      </div>
    </form>
  );
};
