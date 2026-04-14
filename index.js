let jug3 = 0;
let jug5 = 0;
let jug8 = 0;

const waterLevelMax = 190;





function fill(jugSize){

    if(jugSize === 8){
        jug8 = 8
    }

    else if(jugSize === 5){
        jug5 = 5;
    }

    else if(jugSize === 3){
        jug3 = 3;
    }

    render();

}

function empty(jugSize){

    if(jugSize === 8){
        jug8 = 0;
    }

    else if(jugSize === 5){
        jug5 = 0;
    }

    else if(jugSize === 3){
        jug3 = 0;
    }

    render();

}

function pour(jugSizeX,jugSizeY){

    let jugX;

    let jugY;

    if(jugSizeX === jugSizeY){
        return; 
    }

    if(jugSizeX === 8){
        jugX = jug8;
    }

    else if(jugSizeX === 5){
        jugX = jug5;
    }

    else if(jugSizeX === 3){
        jugX = jug3;
    }



    if(jugSizeY === 8){
        jugY = jug8;
    }

    else if(jugSizeY === 5){
        jugY = jug5;
    }

    else if(jugSizeY === 3){
        jugY = jug3;
    }

    

    if(jugX === 0 || jugY === jugSizeY){
        return; // invalid state
    }

    while(jugX > 0 && jugY < jugSizeY){
        jugY++;
        jugX--;
    }



    if(jugSizeX === jugSizeY){
        return; 
    }

    if(jugSizeX === 8){
        jug8 = jugX;
    }

    else if(jugSizeX === 5){
        jug5 = jugX;
    }

    else if(jugSizeX === 3){
        jug3 = jugX;
    }



    if(jugSizeY === 8){
        jug8 = jugY;
    }

    else if(jugSizeY === 5){
        jug5 = jugY;
    }

    else if(jugSizeY === 3){
        jug3 = jugY;
    }


    render();

}


function render(){
    
    let jugSize8TextHtml = document.querySelector("#volume-8L");  
    let jugSize5TextHtml = document.querySelector("#volume-5L");  
    let jugSize3TextHtml = document.querySelector("#volume-3L");

    jugSize8TextHtml.textContent = jug8;
    jugSize5TextHtml.textContent = jug5;
    jugSize3TextHtml.textContent = jug3;


    let waterLevel8Html = document.querySelector("#L8 .water");
    waterLevel8Html.style.height = ((jug8 / 8) * waterLevelMax) + "px";

    let waterLevel5Html = document.querySelector("#L5 .water");
    waterLevel5Html.style.height = ((jug5 / 5) * waterLevelMax) + "px";

    let waterLevel3Html = document.querySelector("#L3 .water");
    waterLevel3Html.style.height = ((jug3 / 3) * waterLevelMax) + "px";
    
    
    
}