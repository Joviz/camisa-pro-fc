import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  nome: string;
  precoAtual: number;
  imagem: string;
  tamanho: string;
  quantidade: number;
}

interface CartState {
  itens: CartItem[];
  carrinhoAberto: boolean;
}

const initialState: CartState = {
  itens: [],
  carrinhoAberto: false,
};

const compararManto = (id: string, tamanho: string) => {
  return (item: CartItem) => item.id === id && item.tamanho === tamanho;
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    adicionarManto: (
      state,
      action: PayloadAction<Omit<CartItem, "quantidade">>,
    ) => {
      const novoManto = action.payload;

      const itemExistente = state.itens.find(
        compararManto(novoManto.id, novoManto.tamanho),
      );

      if (itemExistente) {
        itemExistente.quantidade += 1;
      } else {
        state.itens.push({
          id: novoManto.id,
          nome: novoManto.nome,
          precoAtual: novoManto.precoAtual,
          imagem: novoManto.imagem,
          tamanho: novoManto.tamanho,
          quantidade: 1,
        });
      }
    },

    aumentarQuantidade: (
      state,
      action: PayloadAction<{ id: string; tamanho: string }>,
    ) => {
      const { id, tamanho } = action.payload;

      const item = state.itens.find(compararManto(id, tamanho));
      if (item) {
        item.quantidade += 1;
      }
    },

    diminuirQuantidade: (
      state,
      action: PayloadAction<{ id: string; tamanho: string }>,
    ) => {
      const { id, tamanho } = action.payload;

      const itemIndex = state.itens.findIndex(compararManto(id, tamanho));

      if (itemIndex !== -1) {
        state.itens[itemIndex].quantidade -= 1;

        if (state.itens[itemIndex].quantidade === 0) {
          state.itens.splice(itemIndex, 1);
          console.log("Quantidade zerada. Item excluído do carrinho.");
        }
      }
    },

    removerItem: (
      state,
      action: PayloadAction<{ id: string; tamanho: string }>,
    ) => {
      const { id, tamanho } = action.payload;
      state.itens = state.itens.filter(
        (item) => !(item.id === id && item.tamanho === tamanho),
      );
    },
    limparCarrinho: (state) => {
      state.itens = []; // Esvazia o array completamente voltando ao estado inicial
      console.log("Memória do carrinho resetada com sucesso!");
    },

    abrirCarrinho: (state) => {
      state.carrinhoAberto = true;
    },
    fecharCarrinho: (state) => {
      state.carrinhoAberto = false;
    },
    setCarrinhoAberto: (state, action: PayloadAction<boolean>) => {
      state.carrinhoAberto = action.payload;
    },
  },
});

export const {
  adicionarManto,
  aumentarQuantidade,
  diminuirQuantidade,
  removerItem,
  abrirCarrinho,
  fecharCarrinho,
  setCarrinhoAberto,
  limparCarrinho,
} = cartSlice.actions;
export default cartSlice.reducer;
