// Product Data
const products = [
  {
    id: 1,
    name: "Luvas de Kickboxing Profissionais",
    price: 189.99,
    image: "https://cdn.awsli.com.br/969/969783/produto/96579899/vermelha2-vc984dbcm6.png",
    featured: true,
  },
  {
    id: 2,
    name: "Caneleiras de Proteção Premium",
    price: 129.99,
    image: "https://cdn.awsli.com.br/2500x2500/969/969783/produto/161933497/e9cbcb43e7.jpg",
    featured: true,
  },
  {
    id: 3,
    name: "Protetor Bucal Moldável",
    price: 39.99,
    image: "https://m.media-amazon.com/images/I/51j7uw9yUcL._UF1000,1000_QL80_.jpg",
    featured: true,
  },
  {
    id: 4,
    name: "Faixa Preta Tradicional",
    price: 49.99,
    image: "https://http2.mlstatic.com/D_Q_NP_2X_792325-MLB89154497201_082025-T-faixa-jiu-jitsu-adulto-tradicional-6-costuras-xgear.webp",
    featured: false,
  },
  {
    id: 5,
    name: "Saco de Pancadas Pesado 40kg",
    price: 299.99,
    image: "https://images.tcdn.com.br/img/img_prod/695901/180_saco_de_pancada_90_cm_boxe_suporte_de_teto_gorilla_679_1_19b5ce6d84116e0d05254c907d5611fd.png",
    featured: false,
  },
  {
    id: 6,
    name: "Bandagem Elástica para Mãos",
    price: 24.99,
    image: "https://muvin.com.br/cdn/shop/products/bandagem-elastica-elasticidade-preto.jpg?v=1643630785",
    featured: false,
  },
]

// Cart State
let cart = []
let currentView = "grid"

// DOM Elements
const featuredGrid = document.getElementById("featured-grid")
const productsGrid = document.getElementById("products-grid")
const cartSidebar = document.querySelector(".cart-sidebar")
const cartOverlay = document.querySelector(".cart-overlay")
const cartItems = document.querySelector(".cart-items")
const cartCount = document.querySelector(".cart-count")
const cartTotal = document.getElementById("cart-total")
const mobileMenu = document.querySelector(".mobile-menu")
const successMessage = document.getElementById("success-message")

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadFeaturedProducts()
  loadAllProducts()
  updateCartUI()
  setupEventListeners()
})

// Setup Event Listeners
function setupEventListeners() {
  // View toggle buttons
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const view = this.dataset.view
      toggleView(view)
    })
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Load Featured Products
function loadFeaturedProducts() {
  const featuredProducts = products.filter((product) => product.featured)
  featuredGrid.innerHTML = featuredProducts.map((product) => createProductCard(product)).join("")
}

// Load All Products
function loadAllProducts() {
  productsGrid.innerHTML = products.map((product) => createProductCard(product)).join("")
}

// Create Product Card HTML
function createProductCard(product) {
  return `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">R$ ${product.price.toFixed(2).replace(".", ",")}</p>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `
}

// Toggle View (Grid/List)
function toggleView(view) {
  currentView = view

  // Update button states
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-view="${view}"]`).classList.add("active")

  // Update grid classes
  productsGrid.className = view === "list" ? "products-grid list-view" : "products-grid"

  // Update product card classes
  document.querySelectorAll(".product-card").forEach((card) => {
    if (view === "list") {
      card.classList.add("list-view")
    } else {
      card.classList.remove("list-view")
    }
  })
}

// Add to Cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...product,
      quantity: 1,
    })
  }

  updateCartUI()
  showSuccessMessage()
}

// Remove from Cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCartUI()
}

// Update Cart UI
function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
  cartCount.style.display = totalItems > 0 ? "flex" : "none"

  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">Seu carrinho está vazio</p>'
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace(".", ",")} x ${item.quantity}</div>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ef4444; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `,
      )
      .join("")
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartTotal.textContent = total.toFixed(2).replace(".", ",")
}

// Toggle Cart Sidebar
function toggleCart() {
  cartSidebar.classList.toggle("active")
  cartOverlay.classList.toggle("active")
  document.body.style.overflow = cartSidebar.classList.contains("active") ? "hidden" : "auto"
}

// Toggle Mobile Menu
function toggleMobileMenu() {
  mobileMenu.classList.toggle("active")
}

// Close Mobile Menu
function closeMobileMenu() {
  mobileMenu.classList.remove("active")
}

// Show Success Message
function showSuccessMessage() {
  successMessage.classList.add("show")
  setTimeout(() => {
    successMessage.classList.remove("show")
  }, 3000)
}

// Handle Contact Form
function handleContactForm(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  // Simulate form submission
  alert(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso. A equipe Fúria Fight entrará em contato em breve.`)

  // Reset form
  event.target.reset()
}

// Smooth scroll to top when clicking logo
document.querySelector(".nav-brand").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})
