window.addEventListener("DOMContentLoaded", function () {
    let adics;
    const cpp = {};
    let currentPage = 1;
    let number = 5;
    let dics = [];
    const content = document.getElementById("content");
    const code = document.getElementById("code");
    const value = document.getElementById("value");


    fetch("static/w.json")
        .then(data => data.json())
        .then(function (json) {
            adics = json;
        });

    // document.addEventListener("keydown",function (e){
    //     console.log(e.key);
    // })


    // document.onkeydown = function () {
    //     if ("code" !== document.activeElement.id) {
    //         code.focus();
    //         code.value = null
    //     }
    // }

    code.onfocus = function (){
        this.blur();
    }
    content.addEventListener("keydown", function (e) {
        console.log(e.key);
        if (/^[a-z]$/.test(e.key)) {
            code.value = code.value + e.key;
            e.preventDefault();
        }else if (code.value) {
            e.preventDefault();
        }
        if (e.key == "ArrowUp") {
            currentPage -= 1;
        }
        if (e.key == "ArrowDown") {
            currentPage += 1;
        }
        if (e.key == "ArrowLeft") {
            currentPage -= 1;
        }
        if (e.key == "ArrowRight") {
            currentPage += 1;
        }
        if (e.key == "Backspace") {
            code.value = code.value.replace(/[a-z]$/, "")
        }


        selectCode(e.key);

        if (code.value.length > 4) {
            code.value = code.value.replace(/^.{4}/, "");
            selectCode(1);
        }
        dics = getPageValues(Number(currentPage), number, code.value)
        let values = showCodes(dics);
        value.value = values
    });

    function selectCode(key){
        if (key == " ") {
            key = 1;
        }
        if (/[1-9]/.test(key)){
            let dic = dics[(key-1)].value;
            content.setRangeText(dic,content.selectionEnd,content.selectionEnd, "end");
            code.value = "";
        }
    }

    function showCodes(dics){
        let codes = []
        for (let i = 0; i < dics.length; i++) {
            codes.push((i+1)+dics[i].value)
        }
        return codes.join("、")
    }


    function getPageValues(page = 1, number = 10, code) {
        if (!code){
            return [];
        }
        let point = 0;
        if (!page){
            page = 1;
            currentPage = 1;
        }
        if (cpp.code === code) {
            point = cpp.pp.get(page);
        } else {
            page = 1;
            currentPage = 1;
            cpp.code = code;
            cpp.pp = new Map();
            cpp.pp.set(page, 0);
        }
        if (isNaN(point)) {
            page -= 1;
            currentPage -= 1;
            point = cpp.pp.get(page);
        }
        console.log("code:" + code);
        console.log("page:" + page);
        console.log("currentPage:" + currentPage);
        console.log("point:" + point);
        let obj = getValues(point, number, code)
        if (obj.point < adics.length) {
            cpp.pp.set(page + 1, obj.point + 1);
        }
        return obj.dics;
    }

    function getValues(point = 0, number, code) {
        let entity = new Object();
        let dics = new Array();
        let i = point
        for (point; i < adics.length; i++) {
            let dic = adics[i];
            if (dic.code.startsWith(code)) {
                dics.push(dic);
            }
            if (dics.length >= number) {
                break;
            }
        }
        entity.point = i;
        entity.dics = dics;
        return entity;
    }

})

