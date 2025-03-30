function changeCSSVariable(name, value) {
    document.documentElement.style.setProperty(name, value);
}

function onresize() {

    let docHeight = document.documentElement.clientHeight;
    let docWidth = document.documentElement.clientWidth;
    let height = (docHeight / 1.35 < docWidth / 1.3) ? docHeight / 1.35 : docWidth / 1.3;
    // Change the CSS variable for board height
    if (docHeight/docWidth <1 && docWidth < 1000) height -= 100; else height -= 20
    if ((docWidth < 950) && (docWidth/docHeight > 2)) height = height/1.1
    if (docWidth/docHeight > 0.8 && docWidth/docHeight < 1) {height -= 130}
    let width = height * 7 / 6


    changeCSSVariable("--imageWidth", width + "px");
    changeCSSVariable("--imageHeight", height + "px");
}
onresize()
window.addEventListener("resize", onresize);