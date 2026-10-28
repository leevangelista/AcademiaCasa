# App Academia

App pessoal de treinos (Next.js + Supabase), feito para usar no iPhone como app da tela de início.

- **Treinos:** crie fichas com exercícios, séries e repetições.
- **Registro do dia:** abra um treino, ajuste as repetições e marque ✓ em cada série feita.
- **Histórico:** toque num dia para corrigir ou excluir o registro.

Sem as chaves do Supabase, o app roda em **modo demonstração**: os dados ficam só no navegador.

## Rodar no Mac

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Publicar (uma vez só)

### 1. Supabase (banco e login)

1. Em [supabase.com](https://supabase.com), clique em **New project**. Nome: `academia`. Região: **South America (São Paulo)**. Anote a senha do banco.
2. No menu **SQL Editor**, clique em **New query**, cole todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.
3. Em **Authentication › Users**, clique em **Add user › Create new user**, informe seu e-mail e uma senha e marque **Auto Confirm User**.
4. Em **Authentication › Sign In / Providers**, desligue **Allow new users to sign up**, para que ninguém mais consiga criar conta.
5. Em **Project Settings › API** (ou no botão **Connect**), copie a **Project URL** e a chave **anon public**.

Para testar com o banco no Mac, copie `.env.local.example` para `.env.local` e cole os dois valores.

### 2. GitHub

Crie um repositório **privado** vazio, chamado `app-academia`, e envie esta pasta para ele.

### 3. Vercel

1. Clique em **Add New › Project** e importe o repositório `app-academia`.
2. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`: a Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: a chave anon public
3. Clique em **Deploy**. O endereço fica parecido com `https://app-academia.vercel.app`.

A cada `git push`, a Vercel publica a versão nova sozinha.

### 4. iPhone

1. Abra o endereço da Vercel no **Safari**.
2. Toque em **Compartilhar › Adicionar à Tela de Início**.
3. Abra pelo ícone e faça login uma vez. O app da tela de início guarda o login separado do Safari.

## Observação

O plano grátis do Supabase pausa o projeto depois de ~7 dias sem uso. Se isso acontecer, reative em supabase.com com um clique.
