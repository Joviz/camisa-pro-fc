import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface SearchState {
  termo: string; // Guarda o texto provisório enquanto o usuário digita
  termoConfirmado: string; // 🟢 Só muda quando clica na lupa ou dá Enter!
}

const initialState: SearchState = {
  termo: "",
  termoConfirmado: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    definirTermoBusca: (state, action: PayloadAction<string>) => {
      state.termo = action.payload;
    },

    dispararBuscaOficial: (state) => {
      state.termoConfirmado = state.termo;
    },

    limparBusca: (state) => {
      state.termo = "";
      state.termoConfirmado = "";
    },
  },
});

export const { definirTermoBusca, dispararBuscaOficial, limparBusca } =
  searchSlice.actions;
export default searchSlice.reducer;
