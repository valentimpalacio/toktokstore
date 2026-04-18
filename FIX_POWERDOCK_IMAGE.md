# Fix para a Imagem do PowerDock Station

## Problema

A imagem do produto "PowerDock Station" não está aparecendo na aplicação porque a URL original no arquivo de seed apontava para uma imagem não mais disponível no servidor de imagens.

## Solução Aplicada

A imagem foi atualizada no arquivo `server/prisma/seed.js` com uma nova URL válida:

```javascript
{
  name: 'PowerDock Station',
  description: '3-in-1 wireless charging station for phone, watch, and earbuds. Supports 15W fast charging with LED indicator.',
  price: 59.99,
  stock: 150,
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',  // Esta foi atualizada
  categoryId: accessories.id,
},
```

## Como Atualizar o Banco de Dados

Para que a alteração tenha efeito, você precisa executar novamente o processo de seed do banco de dados:

### 1. Com Docker (recomendado):

```bash
# Certifique-se de que o Docker Desktop está em execução

# Inicie o banco de dados PostgreSQL
docker-compose up -d

# Execute o seed (no diretório server)
cd server
npx prisma migrate reset
```

### 2. Sem Docker (alternativa):

Se o Docker não estiver disponível, você pode usar o script auxiliar criado:

```bash
# Após iniciar o servidor backend
cd c:\Users\valen\Downloads\projeto-react
node update-powerdock-image.js
```

> Nota: Para usar o script, você precisa ter o servidor em execução e obter um token JWT de administrador para substituir no código.

## Tratamento de Erro de Imagem

Mesmo que a imagem não esteja disponível, o código frontend está preparado para lidar com esse erro e mostrar um ícone de fallback nos seguintes componentes:

- [ProductCard.jsx](file:///c:\Users\valen\Downloads\projeto-react\client\src\components\ProductCard.jsx#L0-L96)
- [ProductDetail.jsx](file:///c:\Users\valen\Downloads\projeto-react\client\src\pages\ProductDetail.jsx#L0-L164)
- Componente "RelatedProducts" em [ProductDetail.jsx](file:///c:\Users\valen\Downloads\projeto-react\client\src\pages\ProductDetail.jsx#L0-L164)

Esses componentes utilizam `onError` handlers para detectar falhas no carregamento da imagem e mostram um ícone padrão em vez de deixar o espaço em branco.

## Verificação

Após atualizar o banco de dados, a imagem do PowerDock Station deve aparecer corretamente na página de detalhes do produto e em outros lugares onde o produto é exibido.