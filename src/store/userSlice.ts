import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface UsuarioState {
  estaLogado: boolean;
  carregandoAutenticacao: boolean; // 🟢 Nova chave para controlar o loading do F5
  uid: string | null;
  nome: string | null;
  email: string | null;
  foto: string | null;
  cpf: string | null;
  whatsapp: string | null;
}

const initialState: UsuarioState = {
  estaLogado: false,
  carregandoAutenticacao: true, // Começa como true porque o app nasce checando o token
  uid: null,
  nome: null,
  email: null,
  foto: null,
  cpf: null,
  whatsapp: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    definirUsuario: (
      state,
      action: PayloadAction<{
        uid: string;
        nome: string | null;
        email: string | null;
        foto: string | null;
        cpf?: string | null;
        whatsapp?: string | null;
      }>,
    ) => {
      state.estaLogado = true;
      state.carregandoAutenticacao = false; // 🟢 Terminou de checar e o user está logado
      state.uid = action.payload.uid;
      state.nome = action.payload.nome;
      state.email = action.payload.email;
      state.foto = action.payload.foto;
      state.cpf = action.payload.cpf ?? null;
      state.whatsapp = action.payload.whatsapp ?? null;
    },

    limparUsuario: (state) => {
      state.estaLogado = false;
      state.carregandoAutenticacao = false; // 🟢 Terminou de checar e o user está deslogado
      state.uid = null;
      state.nome = null;
      state.email = null;
      state.foto = null;
      state.cpf = null;
      state.whatsapp = null;
    },
  },
});

export const { definirUsuario, limparUsuario } = userSlice.actions;
export default userSlice.reducer;
