/* --- 1. CONFIGURAÇÕES E LÓGICA DE PRODUTOS --- */
const urlPlanilha = 'https://script.google.com/macros/s/AKfycbx35BCNL4rVOi8CxDtBS5AmHZbmUv9xutT6cz8qcL3ZeRWGB2TuXv60PF5nMLhuktG7/exec';

async function carregarProdutos() {
    const lista = document.getElementById("listaProdutos");
    if (!lista) return;

    lista.innerHTML = "<p>Carregando vitrine carinhosa...</p>";

    try {
        const resposta = await fetch(urlPlanilha + "?acao=listarProdutos");
        const produtos = await resposta.json();

        lista.innerHTML = ""; 

        produtos.forEach(produto => {
            const item = document.createElement("div");
            item.className = "card-produto"; 
            // Estilo do Card padronizado para alinhar tudo
            item.style = "border: 1px solid #ddd; padding: 15px; margin: 10px; border-radius: 12px; text-align: center; display: inline-block; width: 220px; background: white; box-sizing: border-box; vertical-align: top; box-shadow: 0 4px 6px rgba(0,0,0,0.05);";
            
            const esgotado = produto.estoque <= 0;

            item.innerHTML = `
                <a href="produto.html?id=${produto.id}" style="text-decoration: none; color: black; display: block;">
                    <img src="${produto.imagem}" alt="${produto.nome}" width="150" style="border-radius: 8px; height: 150px; object-fit: cover; margin-bottom: 10px;">
                    <p style="margin: 5px 0;"><strong>${produto.nome}</strong></p>
                    <p style="color: #e8b4b8; font-weight: bold; margin: 5px 0;">R$ ${produto.preco.toFixed(2)}</p>
                    <p style="font-size: 0.8rem; color: #666;">Estoque: ${produto.estoque}</p>
                </a>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px; width: 100%; box-sizing: border-box;">
                    <button onclick="finalizarCompra('${produto.nome}', ${produto.preco})" 
                        ${esgotado ? 'disabled' : ''} 
                        style="background-color: ${esgotado ? '#ccc' : '#e8b4b8'}; color: white; border: none; padding: 12px 5px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; box-sizing: border-box; font-size: 0.9rem;">
                        ${esgotado ? 'Esgotado' : 'Comprar Agora'}
                    </button>

                    ${!esgotado ? `
                    <button onclick="adicionarAoCarrinho('${produto.nome}', ${produto.preco})" 
                        style="background-color: white; color: #e8b4b8; border: 2px solid #e8b4b8; padding: 12px 5px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; width: 100%; box-sizing: border-box; font-weight: bold;">
                        🛒 + Carrinho
                    </button>
                    ` : ''}
                </div>
            `;
            lista.appendChild(item);
        });
    } catch (erro) {
        lista.innerHTML = "<p>Erro ao carregar produtos. Tente atualizar a página.</p>";
        console.error("Erro:", erro);
    }
}

/* --- 2. FUNÇÃO ADICIONAR AO CARRINHO --- */
function adicionarAoCarrinho(nomeProduto, precoProduto) {
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    if (!usuarioLogado) {
        alert("Por favor, faça login para usar o carrinho.");
        window.location.href = "login.html";
        return;
    }

    const idPedido = "CARR-" + new Date().getTime();
    const dadosVenda = {
        acao: "registrarVenda",
        idPedido: idPedido,
        nomeCliente: usuarioLogado,
        produto: nomeProduto,
        valor: precoProduto,
        statusPag: "Aguardando Pagamento" 
    };

    alert(`Oba! ${nomeProduto} foi adicionado ao seu carrinho. Continue navegando! 🌸`);

    fetch(urlPlanilha, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(dadosVenda)
    }).then(() => {
        console.log("Item adicionado ao carrinho.");
    });
}

/* --- 3. FUNÇÃO FINALIZAR COMPRA --- */
function finalizarCompra(nomeProduto, precoProduto) {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const telAdmin = "55991561497"; 

    if (!usuarioLogado) {
        alert("Por favor, faça login para realizar uma compra.");
        window.location.href = "login.html";
        return;
    }

    const idPedido = "PED-" + new Date().getTime();
    const confirmar = confirm(`Deseja solicitar a compra de: ${nomeProduto}?\n\nID: ${idPedido}`);
    
    if (confirmar) {
        const dadosVenda = {
            acao: "registrarVenda",
            idPedido: idPedido,
            nomeCliente: usuarioLogado,
            produto: nomeProduto,
            valor: precoProduto,
            whatsapp: "Cliente logado"
        };

        fetch(urlPlanilha, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(dadosVenda)
        })
        .then(() => {
            alert("Pedido registrado! Redirecionando para o WhatsApp...");
            const msgAdmin = encodeURIComponent(`Olá! O cliente ${usuarioLogado} está finalizando a compra ID ${idPedido} do produto ${nomeProduto}.`);
            window.open(`https://wa.me/${telAdmin}?text=${msgAdmin}`, '_blank');
            location.reload(); 
        })
        .catch(erro => alert("Erro ao registrar: " + erro));
    }
}

/* --- 4. CONTROLE DE INTERFACE E LOGIN --- */
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos(); // Chama a função de carga

    const nomeUsuario = localStorage.getItem('usuarioLogado');
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    const spanBoasVindas = document.getElementById('boasVindas');
    const btnLogin = document.getElementById('btnLogin');
    const btnSair = document.getElementById('link-sair');
    const linkAdmin = document.getElementById('linkAdmin');

    if (nomeUsuario) {
        if (spanBoasVindas) spanBoasVindas.innerText = "Olá, " + nomeUsuario;
        if (btnLogin) btnLogin.style.display = "none";
        if (btnSair) btnSair.style.display = "inline";
        if (linkAdmin) {
            linkAdmin.style.display = (tipoUsuario === 'Admin') ? "inline" : "none";
        }
    }

    btnSair?.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.clear();
        alert('Você saiu da conta!');
        window.location.href = 'index.html';
    });

    // Lógica Saiba Mais e Mensagem
    document.getElementById("saibaMais")?.addEventListener("click", () => {
        document.getElementById("infoSaibaMais")?.classList.toggle("hidden");
    });

    document.getElementById("deixeMensagem")?.addEventListener("click", () => {
        document.getElementById("formMensagem")?.classList.toggle("hidden");
    });
});
