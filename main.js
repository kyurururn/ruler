let body = document.querySelector("body");

body.style.top = "0px";
body.classList.add("no_scroll");

document.body.addEventListener("touchmove",(e) => {
    if(e.touches.length > 1){
        e.preventDefault();
    }
},{passive:false});

let iphone_wh = {"3g"      :[3.5,320,480],
                 "3gs"     :[3.5,320,480],
                 "4"       :[3.5,320,480],
                 "4s"      :[3.5,320,480],
                 "5"       :[4  ,320,568],
                 "5c"      :[4  ,320,568],
                 "5s"      :[4  ,320,568],
                 "6"       :[4.7,375,667],
                 "6plus"   :[5.5,414,736],
                 "6s"      :[4.7,375,667],
                 "6splus"  :[5.5,414,736],
                 "se"      :[4  ,320,568],
                 "7"       :[4.7,375,667],
                 "7plus"   :[5.5,414,736],
                 "8"       :[4.7,375,667],
                 "8plus"   :[5.5,414,736],
                 "X"       :[5.8,375,812],
                 "XS"      :[5.8,375,812],
                 "XSMAX"   :[6.5,414,896],
                 "XR"      :[6.1,414,896],
                 "11"      :[6.1,414,896],
                 "11pro"   :[5.8,375,812],
                 "11promax":[6.5,414,896],
                 "se2nd"   :[4.7,375,667],
                 "12mini"  :[5.4,360,780],
                 "12"      :[6.1,390,844],
                 "12pro"   :[6.1,390,844],
                 "12promax":[6.7,428,926],
                 "13mini"  :[5.4,375,812],
                 "13"      :[6.1,390,844],
                 "13pro"   :[6.1,390,844],
                 "13promax":[6.7,428,926],
                 "se3rd"   :[4.7,375,667],
                 "14"      :[6.1,390,844],
                 "14plus"  :[6.7,428,926],
                 "14pro"   :[6.1,390,844],
                 "14promax":[6.7,428,928],
                 "msi"     :[14 ,1280,720]}

let ruler = document.getElementById("ruler");
let ruler_height;
let ruler_width;

if(navigator.userAgent.indexOf("iPhone") > 0 || true){
    let screen_w = window.screen.width;
    let screen_h = window.screen.height;
    let device = "";
    let mm;
    let theta;
    let width_px;
    let height_px;

    for(let key in iphone_wh){
        if(iphone_wh[key][1] == screen_w && iphone_wh[key][2] == screen_h){
            device = key;
            mm = iphone_wh[key][0] * 25.4;
            width_px = iphone_wh[key][1];
            height_px = iphone_wh[key][2];
            theta = Math.atan2(height_px,width_px);
            break;
        }
    }

    if(device == ""){
        alert("対応していない機種の可能性があります。")
    }

    let width_mm = mm * Math.cos(theta);
    let height_mm = mm * Math.sin(theta);

    let height_px_per_mm = height_px / height_mm;
    let width_px_per_mm  = width_px / width_mm;
    let scale_lim = Math.floor(window.innerHeight / height_px_per_mm / 10) * 10 - 10;

    ruler_height = height_px_per_mm * (scale_lim + 10);
    ruler.style.height = height_px_per_mm * (scale_lim + 10) + "px";
    ruler_width = 75;
    ruler.style.width = 75 + "px";

    for(let i = 0; i < scale_lim + 1; ++i){
        let scale = document.createElement("div");
        scale.setAttribute("id","scale");
        if(i % 10 == 0){
            scale.setAttribute("id","scale_over");

            let num = document.createElement("div");
            num.setAttribute("id","num");
            num.setAttribute("style","top:" + (height_px_per_mm * i + height_px_per_mm * 5 - 9) + "px; left:45px");
            num.innerHTML = String(scale_lim / 10 - i / 10);
            ruler.appendChild(num);

        }else{
            scale.setAttribute("id","scale");
        }
        scale.setAttribute("style","top:" + (height_px_per_mm * i + height_px_per_mm * 5) + "px");
        ruler.appendChild(scale);
    }
}else{
    alert("iPhoneからアクセスしてください。")
}


let pos = {x:0,y:0};
let angle = 0;

const ang = (b) => {
    let bb = b
    if(bb < 0){
        bb += Math.abs(Math.floor(bb / 360)) * 360;
    }

    if(bb % 90 <= 5){
        return bb - bb % 90;
    }else if(bb % 90 >= 85){
        return bb + 90 - (bb % 90);
    }else{
        return bb;
    }
}


interact(".over").draggable({
    listeners:{
        move(event){
            pos.x += event.dx;
            pos.y += event.dy;
            ruler.style.transform = "translate(" + pos.x + "px," + pos.y + "px) rotate(" + ang(angle) + "deg)";
        }
    }
});

interact(".over").gesturable({
    listeners:{
        move(event){
            angle += event.da;
            pos.x += event.dx;
            pos.y += event.dy;
            ruler.style.transform = "translate(" + pos.x + "px," + pos.y + "px) rotate(" + ang(angle) + "deg)";
        },
        end(event){
            angle = ang(angle)
        }
    }
});

const left = () => {
    pos.x = 0;
    pos.y = (window.innerHeight - ruler_height) / 2;
    angle = 0;
    ruler.style.transform = "translate(" + pos.x + "px," + pos.y + "px) rotate(" + ang(angle) + "deg)";
}

const right = () => {
    pos.x = window.innerWidth - ruler_width;
    pos.y = (window.innerHeight - ruler_height) / 2;
    angle = 180;
    ruler.style.transform = "translate(" + pos.x + "px," + pos.y + "px) rotate(" + ang(angle) + "deg)";
}

left();
