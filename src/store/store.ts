import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./cartSlice";
import searchReducer from "./searchSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    search: searchReducer, // 🟢 2. Plugamos o cabo no processador central!
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
