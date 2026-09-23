const fs = require("fs");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./chave-firebase.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function dispararCargaEmMassa() {
  try {
    console.log("Lendo arquivo de dados produtos_iniciais.json...");

    const dadosBrutos = fs.readFileSync("./produtos_iniciais.json", "utf8");
    const produtos = JSON.parse(dadosBrutos);

    console.log(
      `Detectados ${produtos.length} mantos oficiais no JSON. Conectando ao Firestore...`,
    );
    const produtosRef = db.collection("produtos");

    for (const manto of produtos) {
      await produtosRef.add({
        ...manto,
        criadoEm: new Date(), // Carimbo de hora nativo do servidor
      });
    }

    console.log(
      "SUCESSO TOTAL! As 12 camisas do seu JSON foram injetadas no Firebase!",
    );
    process.exit(0);
  } catch (error) {
    console.error(
      "Erro critico durante a transmissao dos dados para a nuvem:",
      error,
    );
    process.exit(1);
  }
}

dispararCargaEmMassa();
