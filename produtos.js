/* --- LÓGICA DA PÁGINA DE DETALHES DO PRODUTO --- */

// 1. Identifica qual produto exibir através do ID na URL (ex: produto.html?id=1)
const urlParams = new URLSearchParams(window.location.search);
const idDoProduto = urlParams.get('id');

// 2. Busca o produto dentro da lista que está no dados.js
const produtoEncontrado = produtos.find(p => p.id == idDoProduto);

const displayInfo = document.getElementById('produtoInfo');
const tituloPagina = document.querySelector('h2');

// 3. Verifica se o produto existe e preenche a página
if (produtoEncontrado) {
    tituloPagina.innerText = produtoEncontrado.nome;
    
    displayInfo.innerHTML = `
        <div class="detalhe-container" style="display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px;">
            <img src="${produtoEncontrado.imagem}" alt="${produtoEncontrado.nome}" style="max-width: 100%; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            
            <div class="info-texto" style="text-align: center;">
                <p style="font-size: 1.2rem; color: #555; margin-bottom: 10px;">${produtoEncontrado.descricao}</p>
                <p style="font-size: 2rem; color: #e8b4b8; font-weight: bold; margin: 15px 0;">R$ ${produtoEncontrado.preco.toFixed(2)}</p>
                <p style="color: #888;">Disponível em estoque: ${produtoEncontrado.estoque}</p>
            </div>

            <button onclick="finalizarCompra('${produtoEncontrado.nome}', ${produtoEncontrado.preco})" 
                style="background-color: #e8b4b8; color: white; border: none; padding: 15px 40px; border-radius: 30px; cursor: pointer; font-size: 1.2rem; font-weight: bold; transition: 0.3s;">
                🛒 Solicitar este Produto
            </button>
        </div>
    `;
} else {
    tituloPagina.innerText = "Ops! Produto não encontrado.";
    displayInfo.innerHTML = `<p style="text-align:center;">Não conseguimos localizar o item desejado. <a href="index.html">Voltar para a loja</a></p>`;
}

// 4. Função para registrar a venda na Planilha Google
function finalizarCompra(nomeProd, precoProd) {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    // Cole aqui a sua URL do Google Apps Script
    const urlPlanilha = 'https://script.google.com/macros/s/AKfycbx35BCNL4rVOi8CxDtBS5AmHZbmUv9xutT6cz8qcL3ZeRWGB2TuXv60PF5nMLhuktG7/exec';

    if (!usuarioLogado) {
        alert("Para comprar, você precisa estar logada em sua conta.");
        window.location.href = "login.html";
        return;
    }

    if (confirm(`Confirmar interesse no produto: ${nomeProd} por R$ ${precoProd.toFixed(2)}?`)) {
        const dadosVenda = {
            acao: "registrarVenda",
            nomeCliente: usuarioLogado,
            produto: nomeProd,
            valor: precoProd,
            whatsapp: "Cliente Logado" // Podemos buscar o zap real se estiver no localStorage
        };

        fetch(urlPlanilha, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(dadosVenda)
        })
        .then(() => {
            alert("Pedido enviado com sucesso! Verificaremos o estoque e entraremos em contato com você.");
            window.location.href = "index.html"; // Volta para a loja após o sucesso
        })
        .catch(err => alert("Erro ao processar o pedido: " + err));
    }
}
