class Sensor{
    constructor(vacuum){
        this.vacuum= vacuum;
        this.rayCount=20;
        this.rayLength=40;
        this.raySpread = Math.PI/0.2; //modificado

        this.rays =[];
        this.readSensors=[]// en el ejemplo se llaman readings
    }

    update(habitacionBorde,basuras){
        
        this.#castRays();
        this.readSensors=[];
        for(let i=0;i<this.rays.length;i++)
            {
                //console.log(this.rays[i]);
                this.readSensors.push(
                    this.#getReadings(this.rays[i],habitacionBorde,basuras)
                );
                
            }
            //console.log(this.readSensors);
        }
    
    #getReadings(ray,habitacionBorde,basuras)//en el ejemplo, habitacionBorde se llama roadBorders
        {
            //console.log(ray,habitacionBorde);

            let touches=[];
            for(let i=0;i<habitacionBorde.length;i++)
            {
                const touch = getIntersection(
                ray[0],ray[1], habitacionBorde[i][0],habitacionBorde[i][1] );
                if(touch){
                    //console.log(touch);
                    touches.push(touch)
                }
            }

            for(let i=0;i<basuras.length;i++)
                {
                    const poly=basuras[i].polygon;
                    //console.log(poly);
                    for(let j=0;j<poly.length;j++){
                        const value=getIntersection(ray[0],ray[1],poly[j],poly[(j+1)%poly.length]
                        );
                        if(value){touches.push(value);}
                    }
                }


            if(touches.length ==0){return null;}
            else{//console.log("Llega");
                const offsets =touches.map(e=>e.offset);
                
                const minOffset=Math.min(...offsets);
                
                const to =  touches.find(e=>e.offset==minOffset);
                //console.log(to);
                return to}
        }

    
    

    #castRays(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++)
            {
                const rayAngle =lerp(this.raySpread/2,
                -this.raySpread/2,
                i/(this.rayCount-1)
                )+this.vacuum.angle;
                const start = {x:this.vacuum.x,y:this.vacuum.y}
                const end={
                    x:this.vacuum.x-
                    Math.sin(rayAngle)*this.rayLength,
                    y: this.vacuum.y-
                    Math.cos(rayAngle)*this.rayLength}
                this.rays.push([start,end]);
            }
    }
    
    draw(contexto){
        for(let i=0;i<this.rayCount;i++){
                let end=this.rays[i][1];
                if(this.readSensors[i]){
                    end=this.readSensors[i];
                }

                /* contexto.beginPath();
                contexto.lineWidth=2;
                contexto.strokeStyle="yellow";
                contexto.moveTo(
                    this.rays[i][0].x,
                    this.rays[i][0].y,);
                contexto.lineTo(
                    end.x,
                    end.y,);
                contexto.stroke();
                
                contexto.beginPath();
                contexto.lineWidth=2;
                contexto.strokeStyle="black";
                contexto.moveTo(
                    this.rays[i][1].x,
                    this.rays[i][1].y,);
                contexto.lineTo(
                    end.x,
                    end.y,);
                
                contexto.stroke(); */

            }
        }
}