import { useInitializeAuth } from "@/hooks/useInitializeAuth";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RotaAdmin } from "@/components/RotaAdmin";
import { RotaProtegida } from "@/components/RotaProtegida";

import { Admin } from "./pages/Admin";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { MeusPedidos } from "./pages/MeusPedidos";
import { ProductDetail } from "./pages/ProductDetail";

export default function App() {
  useInitializeAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produto/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/meus-pedidos"
          element={
            <RotaProtegida>
              <MeusPedidos />
            </RotaProtegida>
          }
        />
        <Route
          path="/admin"
          element={
            <RotaAdmin>
              <Admin />
            </RotaAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
