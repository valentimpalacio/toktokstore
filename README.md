# E-Commerce Premium - Full Stack React Application

Um e-commerce completo e profissional construído com React, Node.js, Express e PostgreSQL, com foco em escalabilidade e manutenibilidade.

## 📸 Screenshots

### Home Page
![Home Page](screenshots/01-home.png)

### Shop/Loja
![Shop Page](screenshots/02-shop.png)

### About Page
![About Page](screenshots/03-about.png)

## 🌟 Características Implementadas

### Backend (Node.js/Express)

#### Logging & Monitoramento
- ✅ Sistema de logging estruturado com Winston
- ✅ Logs em arquivo e console com níveis configuráveis
- ✅ Rastreamento de erros com stack trace
- ✅ Metadados de requisição

#### Error Handling Profissional
- ✅ Error handler centralizado e consistente
- ✅ Classe AppError customizada
- ✅ Tratamento de erros assincronos com asyncHandler
- ✅ Mensagens de erro padronizadas

#### Validação de Dados
- ✅ Validação com Zod em todos os endpoints
- ✅ Middleware de validação para body, query e params
- ✅ Schemas reutilizáveis

#### Novas Funcionalidades
- ✅ Sistema de Ratings/Reviews de produtos
- ✅ Wishlist de produtos
- ✅ Cupons e descontos
- ✅ Dashboard de admin com estatísticas
- ✅ Paginação avançada
- ✅ Filtros de busca complexos

#### Segurança
- ✅ Rate limiting
- ✅ Helmet para headers de segurança
- ✅ JWT com expiração configurável
- ✅ Validação de role (ADMIN/USER)
- ✅ Proteção de stock em transações

#### Base de Dados
- ✅ Novos modelos: Rating, Wishlist, Coupon
- ✅ Relacionamentos bem definidos
- ✅ Índices para performance
- ✅ Soft delete com cascade

### Frontend (React)

#### Componentes Profissionais
- ✅ Componente ProtectedRoute com redirecionamento automático
- ✅ AdminRoute para rotas exclusivas de admin
- ✅ ReviewsSection com rating visual
- ✅ Dashboard de admin com gráficos
- ✅ Página de wishlist

#### Utilitários
- ✅ Formatadores profissionais (preço, data, texto)
- ✅ Validação de email
- ✅ Cálculo de desconto
- ✅ Slugification

#### Hooks Reutilizáveis
- ✅ useAuth para acesso ao contexto de autenticação
- ✅ useFetch para requisições com token automático
- ✅ useAsync para operações assincronos

#### API Service
- ✅ Serviço centralizado de API com métodos tipados
- ✅ Métodos para todas as entidades
- ✅ Integração com admin routes

## 🚀 Setup e Instalação

### Pré-requisitos
- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

### Variáveis de Ambiente

#### Server (.env)
```bash
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://devuser:devpassword@localhost:5432/ecommerce_db
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
LOG_LEVEL=info
```

#### Client (.env)
```bash
VITE_API_URL=http://localhost:5000/api
```

### Instalação

1. **Clone o repositório**
```bash
git clone <seu-repo>
cd projeto-react
```

2. **Instale as dependências do servidor**
```bash
cd server
npm install
```

3. **Configure o banco de dados**
```bash
cd server
npx prisma generate
npx prisma migrate dev
npx prisma db seed # opcional - para popular dados iniciais
```

4. **Instale as dependências do cliente**
```bash
cd ../client
npm install
```

5. **Inicie o servidor**
```bash
cd server
npm run dev
```

6. **Inicie o cliente (em outro terminal)**
```bash
cd client
npm run dev
```

## 📁 Estrutura do Projeto

