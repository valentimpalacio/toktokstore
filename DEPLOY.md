# Deploy TokTokStore - Vercel + Neon

## 📋 Pré-requisitos

- Conta no GitHub
- Conta na Vercel
- Conta no Neon
- CLIs instaladas:
  ```bash
  npm i -g vercel @neondatabase/neonctl
  ```

## 🚀 Deploy Automático

### 1. Login nas CLIs

```bash
# Vercel
vercel login

# Neon
neonctl auth
```

### 2. Executar o script de deploy

```bash
./deploy.sh
```

## 🔧 Deploy Manual

### Passo 1: Criar banco no Neon

```bash
# Criar projeto
neonctl projects create --name "toktokstore-db"

# Obter PROJECT_ID
neonctl projects list

# Criar branch e obter connection string
neonctl connection-string --project-id <PROJECT_ID>
```

### Passo 2: Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=seu_segredo_aqui
JWT_EXPIRES_IN=7d
NODE_ENV=production
LOG_LEVEL=info
```

### Passo 3: Rodar migrações

```bash
cd server
DATABASE_URL="sua_connection_string" npx prisma migrate deploy
DATABASE_URL="sua_connection_string" npx prisma generate
cd ..
```

### Passo 4: Deploy na Vercel

```bash
vercel --prod
```

## 📝 Variáveis de Ambiente na Vercel

No dashboard da Vercel, adicione:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | Connection string do Neon |
| `JWT_SECRET` | Chave secreta para JWT |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `LOG_LEVEL` | `info` |

## 🔄 Deploy Contínuo (GitHub)

1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente no dashboard
3. Cada push para `main` fará deploy automático

## 🗄️ Seed do Banco (Opcional)

```bash
cd server
DATABASE_URL="sua_connection_string" npx prisma db seed
cd ..
```

## 🐛 Troubleshooting

### Erro: "Prisma Client not generated"
```bash
cd server && npx prisma generate
```

### Erro: "Database connection failed"
- Verifique se a `DATABASE_URL` está correta
- Verifique se o banco no Neon está ativo

### Erro: "Module not found"
```bash
npm install
cd server && npm install
cd ../client && npm install
```
