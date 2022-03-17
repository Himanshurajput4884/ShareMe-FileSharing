const dropzone = document.querySelector('.upload_cont');
const inputfile = document.querySelector('#inputfile');
const browse = document.querySelector('.browse');
const output = document.getElementById("output");
const link = document.querySelector(".link");
const pasteicon = document.querySelector("#pasteicon");
const displaylink = document.querySelector("#displaylink");
const emailform = document.querySelector('#emailform');
const linkshare = document.querySelector('.linkshare-container');
const cont1 = document.querySelector('.cont1');

const host = "http://localhost:3005/";
const uploadurl = `${host}api/files`;
const emailurl = `${host}api/files/send`;


dropzone.addEventListener("dragover", (eve)=>{
    eve.preventDefault();
    console.log('dragging');
    if(!dropzone.classList.contains("dragged")){
        dropzone.classList.add('dragged');
    }
});

dropzone.addEventListener('dragleave', ()=>{
    dropzone.classList.remove('dragged');
});


dropzone.addEventListener("drop", (eve)=>{
    eve.preventDefault();
    dropzone.classList.remove("dragged");
    const files = eve.dataTransfer.files;
    console.log(files.length);
    if(files.length){    // if there are some files, then only it transfered it.        
        inputfile.files = files;
        uploadfile();
    }

})

inputfile.addEventListener('change', ()=>{
    uploadfile();
})


const uploadfile = ()=>{
    const file = inputfile.files[0];   // only take the first file we get.
    const formdata = new FormData();       // it create a form data with that we make post request.
    formdata.append("FileName", file);             // store the file in form data.

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if(xhr.readyState == XMLHttpRequest.DONE){
            uploadSuccess(xhr.responseText);
        }          
    }


    xhr.open("POST", uploadurl);  

    xhr.send(formdata);
}

const uploadSuccess = (res)=>{
    inputfile.value = "";
    emailform[2].removeAttribute("disabled");
    emailform[2].innerText = "Send";
    linkshare.style.display = "flex";
    cont1.style.height = "450px";
    const { file: url } = JSON.parse(res);
    console.log("const s = %s", url);
    displaylink.value = url;
}



browse.addEventListener("click", ()=>{
    inputfile.click();                 // its a function
})



displaylink.addEventListener("click", ()=>{
    displaylink.select();
});

pasteicon.addEventListener("click", ()=>{
    displaylink.select();
    document.execCommand("copy");
});


emailform.addEventListener("submit", (e)=>{
    e.preventDefault();
    
    const url = displaylink.value;
    

    const formdata = {
        uuid:url.split("/").splice(-1, 1)[0],
        // selecting by id
        senders:document.getElementById('sender').value,
        // selecting by name, but required form
        receivers:emailform.elements['receiver'].value
    }

    emailform[2].setAttribute("disabled", "true");
    emailform[2].innerText = "Sending";


    fetch(emailurl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formdata)
    })
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data);
        if(data.message == "Successs"){
            linkshare.style.display = "none";
            cont1.style.height = "200px";
        }
    })
    

})