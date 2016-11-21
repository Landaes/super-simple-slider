# super-simple-slider
Un super simple slider, customizable que lanza eventos por cada acción (requiere jQuery y TweenLite)

Super simple y bonito slider (de acuerdo a tu habilidad para customizarlo).
Para inicializar basta esto:
Slider.init("#contenedor");

Para dar una mejor idea así:
var App = {
    init:function(){
        this.sliders.push(Slider.init("#contenedor",{value:37},this.customEventListener));
        this.sliders.push(Slider.init("#contenedor",{},this.customEventListener));
        this.sliders.push(Slider.init("#contenedor", {w:600, maxValue:255, h:80, hknob:80,wknob:80},this.customEventListener));
        this.sliders.push(Slider.init("#contenedor",{w:500, h:100, colorfondo:"yellow", value:15, hknob:110, rfondo:0, decimales:0},this.customEventListener));
        this.sliders.push(Slider.init("#contenedor",{w:500, h:100, colorfondo:"tomato",colorbarra:"brown", value:3.14, maxValue:6.28, hknob:110, rfondo:0, decimales:3},this.customEventListener));

    },
    sliders:[],
    customEventListener:function(e){
        // console.log("custom: ",e);
        console.log("CUSTOM valor: ",e.detail.valor);
        console.log("CUSTOM id: ",e.detail.id);
    }
};

