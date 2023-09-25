
class Vacuum {

    constructor(x,y,width,height,ia)
    {   
        this.x=x;
        this.y=y;
        this.width=width;
        this.heigth=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=3;
        this.friction=0.05;
        this.angle=0;

        this.sensor= new Sensor(this);
        this.brain=new NeuralNetwork([this.sensor.rayCount,6,4]);
        this.controls =new Controls();

        this.damaged=false;

        this.useBrain= ia=="IA";

    }

    updated(habitacionBorde,basuras){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPoligono();
            this.damaged=this.#assessDamage(habitacionBorde,basuras);
            this.encuentraBasura=  this.#encuentraBasura(basuras); 
        }
        this.sensor.update(habitacionBorde,basuras);

        const offsets =this.sensor.readSensors.map(
                s => s == null?0:1-s.offsets);
                const outputs =NeuralNetwork.feedForward(offsets,this.brain);
                //console.log(outputs);


        if(this.encuentraBasura)// funcion creada
            {
                //alert("encontrasteBasura");
                this.encuentraBasura=false;
            }
        
        if(this.useBrain)
            {
                this.controls.up=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.down=outputs[3];
            }
    }

    #encuentraBasura(basuras)//arreglo de basuras
    {
        
        for(let i=0;i<basuras.length;i++)
            {
                //console.log(this.polygon,basuras[i].polygon);
                if(polysIntersect(this.polygon,basuras[i].polygon)){
                    
                    basuras[i].width=0;basuras[i].height=0;
                    return true;
                }
            }
            //console.log("llega false");
        return false;
    }

    #assessDamage(habitacionBorde,basuras)
    {
        for(let i=0;i<habitacionBorde.length;i++)
            {
                if(polysIntersect(this.polygon,habitacionBorde[i])){
                    return true;
                }
            }
            //console.log(basuras[0].polygon);
        /* for(let i=0;i<basuras.length;i++)
            {
                if(polysIntersect(this.polygon,basuras[i].polygon)){
                    return true;
                }
            } */
        return false;
    }

    #createPoligono()
        {
            const points=[];
            const rad=Math.hypot(this.width,this.heigth)/2;
            const alpha =Math.atan2(this.width, this.heigth);
            points.push({
                x:this.x-Math.sin(this.angle-alpha)*rad,
                y:this.y-Math.cos(this.angle-alpha)*rad
            });

            points.push({
                x:this.x-Math.sin(this.angle+alpha)*rad,
                y:this.y-Math.cos(this.angle+alpha)*rad
            });

            points.push({
                x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
                y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
            });

            points.push({
                x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
                y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
            });
            //console.log(points);
            return points;

        }

    #move()
        {
        if(this.controls.up)
        {this.speed+=this.acceleration;}
        if(this.controls.down)
        {this.speed-=this.acceleration;}

        if(this.speed!=0)
        {const flip =this.speed>0?1:-1;

            if(this.controls.left)
            {this.angle+=0.03*flip;}
            if(this.controls.right)
            {this.angle-=0.03*flip;}
        }

        if(this.speed>this.maxSpeed)
        {this.speed=this.maxSpeed;}
        if(this.speed<- this.maxSpeed/2)
        {this.speed=-this.maxSpeed/2;}

        

        if(this.speed>0)
        {this.speed-=this.friction;}

        if(this.speed<0)
        {this.speed+=this.friction;}

        if(Math.abs(this.speed)<this.friction)
        {this.speed=0;}

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
        }

    draw(contexto)
    {
        /* contexto.save();
        contexto.translate(this.x,this.y);
        contexto.rotate(-this.angle);

        contexto.beginPath();
        contexto.fillStyle = "black";
        contexto.rect(
            -this.width/2,
            -this.heigth/2,
            this.width,
            this.heigth
        );
        contexto.fill();
        contexto.restore(); */

        if(this.damaged){
            contexto.fillStyle='gray';
        }
        else{
            contexto.fillStyle='black';
        }

        contexto.beginPath();
        contexto.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++)
        {
            contexto.lineTo(this.polygon[i].x,this.polygon[i].y)
        }
        contexto.fill();
        this.sensor.draw(contexto);
    }

}