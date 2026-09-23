import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const PRODUTOS_PARA_INJETAR = [
  {
    nome: "Camisa Real Madrid Home 26/27 - Torcedor",
    precoOriginal: 399.9,
    precoAtual: 349.9,
    imagem: "https://unsplash.com",
    tag: "Mais Vendido",
    categoria: "INTERNACIONAL",
    estoque: 15,
  },
  {
    nome: "Camisa Flamengo Home 26/27 - Jogador",
    precoOriginal: 499.9,
    precoAtual: 499.9,
    imagem: "https://unsplash.com",
    tag: "Lancamento",
    categoria: "NACIONAL",
    estoque: 20,
  },
  {
    nome: "Camisa Barcelona Away 26/27 - Premium",
    precoOriginal: 399.9,
    precoAtual: 299.9,
    imagem: "https://unsplash.com",
    tag: "30% OFF",
    categoria: "INTERNACIONAL",
    estoque: 12,
  },
  {
    nome: "Camisa Seleção Brasileira Retrô 1970",
    precoOriginal: 299.9,
    precoAtual: 249.9,
    imagem: "https://unsplash.com",
    tag: "Classico",
    categoria: "PROMOCAO",
    estoque: 8,
  },
  {
    nome: "Camisa Manchester City Home 26/27",
    precoOriginal: 399.9,
    precoAtual: 399.9,
    imagem: "https://unsplash.com",
    categoria: "INTERNACIONAL",
    estoque: 25,
  },
  {
    nome: "Camisa Palmeiras Home 26/27",
    precoOriginal: 349.9,
    precoAtual: 299.9,
    imagem: "https://unsplash.com",
    tag: "Oferta",
    categoria: "NACIONAL",
    estoque: 18,
  },
  {
    nome: "Camisa Inter de Milão Home 26/27",
    precoOriginal: 399.9,
    precoAtual: 199.9,
    imagem: "https://unsplash.com",
    tag: "Metade do Preco",
    categoria: "PROMOCAO",
    estoque: 30,
  },
  {
    nome: "Camisa Argentina Três Estrelas Qatar",
    precoOriginal: 449.9,
    precoAtual: 449.9,
    imagem: "https://unsplash.com",
    tag: "Campeao",
    categoria: "INTERNACIONAL",
    estoque: 14,
  },
  {
    nome: "Camisa Milan Black Special Edition",
    precoOriginal: 419.9,
    precoAtual: 379.9,
    imagem: "https://unsplash.com",
    tag: "Exclusivo",
    categoria: "INTERNACIONAL",
    estoque: 10,
  },
  {
    nome: "Camisa São Paulo Retrô Mundial 1992",
    precoOriginal: 299.9,
    precoAtual: 299.9,
    imagem: "https://unsplash.com",
    categoria: "NACIONAL",
    estoque: 16,
  },
  {
    nome: "Camisa Arsenal Away Pink Edition",
    precoOriginal: 399.9,
    precoAtual: 329.9,
    imagem: "https://unsplash.com",
    tag: "Ultimas Unidades",
    categoria: "PROMOCAO",
    estoque: 5,
  },
  {
    nome: "Camisa Juventus Home 26/27 - Classica",
    precoOriginal: 389.9,
    precoAtual: 349.9,
    imagem: "https://unsplash.com",
    categoria: "INTERNACIONAL",
    estoque: 22,
  },
];

export const popularBancoDeDadosMantos = async () => {
  try {
    const produtosRef = collection(db, "produtos");

    const snapshotExistente = await getDocs(produtosRef);
    if (!snapshotExistente.empty) {
      console.log(
        "Banco de dados ja possui camisas. Migracao cancelada por seguranca.",
      );
      return { sucesso: false, msg: "O banco ja contem produtos cadastrados." };
    }

    console.log("Iniciando populacao automatica de mantos no Firestore...");

    for (const manto of PRODUTOS_PARA_INJETAR) {
      await addDoc(produtosRef, {
        ...manto,
        criadoEm: serverTimestamp(),
      });
    }

    console.log(
      "Sucesso total! Os 12 mantos oficiais foram soldados na nuvem com exito!",
    );
    return { sucesso: true, msg: "12 mantos injetados com sucesso!" };
  } catch (error) {
    console.error(
      "Erro critico durante a injeção do seeder no Firebase:",
      error,
    );
    return { sucesso: false, erro: error };
  }
};