```
projeto-react/
├── server/
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── routes/           # Definição de rotas
│   │   ├── middleware/       # Middleware (auth, validação)
│   │   ├── utils/            # Utilitários (logger, error handler, schemas)
│   │   ├── config/           # Configurações (Passport, etc)
│   │   └── index.js          # Entrada principal
│   ├── prisma/
│   │   └── schema.prisma     # Schema do banco de dados
│   ├── logs/                 # Logs gerados
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/            # Páginas
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # Serviços de API
│   │   ├── utils/            # Utilitários
│   │   ├── context/          # Context API
│   │   ├── api/              # Configuração de axios
│   │   └── App.jsx           # Entrada principal
│   └── package.json
│
└── docker-compose.yml
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Informações do usuário autenticado
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Produtos
- `GET /api/products` - Listar produtos (com filtros, paginação)
- `GET /api/products/:id` - Obter produto específico
- `POST /api/products` - Criar produto (admin)
- `PATCH /api/products/:id` - Atualizar produto (admin)
- `DELETE /api/products/:id` - Deletar produto (admin)
- `GET /api/products/categories` - Listar categorias
- `POST /api/products/categories` - Criar categoria (admin)

### Pedidos
- `POST /api/orders` - Criar novo pedido
- `GET /api/orders` - Listar meus pedidos
- `GET /api/orders/:id` - Obter pedido específico
- `PATCH /api/orders/:id/cancel` - Cancelar pedido

### Avaliações
- `GET /api/ratings/:productId` - Listar avaliações de um produto
- `POST /api/ratings` - Criar/atualizar avaliação
- `DELETE /api/ratings/:id` - Deletar avaliação

### Wishlist
- `GET /api/wishlist` - Listar minha wishlist
- `POST /api/wishlist` - Adicionar à wishlist
- `DELETE /api/wishlist/:productId` - Remover da wishlist
- `GET /api/wishlist/:productId/check` - Verificar se está na wishlist

### Cupons
- `GET /api/coupons/validate/:code` - Validar cupom

### Admin
- `GET /api/admin/dashboard/stats` - Estatísticas do dashboard
- `GET /api/admin/inventory` - Gerenciamento de estoque
- `GET /api/admin/users` - Listar usuários
- `GET /api/admin/orders` - Listar todos os pedidos
- `PATCH /api/admin/orders/:id/status` - Atualizar status do pedido
- `GET /api/admin/categories/stats` - Estatísticas de categorias
- `GET /api/coupons` - Listar cupons (admin)
- `POST /api/coupons` - Criar cupom (admin)

## 🎯 Padrões de Código Implementados

### Backend
- **Controller Layer**: Cada recurso tem seu próprio controller
- **Service Layer**: Lógica de negócio reutilizável
- **Validation Layer**: Validação com Zod
- **Error Handling**: Tratamento centralizado de erros
- **Logging**: Sistema completo de logs

### Frontend
- **Component Composition**: Componentes pequenos e reutilizáveis
- **Custom Hooks**: Lógica reutilizável
- **Service Layer**: Comunicação com API centralizada
- **Context API**: Gerenciamento de estado global
- **Utility Functions**: Funções de formatação reutilizáveis

## 🔒 Segurança

- ✅ Validação de entrada em todos os endpoints
- ✅ Autenticação baseada em JWT
- ✅ Autorização por role
- ✅ Rate limiting
- ✅ Helmet para segurança HTTP
- ✅ CORS configurado
- ✅ Proteção contra SQL injection (Prisma)
- ✅ Hash de senhas com bcryptjs
- ✅ Transações para operações críticas

## 📊 Funcionalidades Avançadas

### Dashboard de Admin
- Estatísticas em tempo real
- Gráficos de receita
- Status dos pedidos
- Produtos com estoque baixo
- Gerenciamento de usuários

### Sistema de Ratings
- Avaliações de 1-5 estrelas
- Comentários dos usuários
- Média de rating por produto
- Apenas usuários que compraram podem avaliar

### Wishlist
- Adicionar/remover produtos
- Visualizar lista de desejos
- Verificar se produto está na lista

### Cupons
- Criar e gerenciar cupons
- Validação de cupom
- Limite de uso
- Data de expiração
- Desconto percentual

## 🛠️ Tecnologias Utilizadas

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- Bcryptjs
- Winston (logging)
- Zod (validação)
- Helmet
- CORS
- Express Rate Limit

### Frontend
- React 19
- React Router
- React Query (TanStack Query)
- Axios
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- Recharts (gráficos)
- Lucide Icons

## 📝 Logging

Os logs são salvos em `server/logs/`:
- `combined.log` - Todos os logs
- `error.log` - Apenas erros

Configure o nível em `LOG_LEVEL` no `.env`

## 🔄 CI/CD Ready

O projeto está estruturado para fácil integração com:
- GitHub Actions
- GitLab CI
- Jenkins
- Docker

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Desenvolvido como um exemplo de e-commerce profissional full-stack.

---

**Desenvolvido com ❤️ usando React, Node.js e PostgreSQL**
