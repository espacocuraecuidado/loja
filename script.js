/* --- 1. LÓGICA DE PRODUTOS DINÂMICOS --- */

const urlPlanilha = 'https://script.google.com/macros/s/AKfycbx35BCNL4rVOi8CxDtBS5AmHZbmUv9xutT6cz8qcL3ZeRWGB2TuXv60PF5nMLhuktG7/exec';

async function carregarProdutos() {
    const lista = document.getElementById("listaProdutos");
    if (!lista) return;

    lista.innerHTML = "<p>Carregando vitrine carinhosa...</p>";

    try {
        // Busca os produtos da planilha (doGet com acao=listarProdutos)
        const resposta = await fetch(urlPlanilha + "?acao=listarProdutos");
        const produtos = await resposta.json();

        lista.innerHTML = ""; // Limpa o carregando

        produtos.forEach(produto => {
            const item = document.createElement("div");
            item.className = "card-produto"; // Use as classes do seu CSS
            item.style = "border: 1px solid #ddd; padding: 15px; margin: 10px; border-radius: 8px; text-align: center; display: inline-block; width: 200px;";
            
            item.innerHTML = `
                <a href="produto.html?id=${produto.id}" style="text-decoration: none; color: black;">
                    <img src="${produto.imagem}" alt="${produto.nome}" width="150" style="border-radius: 5px;">
                    <p><strong>${produto.nome}</strong></p>
                    <p style="color: #e8b4b8; font-weight: bold;">R$ ${produto.preco.toFixed(2)}</p>
                    <p style="font-size: 0.8rem;">Estoque: ${produto.estoque}</p>
                </a>
                <button onclick="finalizarCompra('${produto.nome}', ${produto.preco})" 
                    ${produto.estoque <= 0 ? 'disabled' : ''} 
                    style="background-color: ${produto.estoque > 0 ? '#e8b4b8' : '#ccc'}; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    ${produto.estoque > 0 ? 'Comprar Agora' : 'Esgotado'}
                </button>
            `;
            lista.appendChild(item);
        });
    } catch (erro) {
        lista.innerHTML = "<p>Erro ao carregar produtos. Tente atualizar a página.</p>";
        console.error("Erro:", erro);
    }
}

// Inicia a carga dos produtos
carregarProdutos();

/* --- 2. BOTÕES DE INTERFACE --- */

document.getElementById("saibaMais")?.addEventListener("click", function() {
    document.getElementById("infoSaibaMais").classList.toggle("hidden");
});

document.getElementById("deixeMensagem")?.addEventListener("click", function() {
    document.getElementById("formMensagem").classList.toggle("hidden");
});

/* --- 3. CONTROLE DE ACESSO E LOGIN --- */

document.addEventListener('DOMContentLoaded', function() {
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

    if (btnSair) {
        btnSair.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.clear();
            alert('Você saiu da conta com sucesso!');
            window.location.href = 'index.html';
        });
    }

    /* --- 4. CÓDIGO DO AGENDAMENTO --- */
    const formAgendamento = document.getElementById('formAgendamento');
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', function(e) {
            e.preventDefault();
            const dados = {
                acao: "agendar",
                nome: document.getElementById('nomeMae').value,
                whatsapp: document.getElementById('whatsapp').value,
                data: document.getElementById('dataDesejada').value,
                servico: document.getElementById('servico').value
            };

            fetch(urlPlanilha, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(dados)
            }).then(() => {
                alert('Solicitação de agendamento enviada!');
                formAgendamento.reset();
            }).catch(err => alert('Erro ao agendar: ' + err));
        });
    }
});

/* --- 5. FUNÇÃO GLOBAL DE COMPRA --- */

function finalizarCompra(nomeProduto, precoProduto) {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const telAdmin = "55XXXXXXXXXXX"; // COLOQUE SEU NOME E NÚMERO AQUI (com DDD)

    if (!usuarioLogado) {
        alert("Por favor, faça login para realizar uma compra.");
        window.location.href = "login.html";
        return;
    }

    const idPedido = "PED-" + new Date().getTime();
    const confirmar = confirm(`Deseja solicitar a compra de: ${nomeProduto}?\n\nID do Pedido: ${idPedido}`);
    
    if (confirmar) {
        const dadosVenda = {
            acao: "registrarVenda",
            idPedido: idPedido,
            nomeCliente: usuarioLogado,
            produto: nomeProduto,
            valor: precoProduto,
            whatsapp: "Cliente logado" // O admin verá o número no cadastro
        };

        fetch(urlPlanilha, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(dadosVenda)
        })
        .then(() => {
            // MENSAGEM PARA O CLIENTE (No navegador)
            alert("Pedido registrado! Entraremos em contato em breve para validar o pagamento.");

            // MENSAGEM PARA O ADMINISTRADOR (Abre o WhatsApp)
            const msgAdmin = encodeURIComponent(`Olá! O cliente ${usuarioLogado} está tentando contato relativo à compra ID ${idPedido} do produto ${nomeProduto}.`);
            const urlWhatsapp = `https://wa.me/${telAdmin}?text=${msgAdmin}`;
            
            // Abre o WhatsApp em uma nova aba para o Admin ser notificado
            window.open(urlWhatsapp, '_blank');
            
            location.reload(); 
        })
        .catch(erro => alert("Erro ao registrar pedido: " + erro));
    }
}
