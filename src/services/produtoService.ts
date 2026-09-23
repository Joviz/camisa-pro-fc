import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

export interface MantoProduto {
  id?: string;
  nome: string;
  precoOriginal: number;
  precoAtual: number;
  imagem: string;
  tag?: string;
  categoria: "NACIONAL" | "INTERNACIONAL" | "PROMOCAO"; // Travado estrito em caixa alta
  estoque: number; // 🟢 Controle físico de peças na prateleira
}

export const cadastrarNovoManto = async (manto: Omit<MantoProduto, "id">) => {
  try {
    const produtosRef = collection(db, "produtos");
    const docRef = await addDoc(produtosRef, {
      ...manto,
      criadoEm: serverTimestamp(), // Registra o segundo exato do cadastro
    });

    console.log("Manto cadastrado com sucesso no Firestore! ID:", docRef.id);
    return { sucesso: true, idProduto: docRef.id };
  } catch (error) {
    console.error("Erro critico ao cadastrar manto no Firestore:", error);
    return { sucesso: false, erro: error };
  }
};

export const atualizarDadosDoManto = async (
  idProduto: string,
  dadosAtualizados: Partial<MantoProduto>,
) => {
  try {
    const produtoRef = doc(db, "produtos", idProduto);

    await updateDoc(produtoRef, {
      ...dadosAtualizados,
      atualizadoEm: serverTimestamp(),
    });

    console.log(`Manto ${idProduto} atualizado com sucesso no banco de dados!`);
    return { sucesso: true };
  } catch (error) {
    console.error(
      "Erro ao tentar atualizar documento do manto no Firestore:",
      error,
    );
    return { sucesso: false, erro: error };
  }
};

export const listarMantosDoFirestore = async (): Promise<MantoProduto[]> => {
  try {
    const produtosRef = collection(db, "produtos");
    const snapshot = await getDocs(produtosRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MantoProduto[];
  } catch (error) {
    console.error("Erro ao listar mantos do Firestore:", error);
    return [];
  }
};
