/* Este arquivo controla a página inicial:
   - Mostra os produtos
   - Exibe o botão "Saiba mais"
   - Exibe o formulário de mensagem
*/

// Exibir informações do botão "Saiba Mais"
document.getElementById("saibaMais").addEventListener("click", function() {
    document.getElementById("infoSaibaMais").classList.toggle("hidden");
});

// Exibir formulário de mensagem
document.getElementById("deixeMensagem").addEventListener("click", function() {
    document.getElementById("formMensagem").classList.toggle("hidden");
});

// Mostrar produtos na página inicial
const lista = document.getElementById("listaProdutos");
lista.innerHTML = `<p>Quantidade de produtos: ${produtos.length}</p>`;

// Percorrer todos os produtos e criar elementos HTML
produtos.forEach(produto => {
    const item = document.createElement("div");
    item.innerHTML = `
        <a href="produto.html?id=${produto.id}">
            <img src="${produto.imagem}" alt="${produto.nome}" width="80">
            <p>${produto.nome}</p>
            <p>Estoque: ${produto.estoque}</p>
        </a>
    `;
    lista.appendChild(item);
    // Função para verificar o status do acesso
function verificarAcesso() {
    const nomeUsuario = localStorage.getItem('usuarioLogado');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');
    const boasVindas = document.getElementById('boasVindas');

    if (nomeUsuario) {
        // Se houver nome no localStorage, é um usuário logado
        boasVindas.innerText = "Olá, " + nomeUsuario;
        btnLogin.classList.add('hidden');
        btnLogout.classList.remove('hidden');
    } else {
        // Se não houver, tratamos como Visitante
        boasVindas.innerText = "Visitante";
        btnLogin.classList.remove('hidden');
        btnLogout.classList.add('hidden');
    }
}
// ... (seus códigos de appendChild e produtos continuam aqui em cima) ...

document.addEventListener('DOMContentLoaded', function() {
    const nomeUsuario = localStorage.getItem('usuarioLogado');
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    
    const spanBoasVindas = document.getElementById('boasVindas');
    const btnLogin = document.getElementById('btnLogin');
    const btnSair = document.getElementById('link-sair'); // ID que está no seu HTML
    const linkAdmin = document.getElementById('linkAdmin');

    if (nomeUsuario) {
        spanBoasVindas.innerText = "Olá, " + nomeUsuario;
        if (btnLogin) btnLogin.style.display = "none";
        if (btnSair) btnSair.style.display = "inline";
        
        // Controle do link Admin
        if (linkAdmin) {
            linkAdmin.style.display = (tipoUsuario === 'Admin') ? "inline" : "none";
        }
    } else {
        if (spanBoasVindas) spanBoasVindas.innerText = "Visitante";
        if (btnLogin) btnLogin.style.display = "inline";
        if (btnSair) btnSair.style.display = "none";
        if (linkAdmin) linkAdmin.style.display = "none";
    }

    if (btnSair) {
        btnSair.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('usuarioLogado');
            localStorage.removeItem('tipoUsuario');
            alert('Você saiu da conta com sucesso!');
            window.location.href = 'index.html';
        });
    }
});
    
// Função para deslogar
function deslogar() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('tipoUsuario'); // Caso use para o Admin depois
    window.location.reload(); // Recarrega a página para voltar ao estado de visitante
}

// Executa a verificação sempre que a página carregar
window.addEventListener('load', verificarAcesso);
});

