import { useEffect, useRef } from "react";

import { useDispatch } from "react-redux";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { fecharCarrinho, limparCarrinho } from "@/store/cartSlice";
import { definirUsuario, limparUsuario } from "@/store/userSlice";

export const useInitializeAuth = () => {
  const dispatch = useDispatch();
  // Guarda o uid da sessão anterior para detectar logout / troca de conta
  const uidAnteriorRef = useRef<string | null>(null);

  useEffect(() => {
    const descadastrarEscuta = onAuthStateChanged(auth, async (user) => {
      const uidAtual = user?.uid ?? null;
      const uidAnterior = uidAnteriorRef.current;

      // Havia um usuário logado e agora é outro (ou nenhum): o carrinho
      // pertencia à conta anterior e não pode aparecer para a nova.
      // Visitante (null) -> login mantém o carrinho montado antes do login.
      if (uidAnterior && uidAnterior !== uidAtual) {
        dispatch(limparCarrinho());
        dispatch(fecharCarrinho());
      }
      uidAnteriorRef.current = uidAtual;

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
