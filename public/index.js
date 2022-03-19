// const dotenv = require('dotenv');
// const path = require('path');
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
// const dotenv = require('dotenv');

// dotenv.config({ path: '.env'});

const host = "https://shareme-filesharing.herokuapp.com/";
const uploadurl = `${host}api/files`;
const emailurl = `${host}api/files/send`;

const message = document.querySelector('.message');

//  in byte
const MaxSize = 100*1024*1024;   

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
        if(files.length > 1){
            showMessage('Upload only one file at a time.', false);
            files.value = "";
            return;
        }
        if(files[0].size > MaxSize){
            showMessage('File size should not more than 100 MB.', false);
            files.value = "";
            return;
        }
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
    const msg = 'File Uploaded';
    showMessage(msg, true);
}



browse.addEventListener("click", ()=>{
    inputfile.click();                 // its a function
})



displaylink.addEventListener("click", ()=>{
    displaylink.select();
});

pasteicon.addEventListener("click", ()=>{
    displaylink.select();
    const msg = 'Copied to Clipboard.'
    showMessage(msg, true);
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
            const msg = 'Email is sent.'
            showMessage(msg, true);           
            linkshare.style.display = "none";
            cont1.style.height = "200px";
        }
    })
    
})


const showMessage = (msg, c)=>{
    message.innerText = msg;
    message.style.display = "block";
    if(c){
        message.style.backgroundColor = "rgb(139, 196, 139)";
        message.style.borderColor = "darkgreen";
    }
    else{
        message.style.backgroundColor = "rgb(185, 139, 139)";
        message.style.borderColor = "brown";
    }
    setTimeout(() => {
        message.style.display = "none";
    }, 2000);
}