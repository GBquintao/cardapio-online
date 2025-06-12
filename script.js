document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    const cart = [];
    const themeToggle = document.getElementById('themeToggle');
    const searchInput = document.getElementById('searchInput');
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const currentYear = document.getElementById('currentYear');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Ano atual no footer
    currentYear.textContent = new Date().getFullYear();
    
    // Tema escuro/claro
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Verificar tema salvo
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Pesquisa no cardápio
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        menuItems.forEach(item => {
            const itemName = item.dataset.name.toLowerCase();
            const itemDescription = item.querySelector('.item-description').textContent.toLowerCase();
            
            if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Abrir/fechar carrinho
    cartBtn.addEventListener('click', function() {
        cartModal.style.display = 'block';
    });
    
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    // Adicionar item ao carrinho
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.dataset.name;
            const itemPrice = parseFloat(menuItem.dataset.price);
            const itemImage = menuItem.querySelector('.item-image').src;
            
            addToCart(itemName, itemPrice, itemImage);
        });
    });
    
    // Função para adicionar ao carrinho
    function addToCart(name, price, image) {
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1,
                image: image
            });
        }
        
        updateCart();
    }
    
    // Atualizar carrinho
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        let itemCount = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            itemCount += item.quantity;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="50" height="50" style="object-fit: cover; border-radius: 5px;">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        // Atualizar contador e total
        cartCount.textContent = itemCount;
        cartTotal.textContent = total.toFixed(2).replace('.', ',');
        
        // Adicionar eventos para os botões de quantidade
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart[index].quantity += 1;
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
    
    // Finalizar pedido no WhatsApp
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        let message = 'Olá, gostaria de fazer o seguinte pedido:\n\n';
        
        cart.forEach(item => {
            message += `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
        });
        
        message += `\nTotal: R$ ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2).replace('.', ',')}`;
        message += '\n\nObrigado!';
        
        const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
});