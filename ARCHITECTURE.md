# Documentação de Padrões e Arquitetura

Este documento descreve os padrões de código e arquitetura utilizados neste projeto.

## 📋 Índice

1. [Padrões do Backend](#padrões-do-backend)
2. [Padrões do Frontend](#padrões-do-frontend)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Como Estender o Projeto](#como-estender-o-projeto)

## Padrões do Backend

### 1. Controller Pattern

Cada recurso tem seu próprio controller na pasta `src/controllers/`. Os controllers usam o padrão `asyncHandler` para tratamento de erros automático.

**Exemplo:**
```javascript
const getProducts = asyncHandler(async (req, res) => {
  // Sua lógica aqui
  res.json({ success: true, data });
});
```

### 2. Validação com Zod

Todas as requisições são validadas usando Zod. Os schemas estão em `src/utils/validationSchemas.js`.

**Uso em uma rota:**
```javascript
router.post(
  '/',
  validateBody(createProductSchema),
  createProduct
);
```

### 3. Error Handling Centralizado

Erros são tratados de forma centralizada usando `AppError` e `asyncHandler`.

**Como usar:**
```javascript
throw errors.NOT_FOUND('Product');
throw errors.VALIDATION_ERROR('Invalid input');
throw errors.FORBIDDEN('Access denied');
```

### 4. Logging Estruturado

Use o logger Winston para registrar operações importantes.

**Exemplo:**
```javascript
logger.info('Product created', { productId: product.id, name });
logger.warn('Failed login attempt', { email });
logger.error('Database error', { error: err.message });
```

### 5. Transações para Operações Críticas

Use transações do Prisma para operações que modificam múltiplos dados.

**Exemplo:**
```javascript
const result = await prisma.$transaction(async (tx) => {
  // Múltiplas operações que devem ser atômicas
  const order = await tx.order.create({ ... });
  await tx.product.update({ ... });
  return order;
});
```

## Padrões do Frontend

### 1. Componentes Funcionais com Hooks

Todos os componentes usam a sintaxe moderna de React com hooks.

**Exemplo:**
```javascript
const MyComponent = () => {
  const [state, setState] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Efeito
  }, [dependencies]);

  return <div>JSX</div>;
};
```

### 2. Custom Hooks para Lógica Reutilizável

Crie custom hooks em `src/hooks/` para lógica que é usada em múltiplos componentes.

**Exemplo:**
```javascript
export const useProductFetch = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    APIServices.products.getById(id).then(setData);
  }, [id]);

  return { data, loading };
};
```

### 3. Serviço Centralizado de API

Todo acesso à API passa pelo `APIServices` em `src/services/api.service.js`.

**Uso:**
```javascript
const response = await APIServices.products.getAll({ page: 1 });
const order = await APIServices.orders.create({ items: [...] });
```

### 4. Utilitários de Formatação

Use os formatadores em `src/utils/formatters.js` para padronizar exibição de dados.

**Exemplo:**
```javascript
<p>{formatPrice(100)}</p> {/* R$ 100,00 */}
<p>{formatDate(new Date())}</p> {/* 17/04/2026 10:30 */}
<p>{getStatusLabel('PENDING')}</p> {/* Pendente */}
```

### 5. Proteção de Rotas

Use `ProtectedRoute` ou `AdminRoute` para proteger rotas.

**Exemplo:**
```javascript
<Route 
  path="/admin" 
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  } 
/>
```

## Estrutura de Pastas

### Backend

```
server/
├── src/
│   ├── controllers/          # Lógica de negócio
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── rating.controller.js
│   │   ├── wishlist.controller.js
│   │   ├── coupon.controller.js
│   │   └── admin.controller.js
│   │
│   ├── routes/              # Definição de rotas
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   ├── rating.routes.js
│   │   ├── wishlist.routes.js
│   │   ├── coupon.routes.js
│   │   └── admin.routes.js
│   │
│   ├── middleware/          # Middleware
│   │   ├── auth.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── utils/               # Utilitários
│   │   ├── logger.js
│   │   ├── errorHandler.js
│   │   └── validationSchemas.js
│   │
│   ├── config/              # Configurações
│   │   └── passport.js
│   │
│   └── index.js             # Entrada principal
│
├── prisma/
│   ├── schema.prisma
│   └── seed.js
│
├── logs/                    # Logs gerados
├── .env.example
├── package.json
└── docker-compose.yml
```

### Frontend

```
client/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ProtectedRoute.jsx
│   │   ├── ReviewsSection.jsx
│   │   ├── Navbar.jsx
│   │   └── ...
│   │
│   ├── pages/               # Páginas
│   │   ├── AdminDashboard.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Shop.jsx
│   │   └── ...
│   │
│   ├── hooks/               # Custom Hooks
│   │   └── useCustom.js
│   │
│   ├── services/            # Serviços de API
│   │   └── api.service.js
│   │
│   ├── utils/               # Utilitários
│   │   └── formatters.js
│   │
│   ├── context/             # Context API
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ToastContext.jsx
│   │
│   ├── api/                 # Configuração Axios
│   │   └── api.js
│   │
│   ├── App.jsx              # Entrada principal
│   └── main.jsx
│
├── .env.example
├── package.json
└── vite.config.js
```

## Como Estender o Projeto

### Adicionar um Novo Recurso (ex: Blog/Posts)

#### 1. Backend

**1.1 Criar o modelo no Prisma:**
```prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String   @db.Text
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**1.2 Executar migração:**
```bash
npx prisma migrate dev --name add_posts
```

**1.3 Criar validação schemas em `src/utils/validationSchemas.js`:**
```javascript
const createPostSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10)
});
```

**1.4 Criar controller em `src/controllers/post.controller.js`:**
```javascript
const createPost = asyncHandler(async (req, res) => {
  const validatedData = createPostSchema.parse(req.body);
  const post = await prisma.post.create({
    data: { ...validatedData, authorId: req.user.id }
  });
  logger.info('Post created', { postId: post.id });
  res.status(201).json({ success: true, data: post });
});
```

**1.5 Criar rotas em `src/routes/post.routes.js`:**
```javascript
const router = express.Router();
router.post('/', authMiddleware, validateBody(createPostSchema), createPost);
router.get('/', getPosts);
```

**1.6 Registrar rotas em `src/index.js`:**
```javascript
const postRoutes = require('./routes/post.routes');
app.use('/api/posts', postRoutes);
```

#### 2. Frontend

**2.1 Criar componente em `src/components/PostCard.jsx`:**
```javascript
export const PostCard = ({ post }) => (
  <div className="bg-white rounded-lg p-4">
    <h3>{post.title}</h3>
    <p>{post.content}</p>
  </div>
);
```

**2.2 Adicionar serviço em `src/services/api.service.js`:**
```javascript
posts: {
  getAll: () => api.get('/posts'),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data)
}
```

**2.3 Criar página em `src/pages/Blog.jsx`:**
```javascript
export const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    APIServices.posts.getAll().then(res => setPosts(res.data));
  }, []);

  return (
    <div>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
};
```

**2.4 Adicionar rota em `src/App.jsx`:**
```javascript
<Route path="/blog" element={<Blog />} />
```

## Best Practices

### Backend
- ✅ Use `asyncHandler` para evitar try-catch repetitivo
- ✅ Valide sempre com Zod
- ✅ Registre eventos importantes com logger
- ✅ Use transações para operações críticas
- ✅ Documente endpoints complexos
- ✅ Teste sua API com ferramentas como Postman ou Insomnia

### Frontend
- ✅ Use formatadores para dados consistentes
- ✅ Crie custom hooks para lógica reutilizável
- ✅ Centralize chamadas de API
- ✅ Use loading states e error boundaries
- ✅ Proteja rotas que requerem autenticação
- ✅ Use TypeScript para melhor type safety (futuro)

## Performance

### Backend
- Índices no banco de dados estão configurados
- Use paginação em listagens
- Implemente cache para dados frequentemente acessados
- Monitore logs de slow queries

### Frontend
- Use React.lazy() para code splitting
- Implemente lazy loading de imagens
- Otimize re-renders com useMemo e useCallback
- Use virtualization para listas grandes

---

**Últimas atualizações: 17 de Abril de 2026**
