// producto.js
const API_PRODUCTOS = "http://localhost:3000/productos";

function resolveImgPath(imagen) {
  if (!imagen) return "/imagenes/placeholder.png"; // crea placeholder si hace falta
  if (imagen.startsWith("http://") || imagen.startsWith("https://")) return imagen;
  if (imagen.startsWith("/")) return imagen; // ya path absoluto
  if (imagen.startsWith("imagenes/")) return "/" + imagen;
  return "/imagenes/" + imagen; // filename -> /imagenes/filename.ext
}

document.addEventListener("DOMContentLoaded", () => {
  fetch(API_PRODUCTOS)
    .then(res => res.json())
    .then(productos => {
      // Guardamos todos los productos en localStorage para que detalle/favoritos puedan usarlos
      localStorage.setItem("todosProductos", JSON.stringify(productos));

      productos.forEach(producto => {
        const categoriaId = producto.categoria.toLowerCase().replace(/\s+/g, "-");
        const contenedor = document.getElementById(`${categoriaId}-contenedor`);
        if (!contenedor) return;

        const imgSrc = resolveImgPath(producto.imagen);

        const card = document.createElement("div");
        card.classList.add("producto");

        card.innerHTML = `
          <div class="producto-contenido">
            <img src="${imgSrc}" alt="${producto.nombre}">
            <div class="producto-info">
              <h3><strong>${producto.nombre}</strong></h3>
              <p class="producto-descripcion">${producto.descripcion}</p>
              <button class="btn-ver-mas" title="Ver más detalles">
                <i class="bi bi-card-list"></i> Ver más
              </button>
            </div>
          </div>
        `;

        // "Ver más" lleva a detalle (guardamos productoSeleccionado y la lista completa)
        card.querySelector(".btn-ver-mas").addEventListener("click", (e) => {
          e.stopPropagation();
          localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
          localStorage.setItem("todosProductos", JSON.stringify(productos));
          window.location.href = "/html/detalle-producto.html";
        });

        card.addEventListener("click", () => {
          document.querySelectorAll(".producto.seleccionado").forEach(el => el.classList.remove("seleccionado"));
          card.classList.add("seleccionado");
        });

        contenedor.appendChild(card);
      });

      function getParametroURL(nombre) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(nombre);
      }
      
      function buscarYResaltarProducto(nombreBuscado) {
        if (!nombreBuscado) return;
      
        const productosDOM = document.querySelectorAll(".producto");
        let encontrado = false;
      
        productosDOM.forEach(card => {
          const titulo = card.querySelector("h3 strong");
          if (titulo && titulo.textContent.toLowerCase().includes(nombreBuscado.toLowerCase())) {
            encontrado = true;
      
            // Obtener la categoría padre (contenedor) de este producto
            let categoriaContenedor = card.closest(".categoria");
            if (categoriaContenedor) {
              // Scroll a la categoría primero
              categoriaContenedor.scrollIntoView({ behavior: "smooth", block: "start" });
      
              // Después de un pequeño delay, hacer scroll al producto para que quede centrado
              setTimeout(() => {
                card.scrollIntoView({ behavior: "smooth", block: "center" });
                card.classList.add("seleccionado");
              }, 1500);
            } else {
              // Si no tiene categoría, solo hacer scroll al producto
              card.scrollIntoView({ behavior: "smooth", block: "center" });
              card.classList.add("seleccionado");
            }
            categoriaContenedor.scrollIntoView({ behavior: "smooth", block: "start" });


          }
        });
      
        if (!encontrado) {
          console.log(`Producto "${nombreBuscado}" no encontrado para resaltar.`);
        }
      }
        
      const nombreBuscado = getParametroURL("nombre");
            buscarYResaltarProducto(nombreBuscado);



      // scroll al hash si viene
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const seccion = document.querySelector(hash);
          if (seccion) seccion.scrollIntoView({ behavior: "smooth" });
        }, 400);
      }

      // guardar submenu/usuario
      actualizarSubmenu();
    })
    .catch(error => {
      console.error("Error al cargar productos:", error);
    });

  // manejo global clicks para quitar seleccionado y submenu
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".producto")) {
      document.querySelectorAll(".producto.seleccionado").forEach(el => el.classList.remove("seleccionado"));
    }

    const usuarioMenu = document.getElementById("usuario-menu");
    const submenu = document.getElementById("submenu-usuario");
    if (usuarioMenu && submenu && !usuarioMenu.contains(e.target)) {
      submenu.classList.remove("show");
    }
  });

  // Submenu usuario
  const usuarioMenu = document.getElementById("usuario-menu");
  if (usuarioMenu) {
    usuarioMenu.addEventListener("click", () => {
      const submenu = document.getElementById("submenu-usuario");
      if (submenu) submenu.classList.toggle("show");
    });
  }

  function actualizarSubmenu() {
    const submenu = document.getElementById("submenu-usuario");
    const raw = localStorage.getItem("usuario");
    let usuario = null;

    try { usuario = raw ? JSON.parse(raw) : null; } 
    catch (e) { console.error(e); localStorage.removeItem("usuario"); }

    if (!submenu) return;
    submenu.innerHTML = "";

    if (usuario && usuario.nombre) {
      const nombreUsuario = document.getElementById("usuario-nombre");
      if (nombreUsuario) nombreUsuario.textContent = usuario.nombre;

      const verFav = document.createElement("button");
      verFav.textContent = "Mis favoritos";
      verFav.addEventListener("click", () => window.location.href = "/html/favoritos.html");

      const cerrar = document.createElement("button");
      cerrar.textContent = "Cerrar sesión";
      cerrar.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        location.reload();
      });

      submenu.appendChild(verFav);
      submenu.appendChild(cerrar);
    } else {
      const crearCuenta = document.createElement("a");
      crearCuenta.href = "/html/crear-cuenta.html";
      crearCuenta.textContent = "Crear cuenta";

      const iniciarSesion = document.createElement("a");
      iniciarSesion.href = "/html/inicio-sesion.html";
      iniciarSesion.textContent = "Iniciar sesión";

      submenu.appendChild(crearCuenta);
      submenu.appendChild(iniciarSesion);
    }
  }
});
