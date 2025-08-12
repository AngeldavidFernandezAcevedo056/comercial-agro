function esResponsive() {
    return window.innerWidth <= 760;
  }
  
  const nav = document.querySelector("#nav");
  const abrir = document.querySelector("#abrir");
  const cerrar = document.querySelector("#cerrar");
  const main = document.querySelector("main");
  const abrirMe = document.querySelector(".abrir-me");
  const contMenu = document.querySelector("#conta-menu");
  const icono = abrirMe.querySelector("i");
  
  // Abrir el menú superior en modo responsive (oculta solo el main)
  abrir.addEventListener("click", () => {
    nav.classList.add("abierto");
    if (esResponsive()) {
      main.classList.add("oculto"); // Ocultar solo el main en responsive
    }
  });
  
  // Cerrar el menú superior en modo responsive (muestra solo el main)
  cerrar.addEventListener("click", () => {
    nav.classList.remove("abierto");
    if (esResponsive()) {
      main.classList.remove("oculto"); // Mostrar solo el main en responsive
    }
  });
  
  // Abrir/cerrar el menú lateral en pantallas normales (independiente del main)
  abrirMe.addEventListener("click", () => {
    const activo = contMenu.classList.toggle("active");
  
    icono.classList.toggle("bi-list", !activo);
    icono.classList.toggle("bi-x", activo);
  
    // No afecta el main, solo el contMenu
  });
  
  // Ajustar visibilidad al cambiar el tamaño de la ventana
  window.addEventListener("resize", () => {
    if (!esResponsive()) {
      // En pantallas normales, mostrar siempre el main y el contMenu
      main.classList.remove("oculto");
      contMenu.classList.remove("active");
      icono.classList.add("bi-list");
      icono.classList.remove("bi-x");
    } else {
      // En responsive, restaurar el estado según el menú superior
      if (nav.classList.contains("abierto")) {
        main.classList.add("oculto");
      } else {
        main.classList.remove("oculto");
      }
    }
  });
  

  document.addEventListener("DOMContentLoaded", () => {
    const inputBusqueda = document.getElementById("busqueda-input");
    const botonBusqueda = document.getElementById("buscar-btn");
  
    if (inputBusqueda && botonBusqueda) {
      botonBusqueda.addEventListener("click", () => {
        const nombre = inputBusqueda.value.trim();
        if (nombre) {
          // Redirige a producto.html con el nombre como parámetro
          window.location.href = `/html/producto.html?nombre=${encodeURIComponent(nombre)}`;
        }
      });
  
      inputBusqueda.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          botonBusqueda.click();
        }
      });
    }
  });
  