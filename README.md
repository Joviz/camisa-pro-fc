### ⚽ CamisaProFC — E-commerce Serverless de Alta Performance para Mantos Esportivos

**Status do Projeto:** 🚀 Publicado e 100% Operacional em Produção.
**Link de Produção:** [Visualizar Aplicação na Vercel](/url?sa=i&source=web&rct=j&url=https://camisa-pro-fc.vercel.app&ved=2ahUKEwiK8r2p6qWXAxXqCbkGHTo9LsMQg5wRegkIAggBCJwMEAc&opi=89978449&cd&psig=AOvVaw14v-hOuX5HF2joHTa149W0&ust=1791391181494000) 

### 🎯 O Desafio de Negócio & Utilidade Comercial

No mercado de e-commerce de vestuário esportivo e importações, a volatilidade de estoque e a velocidade de atualização do catálogo determinam o faturamento da empresa. Cadastrar produtos manualmente via código ou depender de plataformas engessadas atrasa o time-to-market. 

O **CamisaProFC** foi arquitetado para resolver essa dor. Trata-se de uma plataforma **Full-Stack Jamstack** ultra-veloz, onde o lojista possui total autonomia. O sistema elimina a necessidade de infraestruturas caras de servidores tradicionais, adotando uma abordagem **Totalmente Serverless** que reduz o custo operacional de hospedagem para **R$ 0,00**, aguentando picos massivos de acessos sem engasgar. 

### ⚡ Diferenciais Técnicos Arquitetados (Foco em Engenharia)

* **Padrão Jamstack de Alta Performance:** Desenvolvido com **Vite + React + TypeScript**, garantindo um carregamento de página em milissegundos e uma experiência de transição fluida (*Single Page Application*).
* **Gerenciamento de Estado Previsível:** Utilização do **Redux Toolkit** para gerenciar a sacola global de compras, garantindo sincronia imediata entre a vitrine, a página de detalhes e o carrinho lateral, sem renderizações desnecessárias (*re-renders*).
* **Banco de Dados NoSQL em Tempo Real:** Conexão nativa com o **Google Firebase Cloud Firestore**, permitindo reatividade imediata. Mudanças de preço ou estoque refletem nas telas dos clientes instantaneamente sem necessidade de atualizar a página.
* **Pipeline de Carga Automatizada (DevOps):** Desenvolvimento de scripts customizados em **Node.js (CommonJS/ESM Bridge)** utilizando o **Firebase Admin SDK** para migração e semeadura automática de dados corporativos (*Database Seeding*) via arquivos estruturados .json.
* **Solução de Contorno para Hotlinking & CORS (Resiliência):** Arquitetura adaptada para contornar bloqueios rígidos de firewalls de imagens de fornecedores terceiros, implementando um pipeline de upload em background integrado a servidores de mídia dedicados através de chamadas assíncronas à APIs REST.

### 📂 Estrutura de Arquitetura do Projeto

A organização de pastas segue o padrão de escalabilidade corporativa: 

text

├── .github/               # Workflows de CI/CD
├── src/
│   ├── @types/            # Contratos e definições estritas de tipos TypeScript
│   ├── components/        # Componentes isolados e reutilizáveis (Header, SacolaLateral, etc.)
│   ├── data/              # Base de dados estática de fábrica (produtos_iniciais.json)
│   ├── lib/               # Inicialização de SDKs externos (Firebase Core Config)
│   ├── pages/             # Componentes de páginas de rota (Home, ProductDetail, Admin)
│   ├── services/          # Camada de isolamento de chamadas à APIs e persistência no Firestore
│   ├── store/             # Configuração global do Redux Toolkit (Slices e Hooks)
│   ├── App.tsx            # Roteador centralizado da aplicação
│   └── main.tsx           # Ponto de entrada e boot do ecossistema React
├── vercel.json            # Configuração de rewrites para suporte nativo a rotas SPA no servidor
└── package.json           # Manifesto de dependências e scripts de automação do Vite

Use o código com cuidado.

### 💼 O Painel Administrativo (Autonomia do Lojista)

O projeto conta com um ecossistema interno exclusivo para o administrador da loja, focado em **estratégia de vendas**: 

1. **Controle Financeiro de Linha:** Inputs reativos que calculam se o produto possui desconto. Se o precoOriginal for maior que o precoAtual, a interface do cliente renderiza de forma automatizada o preço antigo riscado com a tag de oferta.
2. **Estratégia de Backorder (Venda Sem Barreiras):** O botão de compras foi estrategicamente destravado para aceitar encomendas mesmo com o estoque zerado, permitindo que a loja funcione em formato de reserva sob demanda (Garantia de conversão).
3. **Gestão Instantânea:** Tabela dinâmica que permite reclassificar categorias (Nacionais, Internacionais, Promoções) e atualizar quantidades com um clique, disparando atualizações updateDoc atômicas na nuvem.

### 🛠️ Tecnologias Utilizadas

* **Front-End:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Radix UI (Shadcn/Dialog).
* **Gerenciamento de Estado:** Redux Toolkit.
* **Back-End & Nuvem:** Firebase Auth, Cloud Firestore NoSQL, Vercel Serverless Hosting.
* **Ferramentas & DevOps:** Node.js v24, Vite Compiler, Git/GitHub, Expressões Regulares avançadas para refatoração.

### 🚀 Como Executar o Projeto Localmente

1. Clone o repositório seguro: 

bash

git clone https://github.com/Joviz/camisa-pro-fc.git
cd camisa-pro-fc

Use o código com cuidado.
2. Instale as dependências de mercado: 

bash

npm install

Use o código com cuidado.
3. Execute o ambiente de desenvolvimento local: 

bash

npm run dev

Use o código com cuidado.
4. Para rodar a carga em massa de produtos via terminal no banco de dados: 

bash

node importar_catalogo.cjs

Use o código com cuidado.

### 👨‍💻 Autor

Desenvolvido com foco em engenharia de software e performance por **Giovane**. 

*Este projeto foi construído do zero, validando conceitos de segurança da informação (proteção de chaves via .gitignore e chaves de ambiente na Vercel), Clean Code e responsividade em múltiplos dispositivos.*
