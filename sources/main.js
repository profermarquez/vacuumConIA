const canvas=document.getElementById("miCanvas");
canvas.height=450;//window.innerHeight;
canvas.width=450;

const contexto =canvas.getContext("2d");
const habitacion = new Habitacion(canvas.width/2,canvas.width,canvas.height/2,canvas.height);
//console.log(canvas.width/2,canvas.width,canvas.height/2,canvas.height);
const N=100;
const vacuums = generateAspiradoras(N)//new Vacuum(50, 50, 50, 50,"IA");
const basuras= []//new Basura(125,125,25,25),new Basura(150,150,25,25),new Basura(185,190,25,25)]



function cRU_x()//funciona aleatorio basuras
{}

animate();

function generateAspiradoras(n){
    const aspiradoras=[];
    for(let i=1;i<n;i++){
        aspiradoras.push(new Vacuum(55, 78, 50, 50,"IA"))
    }
return aspiradoras;
}

function animate(){

    /* for(let i=0;i<basuras.length;i++){
        basuras[i].update(habitacion.borders);
    } */
    
    //vacuum.updated(habitacion.borders,basuras);
    for(let i=0;i<vacuums.length;i++)
        {
            vacuums[i].updated(habitacion.borders,basuras);
        }
    canvas.height=400;
    habitacion.draw(contexto);
    //basura1.draw(contexto);

    //vacuum.draw(contexto);
    contexto.globalAlpha=0.2;
    for(let i=0;i<vacuums.length;i++)
        {
            vacuums[i].draw(contexto);
        }
    contexto.globalAlpha=1;

    const mejorAspiradora= vacuums.find(
        c=>c.x==Math.min(
            ...vacuums.map(c=>c.x)
            ));

    mejorAspiradora.draw(contexto);
    /* for(let i=0;i<basuras.length;i++){
        basuras[i].draw(contexto);
    } */

    requestAnimationFrame(animate);
}