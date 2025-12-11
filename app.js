document.addEventListener("DOMContentLoaded", () => {

  let userName = localStorage.getItem("userName") || "";

  const gifts = [
    "Jogo de panelas",
    "Frigideira antiaderente",
    "Forma de bolo quadrada",
    "Forma de bolo redonda",
    "Forma de pudim",
    "Panela de pressão",
    "Assadeiras",
    "Escorredor de louça",
    "Escorredor de macarrão e forma de gelo",
    "Jogo de potes plásticos e panos de prato",
    "Potes de vidro",
    "Garrafa de água",
    "Tábua de corte (madeira ou vidro)",
    "Conjunto de facas",
    "Jogo de utensílios (concha, espátula, pegador)",
    "Abridor de garrafa e vinho e peneira",
    "Triturador de alho",
    "Triturador de alimentos",
    "Liquidificador",
    "Mixer",
    "Sanduicheira",
    "Cafeteira",
    "Jarra de vidro",
    "Kit de churrasco",
    "Porta mantimentos",
    "Lixeira de cozinha",
    "Tapete passadeira",
    "Lixeira banheiro",
    "Cabides + varal de meias",
    "Varal de chão",
    "Esfregão / Mop",
    "Jogo de pratos",
    "Jogo de copos",
    "Taças de vinho",
    "Taças de água",
    "Taças de cerveja",
    "Caneca de chopp",
    "Jogo de xícaras de café",
    "Baleiro de vidro",
    "Boleira de vidro",
    "Sal e pimenteiro",
    "Travessas de vidro",
    "Jogo de sobremesas",
    "Garrafa de café",
    "Fruteira de mesa"
  ];

  const giftSelect = document.getElementById("giftSelect");
  const statusEl = document.getElementById("status");
  const giftEl = document.getElementById("gift");

  let chosenGifts = JSON.parse(localStorage.getItem("chosenGifts")) || [];
  let presence = localStorage.getItem("presence");

  // Preenchendo a lista de presentes
  gifts.forEach(gift => {
    const option = document.createElement("option");
    option.value = gift;
    option.textContent = gift;

    if (chosenGifts.includes(gift)) {
      option.disabled = true;
      option.textContent += " (já escolhido)";
    }

    giftSelect.appendChild(option);
  });

  // Mostrar status atual
  if (userName) {
    statusEl.innerText = "👤 Convidado: " + userName;
  }

  if (presence) {
    statusEl.innerText =
      userName + (presence === "true" ? " ✅ vai comparecer" : " ❌ não poderá ir");
  }

  // Login
  window.login = function () {
    const name = document.getElementById("name").value;

    if (!name) {
      alert("Digite seu nome");
      return;
    }

    userName = name;
    localStorage.setItem("userName", userName);
    statusEl.innerText = "👤 Convidado: " + userName;
  };

  // Presença
  window.setPresence = function (presente) {
    if (!userName) {
      alert("Faça o login primeiro");
      return;
    }

    localStorage.setItem("presence", presente);
    statusEl.innerText =
      userName + (presente ? " ✅ vai comparecer" : " ❌ não poderá ir");
  };

  // Escolher presente
  window.chooseGift = function () {
    if (!userName) {
      alert("Faça o login primeiro");
      return;
    }

    const gift = giftSelect.value;
    if (!gift) {
      alert("Selecione um presente");
      return;
    }

    if (chosenGifts.includes(gift)) {
      alert("Esse presente já foi escolhido");
      return;
    }

    chosenGifts.push(gift);
    localStorage.setItem("chosenGifts", JSON.stringify(chosenGifts));
    localStorage.setItem("gift", gift);

    giftEl.innerText = "🎁 Presente escolhido: " + gift;

    // Atualiza a lista
    [...giftSelect.options].forEach(opt => {
      if (opt.value === gift) {
        opt.disabled = true;
        opt.textContent += " (já escolhido)";
      }
    });

    alert("Obrigado! Presente registrado ✅");
  };

});
