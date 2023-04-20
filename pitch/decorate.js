(function (document, window) {
    for(let i = 0 ; i < 800 ; i++) {
        var div = document.createElement("div");
        div.style.width = "200px";
        div.style.height = "200px";
        const r = Math.floor(mapRNG()*50);

        div.style.background = `rgba(${r}, 20, ${r}, 1)`;
        div.style.position = "absolute";
        //move these around in z for some fun parallax effect
        const x = -6000 + mapRNG()*25000;
        const y = mapRNG()*8000 - 4000;
        const z = -500-mapRNG()*4000;
        div.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        document.getElementById("impress").appendChild(div);
    }

    //randomize z values for presentation steps, but in front of background divs
    stepDivs = document.getElementsByClassName("step");
    stepIndex = 0;
    [].forEach.call(stepDivs, function(step){
        const z = mapRNG()*500;
        const y = mapRNG()*2000 - 1000;
        const x = stepIndex * 1000;
        stepIndex++;
        step.setAttribute("data-z", z);
        step.setAttribute("data-x", x);
        step.setAttribute("data-y", y);
    });
    
})(document, window);