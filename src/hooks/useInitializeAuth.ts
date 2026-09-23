import { useEffect } from "react";

import { useDispatch } from "react-redux";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { definirUsuario, limparUsuario } from "@/store/userSlice";

export const useInitializeAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const descadastrarEscuta = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let cpfSalvo = null;
        let whatsappSalvo = null;

        try {
          const userRef = doc(db, "usuarios", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const dadosBanco = userSnap.data();
            cpfSalvo = dadosBanco.cpf || null;
            whatsappSalvo = dadosBanco.whatsapp || null;
            console.log(
              "Persistência ativa: CPF e WhatsApp resgatados do Firestore com sucesso!",
            );
          }
        } catch (error) {
          console.error(
            "Erro ao resgatar persistência do Firestore no hook:",
            error,
          );
        }

        dispatch(
          definirUsuario({
            uid: user.uid,
            nome: user.displayName,
            email: user.email,
            foto: user.photoURL,
            cpf: cpfSalvo,
            whatsapp: whatsappSalvo,
          }),
        );
      } else {
        dispatch(limparUsuario());
      }
    });

    return () => descadastrarEscuta();
  }, [dispatch]);
};
