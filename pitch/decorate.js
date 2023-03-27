(function (document, window) {
    for(let i = 0 ; i < 500 ; i++) {
        var div = document.createElement("div");
        div.style.width = "200px";
        div.style.height = "200px";
        let grey = 255- Math.floor(Math.random()*64);
        div.style.background = `rgba(${grey}, ${grey}, ${grey}, 1)`;
        div.style.position = "absolute";
        //move these around in z for some fun parallax effect
        let x = -3000 + Math.random()*18000;
        let y = Math.random()*5000 - 2500;
        let z = -1000-Math.random()*4000;
        div.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        document.getElementById("impress").appendChild(div);
    }

    //randomize z values for presentation steps, but in front of background divs
    stepDivs = document.getElementsByClassName("step");
    [].forEach.call(stepDivs, function(step){
        let z = Math.random()*970;
        step.setAttribute("data-z", z);
    });
    
})(document, window);