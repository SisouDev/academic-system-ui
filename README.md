# 🎓 Academic System - Frontend

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?logo=vite&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-%23CC6699?logo=sass&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer--Motion-Animações-black?logo=framer&label=Animations)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)

## 📘 Sobre o Projeto

Este repositório contém o **frontend do Academic System**, uma plataforma de gerenciamento acadêmico desenvolvida com **React**, **TypeScript** e **Vite**. A aplicação consome uma **API RESTful** construída em Spring Boot e oferece uma experiência moderna e responsiva para diferentes perfis de usuários: **Alunos**, **Professores**, **Administradores** e **Funcionários**.

> 🔧 O projeto está em desenvolvimento contínuo, com novas funcionalidades sendo implementadas regularmente.

---

## ✨ Funcionalidades Principais

O sistema é baseado em perfis de usuário, cada um com seu próprio painel e permissões específicas:

### 🔐 Autenticação Segura
- Login via JWT.
- Estado de autenticação gerenciado globalmente com React Context API.

### 🔒 Roteamento Protegido
- Controle de acesso baseado em perfis (`ROLE_ADMIN`, `ROLE_TEACHER`, `ROLE_STUDENT`, etc).

### 📊 Dashboards Personalizados
- **Administrador**: Estatísticas globais, gráficos com distribuição por curso, feed de atividades.
- **Professor**: Acesso às turmas, planos de aula, agenda e conteúdos.
- **Aluno**: Matérias, notas, frequência, avaliações futuras e calendário acadêmico.
- **Funcionário**: Painel adaptado para bibliotecários, técnicos e RH, com widgets por função.

### 📚 Gerenciamento de Aulas
- Criação de aulas com editor avançado (**TinyMCE**) que suporta texto, imagens e links.

### 📨 Notificações em Tempo Real
- Integração com WebSockets (**STOMP/SockJS**) para alertas e atualizações instantâneas.

### 💻 Interface Moderna e Reativa
- Estilização com **React Bootstrap** e **SASS**.
- Animações com **Framer Motion** e **AOS**.

---

## 🚀 Tecnologias Utilizadas

### Core
- React
- TypeScript
- Vite

### Gerenciamento de Estado e Dados
- React Query (`@tanstack/react-query`)
- React Context API

### Roteamento
- React Router DOM

### Comunicação com API
- Axios
- WebSockets com STOMP.js + SockJS

### UI & Estilização
- React Bootstrap
- SASS/SCSS
- Framer Motion
- AOS (Animate on Scroll)
- Lucide React (ícones)

### Formulários
- React Hook Form
- Yup

### Editor de Texto
- TinyMCE (WYSIWYG)

---

## 🛠️ Instalação e Execução

### ✅ Pré-requisitos

- Node.js 18+
- NPM ou Yarn

### 📥 Passos para rodar o projeto localmente:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio

# Instale as dependências
npm install
```

### ⚙ ️Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_TINYMCE_API_KEY=sua_chave_api_do_tinymce
```
### ▶️ Executando o projeto
```bash
# Inicie o servidor de desenvolvimento
npm run dev
```
A aplicação estará disponível em http://localhost:5173.
