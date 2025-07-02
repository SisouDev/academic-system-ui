# 🎓 Academic System - UI

<img src="https://img.shields.io/badge/Vite-^4.0-blueviolet?logo=vite" />
<img src="https://img.shields.io/badge/React-18.x-61dafb?logo=react" />
<img src="https://img.shields.io/badge/TypeScript-^5.0-3178c6?logo=typescript" />
<img src="https://img.shields.io/badge/TanStack_Query-v4-ff4154?logo=react-query" />
<img src="https://img.shields.io/badge/React_Router-v6-CA4245?logo=reactrouter" />
<img src="https://img.shields.io/badge/Axios-HTTP-5A29E4?logo=axios" />
<img src="https://img.shields.io/badge/Yup+React_Hook_Form-Form%20Validation-ff69b4" />
<img src="https://img.shields.io/badge/ESLint-Quality-blue?logo=eslint" />

---

## 🚀 Visão Geral

Sistema de front-end moderno e tipado, construído com React + TypeScript + Vite, que consome a [API REST](https://github.com/SisouDev/academic-api) do sistema acadêmico. A aplicação oferece autenticação JWT, controle de acesso por papéis (RBAC), e gerenciamento completo de entidades como estudantes, professores e cursos.

---

## 🧠 Filosofia do Projeto

- **Separação clara de responsabilidades** entre estado do cliente (autenticação) e estado do servidor (dados da API).
- **Componentização reutilizável**, com forte aderência ao princípio DRY.
- **Gerenciamento de estado moderno** com TanStack Query (React Query).
- **Segurança e controle de acesso** centralizados no componente `ProtectedRoute`.
- **Tipagem forte com TypeScript** para segurança e manutenção do código.

---

## 🛠 Tecnologias Utilizadas

| Ferramenta | Propósito |
|-----------|-----------|
| `Vite` | Build tool para apps React modernos. |
| `React` + `TypeScript` | Core da aplicação com tipagem estática. |
| `TanStack Query` | Gerenciamento de dados assíncronos da API. |
| `Context API` | Autenticação global com persistência via localStorage. |
| `Axios` | HTTP Client com interceptadores para JWT. |
| `React Router` | Navegação declarativa e proteção de rotas. |
| `React Hook Form` + `Yup` | Validação e controle de formulários. |
| `UIkit` + `Sass` | Estilização customizada e componentizada. |
| `ESLint` | Padronização de código e linting. |

---

## ⚙️ Setup do Projeto

### Pré-requisitos

- Node.js `18+`
- NPM ou Yarn
- API Backend rodando: [`academic-api`](https://github.com/SisouDev/academic-api)

### Instalação

```bash
git clone https://github.com/SisouDev/academic-system-ui.git
cd academic-system-ui
npm install
```
### Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_API_BASE_URL=http://localhost:8080
```
### Rodar aplicação local

```bash
npm run dev
```
### Estrutura de Pastas
```plaintext
src/
├── assets/            Imagens, fontes etc.
├── components/        Componentes reutilizáveis
├── contexts/          Ex: AuthContext
├── hooks/             Hooks customizados
├── layouts/           Ex: DashboardLayout
├── pages/             Dividido por domínio (auth, student, admin)
├── routes/            Roteamento centralizado
├── services/          Axios + interceptadores
├── styles/            Estilos globais (Sass)
├── types/             Tipos globais do projeto
├── App.tsx            Provider + Router + QueryClient
└── main.tsx           Ponto de entrada
```
### Controle de Acesso e Autenticação
```AuthContext.tsx:``` gerencia login/logout, persistência de token e role.

```ProtectedRoute.tsx:``` Higher-Order Component para bloquear acesso a rotas não permitidas.

Interceptadores do ```Axios```:

Request → insere ```Authorization: Bearer <token>```.

Response → se 401, executa ```signOut()``` automaticament

### Comunicação com a API (TanStack Query)
Utiliza hooks como `useQuery` e `useMutation` para buscar e manipular dados. Exemplo:

### Componentes-Chave
| Componente           | Descrição                                                 |
| -------------------- | --------------------------------------------------------- |
| `AuthContext.tsx`    | Autenticação e persistência via localStorage.             |
| `DataTable.tsx`      | Tabela genérica com paginação, ações e colunas dinâmicas. |
| `ProtectedRoute.tsx` | Verifica autenticação e RBAC.                             |
| `api.ts`             | Axios configurado com interceptadores.                    |

### Funcionalidades Implementadas
Autenticação
**Login** com validação de formulário.

**Sessão persistente** via JWT.

Logout automático ao receber erro 401.

**Controle de Acesso**
RBAC: controle de rotas por roles (```ROLE_ADMIN```, etc.).

**Redirecionamento** para ```/login``` ou ```/unauthorized```.

**Dashboard**
Exibe dados agregados conforme role do usuário.

**CRUD**
Alunos: listagem, criação, edição e ativação/desativação.

**Professores**: listagem e cadastro.


## Roadmap (To-do)
- [ ] Concluir os módulos de Professores e Alunos.
- [ ] Adicionar histórico de atividades.
- [ ] Criar testes com Vitest + Testing Library.
- [ ] Melhorar UX/UI com feedbacks visuais.
- [ ] Internacionalização (i18n).

## Como Contribuir
### Faça um fork
git checkout -b feature/nova-feature

### Desenvolva e comite
git commit -m "feat: Nova funcionalidade"

### Envie sua branch
git push origin feature/nova-feature

