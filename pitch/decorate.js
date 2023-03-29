(function (document, window) {
    for(let i = 0 ; i < 800 ; i++) {
        var div = document.createElement("div");
        div.style.width = "200px";
        div.style.height = "200px";
        let r = Math.floor(Math.random()*50);

        div.style.background = `rgba(${r}, 20, ${r}, 1)`;
        div.style.position = "absolute";
        //move these around in z for some fun parallax effect
        let x = -6000 + Math.random()*25000;
        let y = Math.random()*8000 - 4000;
        let z = -500-Math.random()*4000;
        div.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        document.getElementById("impress").appendChild(div);
    }

    //randomize z values for presentation steps, but in front of background divs
    stepDivs = document.getElementsByClassName("step");
    stepIndex = 0;
    [].forEach.call(stepDivs, function(step){
        let z = Math.random()*500;
        let y = Math.random()*2000 - 1000;
        let x = stepIndex * 1000;
        stepIndex++;
        step.setAttribute("data-z", z);
        step.setAttribute("data-x", x);
        step.setAttribute("data-y", y);
    });
    
})(document, window);