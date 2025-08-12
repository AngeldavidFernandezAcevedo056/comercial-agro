// Mostrar u ocultar la contraseña de confirmación
function esResponsive() {
  return window.innerWidth <= 760;
}

const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");
const main = document.querySelector("main");
const confirmarInput = document.querySelector("#confirmar");
const icon = document.querySelector("#ojo");

icon.addEventListener("click", () => {
  if (confirmarInput.type === "password") {
    confirmarInput.type = "text";
    icon.classList.replace("bx-eye", "bx-eye-slash");
  } else {
    confirmarInput.type = "password";
    icon.classList.replace("bx-eye-slash", "bx-eye");
  }
});

abrir.addEventListener("click", () => {
  nav.classList.add("abierto");
  if (esResponsive()) {
    main.classList.add("oculto");
  }
});

cerrar.addEventListener("click", () => {
  nav.classList.remove("abierto");
  if (esResponsive()) {
    main.classList.remove("oculto");
  }
});

// Lógica para enviar datos al backend
const form = document.querySelector("#formulario-crear-cuenta");
const nombreInput = document.querySelector("#nombre");
const correoInput = document.querySelector("#email");
const contrasenaInput = document.querySelector("#password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();


  if (contrasenaInput.value !== confirmarInput.value) {
    alert("Las contraseñas no coinciden");
    return;
  }

  const datos = {
    nombre: nombreInput.value,
    correo: correoInput.value,
    contrasena: contrasenaInput.value
  };

  try {
    const respuesta = await fetch("http://localhost:3000/usuarios/crear-cuenta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (respuesta.ok) {

      alert("Cuenta creada exitosamente.");
      window.location.href = "/html/inicio-sesion.html";

    } else {
      alert(resultado.mensaje || "Hubo un error.");
    }
  } catch (error) {
    alert("Error de conexión con el servidor.");
    console.error(error);
  }

});