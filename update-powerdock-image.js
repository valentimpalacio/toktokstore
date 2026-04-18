/**
 * Script para atualizar a imagem do PowerDock Station no banco de dados
 * 
 * Este script deve ser executado após o servidor estar em execução e o banco de dados estiver populado.
 * Ele faz uma chamada direta à API para atualizar a imagem do produto "PowerDock Station".
 */

const axios = require('axios');

async function updatePowerDockImage() {
  try {
    // Primeiro, vamos buscar todos os produtos para encontrar o ID do PowerDock Station
    console.log('Buscando produtos...');
    
    const response = await axios.get('http://localhost:5000/api/products');
    const products = response.data.data;
    
    const powerDockProduct = products.find(p => p.name === 'PowerDock Station');
    
    if (!powerDockProduct) {
      console.error('Produto "PowerDock Station" não encontrado!');
      return;
    }
    
    console.log(`Encontrado PowerDock Station com ID: ${powerDockProduct.id}`);
    
    // Atualizar a imagem do produto
    const updateResponse = await axios.patch(
      `http://localhost:5000/api/products/${powerDockProduct.id}`,
      {
        image: 'https://images.pexels.com/photos/1332766/pexels-photo-1332766.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ADMIN_JWT_TOKEN_AQUI' // Substituir com token real de administrador
        }
      }
    );
    
    console.log('Imagem do PowerDock Station atualizada com sucesso!');
    console.log(updateResponse.data);
    
  } catch (error) {
    console.error('Erro ao atualizar a imagem do PowerDock Station:', error.message);
    
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

// Executar a função
updatePowerDockImage();