function esResponsive() {
    return window.innerWidth <= 760;
  }
  
const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar")
const main = document.querySelector("main")

abrir.addEventListener("click", () =>{
    nav.classList.add("abierto");
    if (esResponsive()){
        main.classList.add("oculto")
    }
})

cerrar.addEventListener("click", () =>{
    nav.classList.remove("abierto")
    if (esResponsive()){
        main.classList.remove("oculto");
    }
})

const form = document.querySelector("form");
const correoInput = document.querySelector("#correo");
const passwordInput = document.querySelector("#password");
const errorMsg = document.querySelector(".error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    correo: correoInput.value,
    contrasena: passwordInput.value
  };

  try {
    const respuesta = await fetch("http://localhost:3000/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      localStorage.setItem("usuario", JSON.stringify(resultado.usuario)); 
      window.location.href = "/producto.html";
    } else {
      // Mostrar mensaje de error debajo del formulario
      errorMsg.textContent = resultado.mensaje || "Correo o contraseña incorrectos";
      errorMsg.classList.remove("escondido");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    errorMsg.textContent = "Error de conexión con el servidor.";
    errorMsg.classList.remove("escondido");
  }
});