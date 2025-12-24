document.addEventListener('DOMContentLoaded', function () {

  const presentes = [
    { id: 1, nome: "Liquidificador", categoria: "eletro", descricao: "Para vitaminas, sucos e smoothies deliciosos", reservado: false, reservadoPor: "" },
    { id: 2, nome: "Mixer + Ventilador", categoria: "eletro", descricao: "Mixer para preparos rápidos + Ventilador para os dias quentes", reservado: false, reservadoPor: "" },
    { id: 3, nome: "Sanduicheira", categoria: "eletro", descricao: "Para lanches rápidos e quentinhos", reservado: false, reservadoPor: "" },
    { id: 4, nome: "Cafeteira", categoria: "eletro", descricao: "Para cafés especiais todas as manhãs", reservado: false, reservadoPor: "" },

    { id: 5, nome: "Jogo de Panelas", categoria: "panelas", descricao: "Conjunto completo para cozinhar refeições especiais", reservado: false, reservadoPor: "" },
    { id: 6, nome: "Panela de Pressão", categoria: "panelas", descricao: "Para cozimentos rápidos e nutritivos", reservado: false, reservadoPor: "" },
    { id: 7, nome: "Frigideira Antiaderente", categoria: "panelas", descricao: "Ideal para omeletes, carnes e frituras saudáveis", reservado: false, reservadoPor: "" },

    { id: 11, nome: "Conjunto de Facas", categoria: "utensilios", descricao: "Facas afiadas para diferentes usos", reservado: false, reservadoPor: "" },
    { id: 17, nome: "Kit de Churrasco", categoria: "utensilios", descricao: "Utensílios completos para churrascos", reservado: false, reservadoPor: "" },

    { id: 23, nome: "Jogo de Pratos", categoria: "loucas", descricao: "Conjunto completo para refeições", reservado: false, reservadoPor: "" },
    { id: 25, nome: "Taças de Vinho", categoria: "loucas", descricao: "Para momentos especiais", reservado: false, reservadoPor: "" },

    { id: 32, nome: "Boleira de Vidro", categoria: "decoracao", descricao: "Para bolos e tortas", reservado: false, reservadoPor: "" },
    { id: 36, nome: "Escorredor de Louça", categoria: "limpeza", descricao: "Para secar louças", reservado: false, reservadoPor: "" }
  ];

  let convidadosConfirmados = JSON.parse(localStorage.getItem('convidadosChaBarTaineCaique')) || [];
  let listaPresentesAtualizada = JSON.parse(localStorage.getItem('listaPresentesChaBarTaineCaique')) || presentes;

  const listaPresentesEl = document.getElementById('listaPresentes');
  const btnConfirmar = document.getElementById('confirmar');
  const msgPresenca = document.getElementById('msgPresenca');
  const totalConfirmadosEl = document.getElementById('totalConfirmados');
  const listaConvidadosEl = document.getElementById('listaConvidados');
  const filtroBtns = document.querySelectorAll('.filtro-btn');

  // Inicializar
  atualizarContador();
  exibirPresentes('todos');
  exibirConvidados();

  // Confirmar presença
  btnConfirmar.addEventListener('click', function () {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const acompanhantesSelect = document.getElementById('acompanhantes');
    
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const acompanhantes = parseInt(acompanhantesSelect.value);

    if (!nome) {
      alert('Por favor, digite seu nome para confirmar a presença.');
      nomeInput.focus();
      return;
    }

    // Adicionar convidado
    const convidado = {
      id: Date.now(),
      nome: nome,
      email: email || 'Não informado',
      acompanhantes: acompanhantes,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    convidadosConfirmados.push(convidado);
    localStorage.setItem('convidadosChaBarTaineCaique', JSON.stringify(convidadosConfirmados));

    // Mostrar mensagem personalizada
    const totalPessoas = 1 + acompanhantes;
    const mensagem = totalPessoas > 1 
      ? `Presença confirmada para ${totalPessoas} pessoas! 💕`
      : 'Presença confirmada com sucesso! 💕';
    
    msgPresenca.querySelector('span').textContent = mensagem;
    msgPresenca.style.display = 'flex';

    // Limpar campos
    nomeInput.value = '';
    emailInput.value = '';
    acompanhantesSelect.value = '0';

    // Atualizar contador e lista
    atualizarContador();
    exibirConvidados();

    // Efeito de confete
    criarConfete();

    // Esconder mensagem após 5 segundos
    setTimeout(() => {
      msgPresenca.style.display = 'none';
    }, 5000);
  });

  // Função para exibir presentes
  function exibirPresentes(categoria) {
    listaPresentesEl.innerHTML = '';

    const presentesFiltrados = categoria === 'todos' 
      ? listaPresentesAtualizada 
      : listaPresentesAtualizada.filter(p => p.categoria === categoria);

    if (presentesFiltrados.length === 0) {
      listaPresentesEl.innerHTML = '<p class="sem-itens">Nenhum item encontrado nesta categoria.</p>';
      return;
    }

    // Ordenar por disponibilidade (não reservados primeiro)
    presentesFiltrados.sort((a, b) => {
      if (a.reservado && !b.reservado) return 1;
      if (!a.reservado && b.reservado) return -1;
      return 0;
    });

    presentesFiltrados.forEach(presente => {
      const itemDiv = document.createElement('div');
      itemDiv.className = `item-presente ${presente.reservado ? 'reservado' : ''}`;

      itemDiv.innerHTML = `
        <div class="categoria">${getCategoriaNome(presente.categoria)}</div>
        <h3>${presente.nome}</h3>
        <p class="descricao">${presente.descricao}</p>
        ${presente.reservado 
          ? `<div class="reservado-por"><i class="fas fa-heart"></i> Reservado por: ${presente.reservadoPor}</div>`
          : `<button class="btn-reservar" data-id="${presente.id}"><i class="fas fa-gift"></i> Presentear o Casal</button>`
        }
      `;

      listaPresentesEl.appendChild(itemDiv);
    });

    // Adicionar event listeners aos botões de reserva
    document.querySelectorAll('.btn-reservar').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        reservarPresente(id);
      });
    });
  }

  // Função para reservar presente
  function reservarPresente(id) {
    const nomeConvidado = prompt('Para presentear Tainá e Caíque, por favor, digite seu nome:');
    
    if (!nomeConvidado || nomeConvidado.trim() === '') {
      alert('Reserva cancelada. É necessário informar seu nome.');
      return;
    }
    
    const presenteIndex = listaPresentesAtualizada.findIndex(p => p.id === id);
    
    if (presenteIndex !== -1 && !listaPresentesAtualizada[presenteIndex].reservado) {
      listaPresentesAtualizada[presenteIndex].reservado = true;
      listaPresentesAtualizada[presenteIndex].reservadoPor = nomeConvidado;
      
      localStorage.setItem('listaPresentesChaBarTaineCaique', JSON.stringify(listaPresentesAtualizada));
      
      // Recarregar a lista
      const categoriaAtiva = document.querySelector('.filtro-btn.ativo')?.getAttribute('data-categoria') || 'todos';
      exibirPresentes(categoriaAtiva);
      
      // Mensagem de agradecimento
      alert(`Muito obrigada, ${nomeConvidado}! 💕\n\nTainá e Caíque ficarão muito felizes com "${listaPresentesAtualizada[presenteIndex].nome}"!\n\nEm breve enviaremos mais informações para você.`);
      
      // Efeito de confete
      criarConfete();
    } else {
      alert('Este item já foi escolhido por outra pessoa. Por favor, selecione outro presente.');
    }
  }

  // Função para exibir convidados
  function exibirConvidados() {
    listaConvidadosEl.innerHTML = '';
    
    if (convidadosConfirmados.length === 0) {
      listaConvidadosEl.innerHTML = '<p>Nenhuma confirmação ainda. Seja o primeiro a confirmar!</p>';
      return;
    }
    
    // Ordenar por data (mais recentes primeiro)
    const convidadosOrdenados = [...convidadosConfirmados].reverse();
    
    convidadosOrdenados.forEach(convidado => {
      const convidadoDiv = document.createElement('div');
      convidadoDiv.className = 'convidado';
      
      const acompanhantesInfo = convidado.acompanhantes > 0 
        ? ` + ${convidado.acompanhantes} acompanhante${convidado.acompanhantes > 1 ? 's' : ''}`
        : '';
      
      convidadoDiv.innerHTML = `
        <strong>${convidado.nome}</strong>
        <small>${acompanhantesInfo}</small>
        <br>
        <small>Confirmado: ${convidado.data} às ${convidado.hora}</small>
      `;
      listaConvidadosEl.appendChild(convidadoDiv);
    });
  }

  // Função para atualizar contador
  function atualizarContador() {
    let totalPessoas = 0;
    convidadosConfirmados.forEach(convidado => {
      totalPessoas += 1 + convidado.acompanhantes;
    });
    
    totalConfirmadosEl.textContent = totalPessoas;
  }

  // Função auxiliar para nome da categoria
  function getCategoriaNome(categoria) {
    const categorias = {
      'eletro': 'Eletrodoméstico',
      'panelas': 'Panela/Forma',
      'utensilios': 'Utensílio',
      'loucas': 'Louça/Copo',
      'decoracao': 'Decoração',
      'limpeza': 'Limpeza'
    };
    return categorias[categoria] || categoria;
  }

  // Filtros de categoria
  filtroBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remover classe ativa de todos os botões
      filtroBtns.forEach(b => b.classList.remove('ativo'));
      
      // Adicionar classe ativa ao botão clicado
      this.classList.add('ativo');
      
      // Filtrar itens
      const categoria = this.getAttribute('data-categoria');
      exibirPresentes(categoria);
    });
  });

  // Permitir confirmar presença com Enter no campo nome
  document.getElementById('nome').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      btnConfirmar.click();
    }
  });

  // Efeito de confete
  function criarConfete() {
    const colors = ['#ff6b9d', '#8a4baf', '#ffd6e7', '#e6d4f0'];
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.top = '50%';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.transform = 'translate(-50%, -50%)';
      confetti.style.zIndex = '9999';
      confetti.style.pointerEvents = 'none';
      document.body.appendChild(confetti);
      
      // Animação
      const animation = confetti.animate([
        { transform: 'translate(-50%, -50%)', opacity: 1 },
        { transform: `translate(${Math.random() * 200 - 100}px, 100vh)`, opacity: 0 }
      ], {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
      });
      
      animation.onfinish = () => confetti.remove();
    }
  }

});