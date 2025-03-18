// Lista de participantes
let participantes = [];
let participantesParaSorteio = [...participantes]; // Cópia da lista para sorteio
let historicoNomes = [];

let botoesRemover;
let botaoAdd = selecionarElemento('.button-add');
let listaAmigos = selecionarElemento('listaAmigos');
let listaHistorico = selecionarElemento('historicoNomes');
let resultadoElement = selecionarElemento('resultado');
let botaoNovoSorteio = selecionarElemento('.button-reset');
let botaoSortear = selecionarElemento('.button-draw');
let mensagemElement = selecionarElemento('mensagemAdicionado');
let contadorElement = selecionarElemento('contador');

function selecionarElemento(seletor) {
    if (seletor.startsWith('.')) {
        return document.querySelector(seletor);
    } else {
        return document.getElementById(seletor);
    }
}

// Adiciona um participante
function adicionarAmigo() {
    const input = document.getElementById('amigo');
    const nome = input.value.trim();
    if (!nome) {
        alert("Por favor, insira um nome.");
        return;
    }
    if (!participantes.includes(nome)) {
        participantes.push(nome);
        participantesParaSorteio.push(nome);
        historicoNomes.push(nome);
        atualizarInterface();
        input.value = '';
    } else {
        alert('Este amigo já foi adicionado!');
    }
}

// Atualiza a lista de participantes exibida
function atualizarListaParticipantes() {
    listaAmigos.innerHTML = '';
    const fragment = document.createDocumentFragment();
    participantes.forEach(participante => {
        const li = document.createElement('li');
        li.textContent = participante;
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'X';
        btnRemover.classList.add('btn__remover'); // Adiciona classe ao botão
        btnRemover.onclick = (e) => {
            e.stopPropagation(); // Impede a propagação do evento
            removerParticipante(participante);
        };
        li.appendChild(btnRemover);
        fragment.appendChild(li);
    });
    listaAmigos.appendChild(fragment);
    botoesRemover = document.querySelectorAll('.btn__remover'); // Inicializa a variável global
}

// Remove um participante
function removerParticipante(nome) {
    participantes = participantes.filter(participante => participante !== nome);
    participantesParaSorteio = participantesParaSorteio.filter(participante => participante !== nome);
    atualizarInterface();
}

// Adiciona um nome do histórico à lista de sorteio
function adicionarNomeAoSorteio(nome) {
    if (!participantes.includes(nome)) {
        participantes.push(nome);
        participantesParaSorteio.push(nome);
        atualizarInterface();
        exibirMensagemAdicionadoOuNovoSorteio(nome);
    } else {
        alert('Este amigo já foi adicionado!');
    }
}

// Atualiza o histórico de nomes exibido
function atualizarHistoricoNomes() {
    listaHistorico.innerHTML = '';
    const fragment = document.createDocumentFragment();
    historicoNomes.forEach(nome => {
        const li = document.createElement('li');
        li.textContent = nome;
        li.onclick = () => adicionarNomeAoSorteio(nome);
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'X';
        btnRemover.onclick = (e) => {
            e.stopPropagation(); // Impede a propagação do evento
            removerNomeHistorico(nome);
        };
        li.appendChild(btnRemover);
        fragment.appendChild(li);
    });
    listaHistorico.appendChild(fragment);
}

// Remove um nome do histórico
function removerNomeHistorico(nome) {
    historicoNomes = historicoNomes.filter(n => n !== nome);
    atualizarHistoricoNomes();
}

// Sorteia um amigo secreto
function sortearUmAmigo(participantes) {
    const index = Math.floor(Math.random() * participantes.length);
    const sorteado = participantes[index];
    participantes.splice(index, 1);
    return sorteado;
}

// Sorteia e exibe o resultado
function sortearAmigo() {
    if (participantesParaSorteio.length === 0) {
        return alert('Não há amigos para sorteio!');
    }

    botoesRemover.forEach(botao => botao.setAttribute('disabled', 'true'));
    botaoAdd.setAttribute('disabled', 'true');

    const amigo = sortearUmAmigo(participantesParaSorteio);
    resultadoElement.innerHTML = '';
    const li = document.createElement('li');
    li.textContent = `Você tirou ${amigo}`;
    li.classList.add('disabled'); // Adiciona a classe 'disabled' para desabilitar o clique
    resultadoElement.appendChild(li);

    botaoSortear.textContent = 'Limpar resultado';
    botaoSortear.onclick = () => {
        resultadoElement.innerHTML = '';
        if (participantesParaSorteio.length === 0) {
            botaoNovoSorteio.removeAttribute('disabled');
        }
        botaoSortear.textContent = 'Sortear amigo';
        botaoSortear.onclick = sortearAmigo;
        atualizarContador();
        habilitarCliqueHistorico(); // Habilita o clique nos itens do histórico
    };

    atualizarContador();
    desabilitarCliqueHistorico(); // Desabilita o clique nos itens do histórico
}

// Desabilita o clique nos itens do histórico
function desabilitarCliqueHistorico() {
    const itensHistorico = document.querySelectorAll('#historicoNomes li');
    itensHistorico.forEach(item => {
        item.classList.add('disabled');
        item.onclick = null;
    });
}

// Habilita o clique nos itens do histórico
function habilitarCliqueHistorico() {
    const itensHistorico = document.querySelectorAll('#historicoNomes li');
    itensHistorico.forEach(item => {
        item.classList.remove('disabled');
        item.onclick = () => adicionarNomeAoSorteio(item.textContent);
    });
}

// Reseta o sorteio
function resetarSorteio() {
    participantesParaSorteio = [...participantes];
    atualizarInterface();
    exibirMensagemAdicionadoOuNovoSorteio();
    botaoNovoSorteio.setAttribute('disabled', 'true');
    botaoAdd.removeAttribute('disabled');
    habilitarCliqueHistorico(); // Habilita o clique nos itens do histórico
}

// Exibe a mensagem "adicionado" ou "novo sorteio"
function exibirMensagemAdicionadoOuNovoSorteio(nome) {
    mensagemElement.textContent = nome ? `${nome} adicionado` : 'Novo sorteio iniciado';
    mensagemElement.style.display = 'block';
    setTimeout(() => {
        mensagemElement.style.display = 'none';
    }, 2500);
}

// Atualiza o contador de amigos restantes
function atualizarContador() {
    contadorElement.textContent = `Amigos restantes: ${participantesParaSorteio.length}`;
}

// Atualiza a interface
function atualizarInterface() {
    atualizarListaParticipantes();
    atualizarHistoricoNomes();
    atualizarContador();
}

// Inicializa a interface
atualizarInterface();