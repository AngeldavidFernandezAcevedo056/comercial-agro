// detalle-producto.js
function resolveImgPath(imagen) {
    if (!imagen) return "/imagenes/placeholder.png";
    if (imagen.startsWith("http://") || imagen.startsWith("https://")) return imagen;
    if (imagen.startsWith("/")) return imagen;
    if (imagen.startsWith("imagenes/")) return "/" + imagen;
    return "/imagenes/" + imagen;
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    let producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
    let todos = JSON.parse(localStorage.getItem("todosProductos")) || [];
  
    // Si no hay lista completa, intentamos traerla del backend
    if (!todos || todos.length === 0) {
      try {
        const res = await fetch("http://localhost:3000/productos");
        if (res.ok) {
          todos = await res.json();
          localStorage.setItem("todosProductos", JSON.stringify(todos));
        }
      } catch (e) {
        console.warn("No se pudo cargar lista completa desde backend:", e);
      }
    }
  
    // Si no hay producto seleccionado intentamos obtener por id en query string (opcional)
    if (!producto) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id && todos.length > 0) {
        producto = todos.find(p => String(p.id) === String(id));
      }
    }
  
    // Usuario en header
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const nombreUsuarioElem = document.getElementById("nombreUsuario");
    if (nombreUsuarioElem) nombreUsuarioElem.textContent = usuario ? usuario.nombre : "Invitado";
  
    // Favoritos header (boton)
    const btnFavHeader = document.getElementById("btnFavoritosHeader");
    if (btnFavHeader) btnFavHeader.addEventListener("click", () => window.location.href = "/html/favoritos.html");
  
    if (!producto) {
      document.getElementById("detalle-container").innerHTML = "<p>Producto no encontrado. Selecciona uno desde la página de productos.</p>";
      return;
    }
  
    mostrarDetalle(producto);
    mostrarRelacionados(producto, todos);
  });
  
  function mostrarDetalle(p) {
    const contenedor = document.getElementById("detalle-container");
    const imgSrc = resolveImgPath(p.imagen);
  
    contenedor.innerHTML = `
      <div class="detalle">
        <div class="imagen-large">
          <img src="${imgSrc}" alt="${p.nombre}" />
        </div>
        <div class="info">
          <h2>${p.nombre}</h2>
          <p><strong>Descripción:</strong> ${p.descripcion || "-"}</p>
          <p><strong>Categoría:</strong> ${p.categoria || "-"}</p>
          ${p.composicion ? `<p><strong>Composición:</strong> ${p.composicion}</p>` : ""}
          <div class="botones-detalle">
            <button class="btn-whatsapp" onclick="consultarDisponibilidad('${encodeURIComponent(p.nombre)}')">
              <i class="bi bi-whatsapp"></i> Consultar disponibilidad
            </button>
  
            <button class="btn-guardar" onclick="guardarFavorito(${p.id}, '${escapeQuotes(p.nombre)}')">
              <i class="bi bi-heart"></i> Guardar en Favoritos
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  function mostrarRelacionados(productoPrincipal, todos) {
    const relacionados = (todos || []).filter(p => p.categoria === productoPrincipal.categoria && String(p.id) !== String(productoPrincipal.id));
    const contenedor = document.getElementById("otros-productos");
    contenedor.innerHTML = "";
  
    if (relacionados.length === 0) {
      contenedor.innerHTML = "<p>No hay más productos en esta categoría.</p>";
      return;
    }
  
    relacionados.forEach(p => {
      const imgSrc = resolveImgPath(p.imagen);
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <img src="${imgSrc}" alt="${p.nombre}" />
        <h4>${p.nombre}</h4>
      `;
      div.onclick = () => {
        // Guardamos seleccionado y la lista completa y navegamos a detalle (misma página)
        localStorage.setItem("productoSeleccionado", JSON.stringify(p));
        localStorage.setItem("todosProductos", JSON.stringify(todos || []));
        // redirigir a la misma página para refrescar contenido (más limpio que location.reload)
        window.location.href = "/html/detalle-producto.html";
      };
      contenedor.appendChild(div);
    });
  }
  
  function consultarDisponibilidad(nombreProducto = "") {
    const telefono = "18091234567"; // reemplaza por número real (formato internacional si es necesario)
    const mensaje = `Hola, quisiera consultar la disponibilidad del producto: ${decodeURIComponent(nombreProducto)}`;
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, "_blank");
  }
  
  function guardarFavorito(idProducto, nombreProducto) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      mostrarNotificacion("Debes iniciar sesión para guardar favoritos.");
      return;
    }
  
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || {};
    if (!favoritos[usuario.id]) favoritos[usuario.id] = [];
  
    // normalizamos a string
    const idStr = String(idProducto);
    if (!favoritos[usuario.id].includes(idStr)) {
      favoritos[usuario.id].push(idStr);
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
      mostrarNotificacion(`"${nombreProducto}" fue añadido a tus favoritos.`);
    } else {
      mostrarNotificacion(`"${nombreProducto}" ya está en tus favoritos.`);
    }
  }
  
  function mostrarNotificacion(mensaje) {
    const noti = document.getElementById("notificacion");
    if (!noti) return;
    noti.textContent = mensaje;
    noti.style.display = "block";
    noti.style.opacity = "1";
    setTimeout(() => {
      noti.style.opacity = "0";
      setTimeout(() => { noti.style.display = "none"; }, 400);
    }, 2500);
  }
  
  function escapeQuotes(s) {
    return (s + "").replace(/'/g, "\\'").replace(/"/g, '\\"');
  }
  