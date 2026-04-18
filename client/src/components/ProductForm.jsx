import React, { useState, useEffect } from 'react';
import APIServices from '../services/api.service';

const ProductForm = ({ product = null, onCancel, onSaved }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        image: product.image || '',
        categoryId: product.categoryId || '',
      });
    }

    // load categories
    (async () => {
      try {
        const res = await APIServices.products.getCategories();
        setCategories(res.data.data);
      } catch (err) {
        // ignore
      }
    })();
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (product) {
        const res = await APIServices.products.update(product.id, form);
        onSaved(res.data.data);
      } else {
        const res = await APIServices.products.create(form);
        onSaved(res.data.data);
      }
    } catch (err) {
      alert(err.message || 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border p-4 rounded shadow">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estoque</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Imagem (URL)</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
            >
              <option value="">-- selecionar --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {saving ? 'Salvando...' : product ? 'Salvar mudanças' : 'Criar produto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
