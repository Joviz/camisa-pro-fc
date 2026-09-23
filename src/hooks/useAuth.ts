import { useDispatch, useSelector } from "react-redux";

import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import type { RootState } from "@/store/store";
import { definirUsuario, limparUsuario } from "@/store/userSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { estaLogado, nome, email, foto, uid, cpf, whatsapp } = useSelector(
    (state: RootState) => state.user,
  );

  const loginComGoogle = async () => {
    try {
      const resultado = await signInWithPopup(auth, googleProvider);
      const user = resultado.user;

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      let dadosCadastro = { cpf: null, whatsapp: null };

      if (userSnap.exists()) {
        const dadosBanco = userSnap.data();
        dadosCadastro.cpf = dadosBanco.cpf || null;
        dadosCadastro.whatsapp = dadosBanco.whatsapp || null;
        console.log("Cadastro antigo localizado no Firestore!");
      } else {
        console.log("Usuário novo sem cadastro prévio no Firestore.");
      }

      dispatch(
        definirUsuario({
          uid: user.uid,
          nome: user.displayName,
          email: user.email,
          foto: user.photoURL,
          cpf: dadosCadastro.cpf,
          whatsapp: dadosCadastro.whatsapp,
        }),
      );

      navigate("/");
    } catch (error) {
      console.error("Erro ao autenticar com o Google no Hook:", error);
    }
  };

  const deslogar = async () => {
    try {
      await signOut(auth);
      dispatch(limparUsuario());
      navigate("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return {
    estaLogado,
    nome,
    email,
    foto,
    uid,
    cpf,
    whatsapp, // 🟢 Exportamos o status de CPF e WhatsApp para as telas usarem
    loginComGoogle,
    deslogar,
  };
};
