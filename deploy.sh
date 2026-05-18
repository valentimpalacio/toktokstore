#!/bin/bash

# Script de deploy para TokTokStore
# Uso: ./deploy.sh

set -e

echo "🚀 Iniciando deploy do TokTokStore..."

# Verificar se as CLIs estão instaladas
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não instalada. Instale com: npm i -g vercel"
    exit 1
fi

if ! command -v neonctl &> /dev/null; then
    echo "❌ Neon CLI não instalada. Instale com: npm i -g @neondatabase/neonctl"
    exit 1
fi

# 1. Criar projeto no Neon
echo ""
echo "📦 Criando banco de dados no Neon..."
PROJECT_ID=$(neonctl projects create --name "toktokstore-db" --output json | jq -r '.id')
echo "✅ Projeto Neon criado: $PROJECT_ID"

# Criar branch main
BRANCH_ID=$(neonctl branches create --project-id "$PROJECT_ID" --name "main" --output json | jq -r '.id')
echo "✅ Branch criado: $BRANCH_ID"

# Obter connection string
DATABASE_URL=$(neonctl connection-string --project-id "$PROJECT_ID" --branch-id "$BRANCH_ID")
echo "✅ Connection string obtida"

# 2. Rodar migrações do Prisma
echo ""
echo "🗄️  Rodando migrações do Prisma..."
cd server
DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy
DATABASE_URL="$DATABASE_URL" npx prisma generate
cd ..

# 3. Deploy na Vercel
echo ""
echo "🌐 Fazendo deploy na Vercel..."
vercel --prod \
  --env DATABASE_URL="$DATABASE_URL" \
  --env JWT_SECRET="$(openssl rand -hex 32)" \
  --env JWT_EXPIRES_IN="7d" \
  --env NODE_ENV="production" \
  --env LOG_LEVEL="info" \
  --yes

echo ""
echo "✅ Deploy concluído!"
echo "📝 Salve estas informações:"
echo "   DATABASE_URL: $DATABASE_URL"
echo "   PROJECT_ID: $PROJECT_ID"
echo "   BRANCH_ID: $BRANCH_ID"
