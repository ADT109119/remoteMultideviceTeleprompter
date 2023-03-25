

function flipMode(){
    document.querySelector(".subtitleContainer").classList.toggle("flip");
}

//連接數量
function refreshDeviceNum(){
    document.querySelector("#connectDeviceNum").innerHTML = ids.length;
}

//自動播放
var autoPlayInterval;
var speed = document.querySelector("#speedInput").value;
function autoPlay(){
    autoPlayInterval = setInterval(() => {
        sendable = false;
        document.documentElement.scrollTo({top: document.documentElement.scrollTop+parseInt(speed*scale)})
        sendMessage({"type": "scroll", "data": document.documentElement.scrollTop, "scale": scale})
    }, 100);
}

function pause(){
    let button = document.querySelector(".playAndPauseButton");
    button.classList.remove("fa-pause");
    button.classList.add("fa-play");
    clearInterval(autoPlayInterval);
    sendable = true;
}

function playSwitch(){
    let button = document.querySelector(".playAndPauseButton");
    if(button.classList.contains("fa-play")){
        button.classList.remove("fa-play");
        button.classList.add("fa-pause");
        autoPlay();
    }else{
        button.classList.remove("fa-pause");
        button.classList.add("fa-play");
        clearInterval(autoPlayInterval);
        sendable = true;
    }
}

let subtitleElement = document.querySelector("#subtitle")
document.addEventListener("keydown", (e)=>{
    if(e.key == " " && e.target != subtitleElement){
        e.preventDefault();
        playSwitch();
    }
    controling();
})

//改設定
function settingChange(){
    let fs = document.querySelector("#fontSize").value;
    let ls = document.querySelector("#letterSpacing").value;
    let lh = document.querySelector("#lineHeight").value;
    let sp = document.querySelector("#subtitlePadding").value;
    speed = document.querySelector("#speedInput").value;

    document.body.style.setProperty('--fs', fs)
    document.body.style.setProperty('--ls', ls+'px')
    document.body.style.setProperty('--lh', lh+'px')
    document.body.style.setProperty('--sp', sp+'px')

    settingInputFitValue()

    if(controlMode){
        let data = {
            "type": "setting",
            "data": [fs, ls, lh, speed, sp]
        }
        sendMessage(data);
    }
}

function settingInputFitValue(){

    let fs = document.body.style.getPropertyValue("--fs");
    let ls = document.body.style.getPropertyValue("--ls");
    let lh = document.body.style.getPropertyValue("--lh");
    let sp = document.body.style.getPropertyValue("--sp");

    document.querySelector("#fontSize").value = fs.replace("px", "");
    document.querySelector("#letterSpacing").value = ls.replace("px", "");
    document.querySelector("#lineHeight").value = lh.replace("px", "");
    document.querySelector("#subtitlePadding").value = sp.replace("px", "");
    document.querySelector("#speedInput").value = speed;

    document.querySelector("#fontSize + span").innerHTML = fs + 'px';
    document.querySelector("#letterSpacing + span").innerHTML = ls;
    document.querySelector("#lineHeight + span").innerHTML = lh;
    document.querySelector("#subtitlePadding + span").innerHTML = sp;
    document.querySelector("#speedInput + span").innerHTML = speed;

}

document.querySelectorAll(".settingInput").forEach((item)=>{
    item.oninput = ()=>{
        settingChange()
    }

    /*
    item.onchange = ()=>{
        settingChange()
    }
    item.onmousemove = ()=>{
        settingChange()
    }
    item.touchmove = ()=>{
        settingChange()
    }
    */
})


//開視窗
function openWindow(window){
    
    document.querySelectorAll(".window").forEach((item)=>{
        item.classList.remove("active");
    })

    switch(window){
        case 'editWindow':
            tempSubtitle = document.querySelector("#subtitle").value;
            document.querySelector(".subtitleEdittWindow").classList.add('active')
            break;

        case 'settingWindow':
            document.querySelector('.settingWindow.window').classList.add('active')
            break;

        case 'shareWindow':
            refreshDeviceNum()
            document.querySelector('.shareWindow.window').classList.add('active')
            break;

        case 'infoWindow':
            document.querySelector('.infoWindow.window').classList.add('active')
            break;

        default:
            break;
    }
}

//變更字幕
var tempSubtitle = "";
function subtitleChange(){
    if(ids.length <= 0)
        return;
    let d = {
        "type": "text",
        "data": document.querySelector("#subtitle").value
    }
    sendMessage(d);
}

//顯示字幕
function subtitleDisplay(text){
    var text = text.split("\n");
    if(document.querySelector(".subtitleContainer div"))
        document.querySelector(".subtitleContainer div").remove();
    let div = document.createElement('div');
    div.className = "subtitleDisplayer";
    //div.style.transform = "scale(" + document.body.clientWidth/300 + ")";
    text.forEach((item)=>{
        let p = document.createElement('p');
        p.innerHTML = item;
        if(item == "")
            p.innerHTML+="　";
        div.append(p)

    })

    document.querySelector(".subtitleContainer").append(div);
}