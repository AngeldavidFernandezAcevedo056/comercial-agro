function esResponsive(){
    return window.innerWidth <= 760;
}


const abrir = document.querySelector("#abrir");
const nav = document.querySelector("#nav")
const main = document.querySelector("main");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("abierto")
    if (esResponsive()) {
        main.classList.add("oculto"); //Ocultar solo el main en responsive
      }
})
cerrar.addEventListener("click", () => {
    nav.classList.remove("abierto")
    if (esResponsive()) {
        main.classList.remove("oculto"); //Mostrar solo el main en responsive
      }
})