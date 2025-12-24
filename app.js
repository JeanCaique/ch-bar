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

  let convidadosConfirmados =
    JSON.parse(localStorage.getItem('convidadosChaBarTaineCaique')) || [];

  let listaPresentesAtualizada =
    JSON.parse(localStorage.getItem('listaPresentesChaBarTaineCaique')) || presentes;

  const listaPresentesEl = document.getElementById('listaPresentes');
  const btnConfirmar = document.getElementById('confirmar');
  const msgPresenca = document.getElementById('msgPresenca');
  const totalConfirmadosEl = document.getElementById('totalConfirmados');
  const listaConvidadosEl = document.getElementById('listaConvidados');
  const filtroBtns = document.querySelectorAll('.filtro-btn');

  atualizarContador();
  exibirPresentes('todos');
  exibirConvidados();

  btnConfirmar.addEventListener('click', function () {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const acompanhantes = parseInt(document.getElementById('acompanhantes').value);

    if (!nome) {
      alert('Digite seu nome para confirmar presença.');
      return;
    }

    convidadosConfirmados.push({
      id: Date.now(),
      nome,
      email: email || 'Não informado',
      acompanhantes,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });

    localStorage.setItem(
      'convidadosChaBarTaineCaique',
      JSON.stringify(convidadosConfirmados)
    );

    msgPresenca.querySelector('span').textContent =
      acompanhantes > 0
        ? `Presença confirmada para ${acompanhantes + 1} pessoas! 💕`
        : 'Presença confirmada com sucesso! 💕';

    msgPresenca.style.display = 'flex';

    atualizarContador();
    exibirConvidados();
  });

  function exibirPresentes(categoria) {
    listaPresentesEl.innerHTML = '';

    const filtrados = categoria === 'todos'
      ? listaPresentesAtualizada
      : listaPresentesAtualizada.filter(p => p.categoria === categoria);

    filtrados.forEach(presente => {
      const div = document.createElement('div');
      div.className = `item-presente ${presente.reservado ? 'reservado' : ''}`;

      div.innerHTML = `
        <h3>${presente.nome}</h3>
        <p>${presente.descricao}</p>
        ${presente.reservado
          ? `<small>Reservado por: ${presente.reservadoPor}</small>`
          : `<button class="btn-reservar" data-id="${presente.id}">Presentear o casal</button>`
        }
      `;

      listaPresentesEl.appendChild(div);
    });

    document.querySelectorAll('.btn-reservar').forEach(btn => {
      btn.onclick = () => reservarPresente(parseInt(btn.dataset.id));
    });
  }

  function reservarPresente(id) {
    const nome = prompt('Digite seu nome para presentear Taine e Caique:');
    if (!nome) return;

    const presente = listaPresentesAtualizada.find(p => p.id === id);
    if (!presente || presente.reservado) return;

    presente.reservado = true;
    presente.reservadoPor = nome;

    localStorage.setItem(
      'listaPresentesChaBarTaineCaique',
      JSON.stringify(listaPresentesAtualizada)
    );

    alert(`Obrigado, ${nome}! 💕`);
    exibirPresentes('todos');
  }

  function exibirConvidados() {
    listaConvidadosEl.innerHTML = '';
    convidadosConfirmados.forEach(c =>
      listaConvidadosEl.innerHTML += `<p><strong>${c.nome}</strong></p>`
    );
  }

  function atualizarContador() {
    let total = 0;
    convidadosConfirmados.forEach(c => total += 1 + c.acompanhantes);
    totalConfirmadosEl.textContent = total;
  }

});
