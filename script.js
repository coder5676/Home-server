function loadhtml(){
    document.getElementsByClassName("uploaddiv")[0].classList.add("open");
}
function closeupload(){
        document.getElementsByClassName("uploaddiv")[0].classList.remove("open");

}

function togglesidebar(){

    document.getElementsByClassName("sidebar")[0].classList.toggle("close");
}
function toggletop(){

    document.getElementsByClassName("dis")[0].classList.toggle("close");
}


document.addEventListener("DOMContentLoaded", () => {
  const realFile = document.getElementById('realfile');
  const triggerBtn = document.getElementById('trigg');
  const fileName = document.getElementById('filename');
  const select=document.getElementById("myselect");

  if (realFile && triggerBtn && fileName) {
    triggerBtn.addEventListener('click', () => {
      realFile.click();
    });

    realFile.addEventListener('change', () => {
         const selectcategory=select.value;
        const file=realFile.files[0];
       if(!file){
        fileName.textContent = "No file chosen";
      }
      const filetype=file.type;

      let isvalid=false;
      if(selectcategory==="images"){
        isvalid=filetype.startsWith("image/");
      }
 else if(selectcategory==="videos"){
        isvalid=filetype.startsWith("video/");
      }
 else if(selectcategory==="audio"){
        isvalid=filetype.startsWith("audio/");
      }
      else if(selectcategory==="docs"){
        isvalid = (
          filetype === "application/pdf" ||
          filetype === "application/msword" ||
          filetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
      }
      if(isvalid){
      fileName.textContent=file.name;

      }
      else{
        fileName.textContent="Invalid file..."
        realFile.value=""

      }


    });
  }
});


  
function getbytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
}

async function showfiles(type){
    const res=await fetch('/files/list');
    const files=await res.json();
    console.log(files);
    const container=document.getElementsByClassName("loaderdiv")[0];

    const grouped={
      audio:[],
      videos:[],
      images:[],
      docs:[]

    }

    files.forEach(file => {

      if(grouped[file.category]){
        grouped[file.category].push(file);

      }
    });
    let html="";

    const selectedfiles=grouped[type];
    if(type==="docs"){
    html="";

    selectedfiles.forEach(data=>{
      html+=`<div class="textfile"><i class="f fi-rr-file" style="background-color:rgb(0,92,255);"></i><a href=${encodeURI(data.path)} target="_blank" ><p style="background-color:rgb(0,92,255);">${String(data.originalname).slice(0,30)} ...</p></a><p>${String(data.uploadtime).slice(0,10)}</p><p>${getbytes(data.size)}</p><p>${String(data.mimetype).slice(12)}</p><i class="fi fi-rr-apps"></i></div>`
     
    })
  }

  else if(type==="videos"){
    html="";
    selectedfiles.forEach(data=>{
      html+=`<div class="textfile"><i class="f fi-rr-play" style="background-color:mediumslateblue;"></i><a href=${encodeURI(data.path)} target="_blank" ><p style="background-color:mediumslateblue;">${String(data.originalname).slice(0,30)} ...</p></a><p>${String(data.uploadtime).slice(0,10)}</p><p>${getbytes(data.size)}</p><p>${String(data.mimetype).slice(6)}</p><i class="fi fi-rr-apps"></i></div>`

    })
  }
  else if(type==="audio"){
    html="";
    selectedfiles.forEach(data=>{
      html+=`<div class="textfile"><i class="f fi-rr-play" style="background-color:#8fffc3;color:black"></i><a href=${encodeURI(data.path)} target="_blank" ><p style="background-color:#8fffc3;color:black">${String(data.originalname).slice(0,30)} ...</p></a><p>${String(data.uploadtime).slice(0,10)}</p><p>${getbytes(data.size)}</p><p>${String(data.mimetype).slice(6)}</p><i class="fi fi-rr-apps"></i></div>`

    })
  }
  else{
     html="";
    selectedfiles.forEach(data=>{
      html+=` <div class="imagefile"  style="background-image:url(${encodeURI(data.path)})"><button><i class="fi fi-rr-grid"></i></button><a target="_blank" href="${encodeURI(data.path)}"><i class="fi fi-rr-camera"></i><p>${String(data.uploadtime).slice(0,10)}</p></a><button><i class="fi fi-rr-share"></i></button></div>`

    })

  }
   container.innerHTML=html; 

}
document.addEventListener("DOMContentLoaded", () => {
  const vid = document.getElementById("vidbut");
  const aud = document.getElementById("audbut");
  const doc = document.getElementById("docbut");
  const imag = document.getElementById("imgbut");

  vid.addEventListener("click", () => {
    showfiles("videos");
    console.log("videos button clicked");
  });

  aud.addEventListener("click", () => {
    showfiles("audio");
    console.log("audio button clicked");
  });

  doc.addEventListener("click", () => {
    showfiles("docs");
    console.log("docs button clicked");
  });

  imag.addEventListener("click", () => {
    showfiles("images");
    console.log("images button clicked");
  });

  showfiles("docs"); // Initial load
});