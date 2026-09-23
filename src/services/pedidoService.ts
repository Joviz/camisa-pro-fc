import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

interface ItemCarrinho {
  id: string;
  nome: string;
  precoAtual: number;
  tamanho: string;
  quantidade: number;
}

interface DadosAgendamento {
  usuarioUid: string;
  clienteNome: string;
  clienteCpf: string;
  clienteWhatsapp: string;
  itens: ItemCarrinho[];
}

export const atualizarStatusDoPedido = async (
  idPedido: string,
  novoStatus: "Pendente" | "Pronto para Retirada" | "Entregue",
) => {
  try {
    const pedidoRef = doc(db, "pedidos", idPedido);

    await updateDoc(pedidoRef, {
      status: novoStatus,
      atualizadoEm: serverTimestamp(), // Carimbo de hora oficial do servidor do lojista
    });

    console.log(
      `Status do pedido ${idPedido} alterado com sucesso para ${novoStatus}`,
    );
    return { sucesso: true };
  } catch (error) {
    console.error(
      "Erro critico ao tentar atualizar status do pedido no Firestore:",
      error,
    );
    return { sucesso: false, erro: error };
  }
};

export const processarAgendamentoRetirada = async (dados: DadosAgendamento) => {
  try {
    const usuarioRef = doc(db, "usuarios", dados.usuarioUid);
    await setDoc(
      usuarioRef,
      {
        nome: dados.clienteNome,
        cpf: dados.clienteCpf,
        whatsapp: dados.clienteWhatsapp,
        atualizadoEm: serverTimestamp(),
      },
      { merge: true },
    );

    const pedidosRef = collection(db, "pedidos");
    const docPedido = await addDoc(pedidosRef, {
      usuarioUid: dados.usuarioUid,
      clienteNome: dados.clienteNome,
      clienteCpf: dados.clienteCpf,
      clienteWhatsapp: dados.clienteWhatsapp,
      itens: dados.itens,
      status: "Pendente",
      criadoEm: serverTimestamp(),
    });

    console.log(
      "Transação concluída com sucesso! Pedido gerado:",
      docPedido.id,
    );
    return { sucesso: true, idPedido: docPedido.id };
  } catch (error) {
    console.error("Erro crítico na transação do Firebase:", error);
    return { sucesso: false, erro: error };
  }
};
