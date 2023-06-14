// Variables
const imagesContainer = document.querySelector(".images"),
      loadMoreBtn = document.querySelector(".load-more"),
      searchInput = document.querySelector(".search-box input"),
      lightBox = document.querySelector(".lightbox"),
      closeBtn = document.querySelector(".fa-x"),
      dowmloadImgBtnLightBox = document.querySelector(".fa-download"),
      btnScroll = document.querySelector(".scroll-top-btn")


const API_KEY = "" //TU API KEY
const perPage = 15
let currentPage = 1
let searchTerm = null


// Funciones
const dowmloadImg = async (imgURL) => {
    // Blob (Binary Large Object): Representa datos binarios de manera estructurada. Un objeto Blob puede contener cualquier tipo de datos, como imágenes, archivos de audio, videos, datos en bruto, etc. Un Blob se crea utilizando el constructor Blob() o mediante métodos específicos de API que generan objetos Blob.


    try {
        // Convertir img recibido a blob, crear su enlace de descarga y descargarlo

        const res = await fetch(imgURL),
              blob = await res.blob()

        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = new Date().getTime() // Este va a ser el nombre del archivo, ej: 160568200.jpg
        a.click()
        
    } catch (error) {
        alert("Fallo al descargar la imagen!")  
    }  
}

const showLightBox = (name, img) => {
    lightBox.querySelector("img").src = img
    lightBox.querySelector("span").innerHTML = name
    lightBox.classList.add("show")
    dowmloadImgBtnLightBox.setAttribute("data-img", img)
    document.body.style.overflow = "hidden"
    btnScroll.classList.add("hidden")
}

const generateImagesHtml = (images) => {
    imagesContainer.innerHTML += images.map((img) => 
        `<li class="card" onclick="showLightBox('${img.photographer}', '${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
            <article class="details">
                <div class="photographer">
                    <i class="fa-solid fa-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="dowmloadImg('${img.src.large2x}'); event.stopPropagation()"><i class="fa-solid fa-download"></i></button>
            </article>
        </li>`
    ).join("")
}

const getImages = async (API_URL) => {
    try {
        loadMoreBtn.innerHTML = "Cargando..."
        loadMoreBtn.classList.add("disabled")

        const parameterFetch = {
            headers: {
                Authorization: API_KEY
            }
        }

        const res = await fetch(API_URL, parameterFetch),
              json = await res.json()

        generateImagesHtml(json.photos)

        loadMoreBtn.innerHTML = "Cargar Mas"
        loadMoreBtn.classList.remove("disabled")
        
    } catch (error) {
        alert("Ha ocurrido un error al cargar las imagenes")
    }
}

const loadMoreImages = () => {
    currentPage++ // Incrementar la pagina actual por 1

    // Si el searchTerm tiene algún valor entonces llama a la api con el término de búsqueda si no llama a la api por defecto
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`

    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL

    getImages(apiURL)
}

const loadSearchImages = (e) => {
    // Si la entrada de búsqueda es vacia, establecer el searchTerm a null y devolver el searchTerm
    if(e.target.value === "") return searchTerm = null

    // Si presiona enter, actualiza la página actual, busca el término y llama a getImages
    if(e.key === "Enter"){
        currentPage = 1
        searchTerm = e.target.value
        imagesContainer.innerHTML = ""
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
    getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)
})

window.addEventListener("scroll", (e) => {
    let scrollTop = window.scrollY

    if(scrollTop > 1000){
        btnScroll.classList.remove("hidden")
    }else{
        btnScroll.classList.add("hidden")
    }
})

document.addEventListener("click", (e) => {
    if(e.target === loadMoreBtn) loadMoreImages()

    if(e.target === closeBtn) {
        lightBox.classList.remove("show")
        document.body.style.overflow = "auto"
    }

    if(e.target === dowmloadImgBtnLightBox) dowmloadImg(e.target.dataset.img)

    if(e.target === btnScroll){
        window.scrollTo({
            behavior: "smooth",
            top: 0
        })
    }
})

searchInput.addEventListener("keyup", loadSearchImages)