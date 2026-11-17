(() => {
  'use strict';

  const WA_NUMBER = '6283830086964';
  const PRODUCTS = [
    { 
      id: 'c1', 
      cat: 'cheesecuit', 
      name: 'Cheesecuit Original', 
      price: 22000, 
      img: 'images/original.jpg', 
      emoji: '🍰', 
      desc: 'Klasik, lembut, dengan dasar biskuit butter.' 
    },
    { 
      id: 'c2', 
      cat: 'cheesecuit', 
      name: 'Cheesecuit Oreo', 
      price: 25000, 
      img: 'images/oreo.jpg', 
      emoji: '🍪', 
      desc: 'Remahan oreo renyah di setiap gigitan.', 
      tag: 'Terlaris' 
    },
    { 
      id: 'c3', 
      cat: 'cheesecuit', 
      name: 'Cheesecuit Coklat', 
      price: 25000, 
      img: 'images/coklat.jpg', 
      emoji: '🍫', 
      desc: 'Cokelat pekat yang lumer, manis pas.' 
    },
    { 
      id: 'c4', 
      cat: 'cheesecuit', 
      name: 'Cheesecuit Tiramisu', 
      price: 27000, 
      img: 'images/tiramisu.jpg', 
      emoji: '🤎', 
      desc: 'Aroma kopi dan taburan kakao ala tiramisu.' 
    },
    { 
      id: 'c5', 
      cat: 'cheesecuit', 
      name: 'Cheesecuit Red Velvet', 
      price: 27000, 
      img: 'images/red-velvet.jpg', 
      emoji: '❤️', 
      desc: 'Red velvet lembut dengan krim cheese di atasnya.', 
      tag: 'Favorit' 
    },
    { 
      id: 'd1', 
      cat: 'dalgona', 
      name: 'Dalgona Coffee', 
      price: 18000, 
      img: 'images/dalgona.jpg', 
      emoji: '☕', 
      desc: 'Kopi kocok tebal di atas susu dingin.' 
    }
  ];

  const $ = id => document.getElementById(id);
  const rp = n => 'Rp ' + n.toLocaleString('id-ID');
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem('cd-cart')) || {}; } catch (e) { cart = {}; }
  const save = () => { try { localStorage.setItem('cd-cart', JSON.stringify(cart)); } catch (e) {} };

  let currentFilter = 'all';
  const actionHTML = p => cart[p.id]
    ? '<div class="pstep" role="group" aria-label="Jumlah ' + p.name + '"><button data-id="' + p.id + '" data-d="-1" aria-label="Kurangi ' + p.name + '">−</button><b>' + cart[p.id] + '</b><button data-id="' + p.id + '" data-d="1" aria-label="Tambah ' + p.name + '">+</button></div>'
    : '<button class="add" data-id="' + p.id + '">Tambah</button>';

  function renderProducts(filter = currentFilter) {
    currentFilter = filter;
    let html = '';
    for (let i = 0; i < PRODUCTS.length; i++) {
      let p = PRODUCTS[i];
      if (filter !== 'all' && p.cat !== filter) continue;
      
      let tagHtml = p.tag ? '<span class="tag tag-' + p.tag.toLowerCase() + '">' + p.tag + '</span>' : '';
      let imgHtml = p.img 
        ? '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'"><span class="emo" aria-hidden="true" style="display:none">' + p.emoji + '</span>' 
        : '<span class="emo" aria-hidden="true">' + p.emoji + '</span>';
        
      html += '<article class="prod' + (cart[p.id] ? ' in-cart' : '') + '" data-id="' + p.id + '">';
      html += '<div class="pic">' + tagHtml + imgHtml + '</div>';
      html += '<div class="body"><h3>' + p.name + '</h3><p>' + p.desc + '</p>';
      html += '<div class="row"><span class="price">' + rp(p.price) + '</span><div class="act">' + actionHTML(p) + '</div></div>';
      html += '</div></article>';
    }
    $('products').innerHTML = html;
  }
  renderProducts();

  function refreshCard(id) {
    const card = document.querySelector('.prod[data-id="' + id + '"]');
    if (!card) return;
    const act = card.querySelector('.act'), p = PRODUCTS.find(function(x) { return x.id === id; });
    const hadFocus = act.contains(document.activeElement);
    act.innerHTML = actionHTML(p);
    card.classList.toggle('in-cart', !!cart[id]);
    if (hadFocus) {
      var btn = act.querySelector('[data-d="1"]') || act.querySelector('.add');
      if (btn) btn.focus();
    }
  }

  document.querySelectorAll('.chip').forEach(function(c) {
    c.addEventListener('click', function() {
      document.querySelectorAll('.chip').forEach(function(x) { x.classList.remove('active'); });
      c.classList.add('active');
      renderProducts(c.dataset.f);
    });
  });

  $('products').addEventListener('click', function(e) {
    const b = e.target.closest('button[data-id]');
    if (!b) return;
    const isAdd = b.classList.contains('add');
    change(b.dataset.id, isAdd ? 1 : parseInt(b.dataset.d));
    if (isAdd) toast('Ditambahkan ke keranjang');
  });

  function change(id, d) {
    cart[id] = (cart[id] || 0) + d;
    if (cart[id] <= 0) delete cart[id];
    save(); renderCart(); refreshCard(id);
  }

  function renderCart() {
    const ids = Object.keys(cart);
    let total = 0, count = 0;
    let itemsHtml = '';
    if (ids.length === 0) {
      itemsHtml = '<p class="empty">Keranjang masih kosong. Pilih menu dulu, ya.</p>';
    } else {
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let p = PRODUCTS.find(function(x) { return x.id === id; });
        if (!p) continue;
        total += p.price * cart[id];
        count += cart[id];
        itemsHtml += '<div class="item"><b>' + p.name + '</b><span>' + rp(p.price * cart[id]) + '</span>';
        itemsHtml += '<div class="qty"><button data-id="' + id + '" data-d="-1" aria-label="Kurangi">−</button><span>' + cart[id] + '</span><button data-id="' + id + '" data-d="1" aria-label="Tambah">+</button></div></div>';
      }
    }
    $('items').innerHTML = itemsHtml;
    $('total').textContent = rp(total);
    $('cartCount').textContent = count;
  }

  $('items').addEventListener('click', function(e) {
    const b = e.target.closest('button[data-id]');
    if (b) change(b.dataset.id, parseInt(b.dataset.d));
  });
  renderCart();

  const drawer = $('drawer'), overlay = $('overlay');
  function toggleCart(isOpen) {
    drawer.classList.toggle('open', isOpen);
    drawer.setAttribute('aria-hidden', !isOpen);
    overlay.hidden = !isOpen;
    if (isOpen) $('closeCart').focus(); else $('openCart').focus();
  }

  $('openCart').addEventListener('click', function() { toggleCart(true); });
  $('closeCart').addEventListener('click', function() { toggleCart(false); });
  overlay.addEventListener('click', function() { toggleCart(false); });
  document.addEventListener('keydown', function(e) { 
    if (e.key === 'Escape' && drawer.classList.contains('open')) toggleCart(false); 
  });

  $('checkout').addEventListener('click', function() {
    const ids = Object.keys(cart), name = $('cname').value.trim(), addr = $('caddr').value.trim();
    if (ids.length === 0) { $('cerr').textContent = 'Keranjang masih kosong.'; return; }
    if (name.length < 2 || addr.length < 5) { $('cerr').textContent = 'Isi nama dan alamat antar dulu.'; return; }
    $('cerr').textContent = '';
    let total = 0;
    let lines = [];
    for (let i = 0; i < ids.length; i++) {
      let p = PRODUCTS.find(function(x) { return x.id === ids[i]; });
      let subtotal = p.price * cart[ids[i]];
      total += subtotal;
      lines.push('- ' + p.name + ' x' + cart[ids[i]] + ' = ' + rp(subtotal));
    }
    let msg = 'Halo, saya mau pesan di helloChesee:\n' + lines.join('\n') + '\n\nTotal: ' + rp(total) + '\nNama: ' + name + '\nAlamat: ' + addr;
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  let tt;
  function toast(m) {
    const t = $('toast'); t.textContent = m; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(function() { t.classList.remove('show'); }, 1600);
  }

  $('year').textContent = new Date().getFullYear();
})();