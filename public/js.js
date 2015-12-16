
var wsocket;
var parts=[];
      var info=document.createElement('div');
      info.innerHTML='connection closed';
      function connect() {
var nick='';
if(window.localStorage.getItem('nick')==null)
{nick=prompt('введи ник');window.localStorage.setItem('nick',nick);}
else nick=window.localStorage.getItem('nick');
          if(info.parentNode!=null)info.parentNode.removeChild(info);
          if (wsocket!=null)return;
          wsocket = new WebSocket('ws://' + window.location.hostname + ':8080');
	wsocket.onopen=function (){
console.log('connect');
wsocket.send(JSON.stringify({nick:nick,sys:"nick"}));}
          wsocket.onmessage = onMessage;
          wsocket.onclose=function(){document.body.appendChild(info); wsocket=null;};
          
      }
      function onMessage(evt,flags) {
//console.log(evt,typeof(evt.data));

if(typeof(evt.data)=='object'){
var url=document.getElementsByClassName('downloading')[0];
url.style.background='linear-gradient(90deg, #D9F3D6 '+parts.length/url.getAttribute('parts')*100+'%, white 0%)';
parts.push(evt.data);
console.log(parts.length+'|'+url.getAttribute('parts'),parts.length/url.getAttribute('parts')*100);
if (url.getAttribute('parts')>parts.length){
return;
}
var blob=new Blob(parts);
url.className='completed';	
url.removeAttribute('style');
var path=URL.createObjectURL(blob);
url.href=path;
console.log(blob);
url.innerHTML=url.innerHTML.substr( 18,url.innerHTML.length-18);
url.download=url.innerHTML;
if(url.innerHTML.match(/\.(png|jpg|jpeg|gif)$/i))
url.parentElement.innerHTML+='<img src="'+path+'"></img>';
url.style.background='';
var chatScreen=document.getElementById('chatScreen');
 
chatScreen.scrollTop=chatScreen.scrollHeight; 
parts=[];   
}

else
{
     var msg = JSON.parse(evt.data);
 
switch(msg.sys){
case "userMessage":
var chatScreen=document.getElementById('chatScreen');

        var newMSG=document.createElement('div');

var timeSpan=document.createElement('span');
timeSpan.innerHTML=getdate();
timeSpan.className='timeSpan';
newMSG.appendChild(timeSpan);
newMSG.innerHTML+= msg.id+': '+msg.data;

msg.data.replace(/\b(http|https|www|ftp):\/\/.*([a-zа-я0-9])\b/gi,function (url){
if (url!=null){
var xhttp = new XMLHttpRequest();
var isImg=false
xhttp.open('HEAD', url);
xhttp.onreadystatechange = function () {
  
    if (xhttp.readyState == xhttp.DONE ) {
        console.log(xhttp.getResponseHeader("Content-Type"));
if(xhttp.getResponseHeader("Content-Type") && xhttp.getResponseHeader("Content-Type").match(/image/))isImg=true;
console.log(isImg);
  newMSG.innerHTML='';
newMSG.appendChild(timeSpan);

if (isImg)
newMSG.innerHTML+= msg.id+': '+'<br/><a href="'+url+'"><img src="'+url+'"></img><br/>'+url+'</a>';
 else newMSG.innerHTML+= msg.id+': '+'<a href="'+url+'">'+url+'</a>';
 chatScreen.scrollTop=chatScreen.scrollHeight; 
    }  
};
xhttp.send();
}
return ;
}
);

newMSG.className='chatMessage';


chatScreen.appendChild(newMSG);
chatScreen.scrollTop=chatScreen.scrollHeight; 
 break;
case "userEnter": 
        var newMSG=document.createElement('div');
 
var timeSpan=document.createElement('span');
timeSpan.innerHTML=getdate();
timeSpan.className='timeSpan';
newMSG.appendChild(timeSpan);
newMSG.innerHTML+= msg.id+': '+msg.data;
newMSG.className='chatMessage userEnter';
var chatScreen=document.getElementById('chatScreen');
chatScreen.appendChild(newMSG);
chatScreen.scrollTop=chatScreen.scrollHeight; 
break;
case "userExit":         var newMSG=document.createElement('div');

var timeSpan=document.createElement('span');
timeSpan.innerHTML=getdate();
timeSpan.className='timeSpan';
newMSG.appendChild(timeSpan);
newMSG.innerHTML+= msg.id+': '+msg.data;
newMSG.className='chatMessage userExit';
var chatScreen=document.getElementById('chatScreen');
chatScreen.appendChild(newMSG);
chatScreen.scrollTop=chatScreen.scrollHeight; 
;break;
case "onlineUsers":
document.getElementById('onlineUsers').innerHTML="<div class=\"onlineUser\">"+msg.users.join('</div><div class=\"onlineUser\">')+'</div>';
 break;

case "file": 

var newMSG=document.createElement('div');
var timeSpan=document.createElement('span');
timeSpan=document.createElement('span');
timeSpan.innerHTML=getdate();
timeSpan.className='timeSpan';
newMSG.appendChild(timeSpan);
newMSG.innerHTML+= msg.user+': ';
var fileURL=document.createElement('a');
//fileURL.href=msg.file;
fileURL.innerHTML='загружается файл: '+msg.file;
fileURL.className='downloading';
fileURL.setAttribute("parts",msg.parts);
newMSG.appendChild(fileURL);
newMSG.className='chatMessage';
var chatScreen=document.getElementById('chatScreen');
chatScreen.appendChild(newMSG);
chatScreen.scrollTop=chatScreen.scrollHeight; 
}
}
  

      }
      function disconnect(){
          wsocket.close();
      }
      function send(data){
        wsocket.send(data); 

      }
      function sendInput(){
var selectedFiles=document.getElementById('file');
if(selectedFiles.files.length>0)
{var i=0; 
while(i<selectedFiles.files.length) 
{var FILE=selectedFiles.files[i++];
send(JSON.stringify({file:FILE.name,sys:"file",parts:Math.ceil(FILE.size/(1024*128))})); 
var sendedBytes=0;
while(sendedBytes<FILE.size)
send(FILE.slice(sendedBytes,(sendedBytes+=1024*128))); 
 	
}
selectedFiles.value=selectedFiles.defaultValue;
document.getElementById('selector').innerHTML="добавь файлы"; 
return;}

          var i=document.getElementById('input');
if(i.value.length<1) return;
          send(JSON.stringify({input:i.value,sys:"msg"}));
          i.value='';
      }
function onFocus(){
 
}
function sendOnEnter(){
var x=document.getElementById('input');
if(x.value=='\n'){x.value=""; return;}
if(x.value[x.value.length-1]=='\n')
sendInput();
}

function getdate(){
var d=new Date; 
var hh=(d.getHours()<10)?"0"+d.getHours().toString():d.getHours().toString();
var mm=(d.getMinutes()<10)?"0"+d.getMinutes().toString():d.getMinutes().toString();
var ss=(d.getSeconds()<10)?"0"+d.getSeconds().toString():d.getSeconds().toString();
return hh+':' + mm+':' + ss+" ";
}

function fileСount(){
var filescount=document.getElementById('file').files.length;
(filescount>0)?
document.getElementById('selector').innerHTML=filescount+"\nвыбрано "
:document.getElementById('selector').innerHTML="добавь файлы";
}

      
      window.addEventListener("load", connect, false);
