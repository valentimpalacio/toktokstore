import React, { useEffect, useState } from 'react';
import { AdminRoute } from '../components/ProtectedRoute';
import APIServices from '../services/api.service';
import ProductForm from '../components/ProductForm';
import { formatPrice } from '../utils/formatters';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await APIServices.products.getAll({ limit: 50 });
      setProducts(res.data.data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (product) => {
    setEditing(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja mesmo deletar este produto?')) return;
    try {
      await APIServices.products.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Erro ao deletar');
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleSaved = (saved) => {
    setShowForm(false);
    // If updated, replace; if new, prepend
    const exists = products.find((p) => p.id === saved.id);
    if (exists) {
      setProducts(products.map((p) => (p.id === saved.id ? saved : p)));
    } else {
      setProducts([saved, ...products]);
    }
  };

  if (loading) return <div className="p-6">Carregando produtos...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin - Gerenciar Produtos</h1>
          <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
            Novo Produto
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <ProductForm
              product={editing}
              onCancel={() => setShowForm(false)}
              onSaved={handleSaved}
            />
          </div>
        )}

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Produto</th>
                <th className="px-4 py-3 text-left">Preço</th>
                <th className="px-4 py-3 text-left">Estoque</th>
                <th className="px-4 py-3 text-left">Categoria</th>
                <th className="px-4 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {p.image && (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-gray-500">{p.description?.slice(0, 80)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.category?.name || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded"
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
