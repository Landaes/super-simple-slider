var Slider = {
    count:0,
    init:function(div, o, callback){
        this.creaSlider(div, o, this.count, callback);
        this.count++;
    },
    creaSlider:function(div, o, id, callback){
        //definir valores
        o = (o !== undefined) ? o : {};
        o.w = (o.w !== undefined) ? o.w : 100;
        o.h = (o.h !== undefined) ? o.h : 16;
        o.wknob = (o.wknob !== undefined) ? o.wknob : 14;
        o.hknob = (o.hknob !== undefined) ? o.hknob : 14;
        o.rknob = (o.rknob !== undefined) ? o.rknob : 7;
        o.colorknob = (o.colorknob !== undefined) ? o.colorknob : "#f00";
        o.colorfondo = (o.colorfondo !== undefined) ? o.colorfondo : "#dfdfdf";
        o.colorbarra = (o.colorbarra !== undefined) ? o.colorbarra : "#848484";
        o.rfondo = (o.rfondo !== undefined) ? o.rfondo : 7;
        o.value = (o.value !== undefined) ? o.value : 0;
        o.decimales = (o.decimales !== undefined) ? o.decimales : 2;
        o.maxValue = (o.maxValue !== undefined) ? o.maxValue : 100;
        o.marginBottom = (o.marginBottom !== undefined) ? o.marginBottom : 10;
       
        console.log(callback, typeof(callback));
        if(callback == undefined || typeof(callback) != "function"){
            callback = this.onStopDrag;
        } 
        //crear divs
        var st = '<div id="slide'+id+'" class="slider">\
                            <div class="fondo">\
                        <div class="barra"></div>\
                        <p class="value">'+o.value+'</p>\
                        <div class="knob"></div>\
                    </div>\
                </div>';

        if(o.h < o.hknob){
            st = '<div id="slide'+id+'" class="slider">\
                    <div class="fondo">\
                        <div class="barra"></div>\
                        <p class="value">'+o.value+'</p>\
                    </div>\
                    <div class="knob"></div>\
                </div>';
        }
        $(div).append(st);

        //csssear
        var slider = $(div+" #slide"+id);
        var value = $(div+" #slide"+id+" .value");
        var knob = $(div+" #slide"+id+" .knob");
        var fondo = $(div+" #slide"+id+" .fondo");
        var barra = $(div+" #slide"+id+" .barra");

        var vcenter = o.h*0.5-o.hknob*0.5;

        var min = 0;
        var max = o.w-o.wknob;
        var porcentaje;
        var fp = (o.value*max)/o.maxValue + o.wknob*0.5;

        

        slider.css({"width":o.w+"px", "height":o.h+"px", "margin-bottom":o.marginBottom+"px"});
        knob.css({"width":o.wknob+"px","height":o.hknob+"px","border-radius":o.rknob+"px", "position":"absolute", "background-color":o.colorknob, "margin-top":vcenter+"px", "transform":"translate3d("+(fp - o.wknob*0.5)+"px, 0px, 0px)"});
        fondo.css({"width":o.w+"px","height":o.h+"px", "position":"absolute", "background-color":o.colorfondo, "border-radius":o.rfondo+"px", "overflow":"hidden", "transform":"translate3d(0px, 0px, 0px)"});
        barra.css({"width":o.w+"px","height":o.h+"px", "position":"absolute", "background-color":o.colorbarra});
        value.css({"font-size":o.h+"px", "position":"absolute", "margin":"0px", "padding":"0px", "width":"auto"});

        barra.css("width",fp+"px"); //reseteo la barra.
        if(o.value == o.maxValue){
            TweenLite.to(barra,0.1,{width:o.w});
        } else if(o.value === 0){
            TweenLite.to(barra,0.1,{width:0});
        }
        var wSlider = parseInt(fondo.css("width"))-parseInt(knob.css("width"));
        this.setValue(value, o.value, o);
        //funcionalidades
        fondo.click(function(e){
            var minx = false;
            var maxx = false;
            var x = e.offsetX;
            if (e.target.className == "value") {
                x = e.offsetX + e.target.offsetLeft;
            }
            porcentaje = ((o.maxValue*(x-o.wknob*0.5))/max).toFixed(o.decimales);
            if(x < o.wknob*0.5){
                x = o.wknob*0.5;
                minx = true;
            } else if(x>o.w-o.wknob*0.5){
                x = o.w-o.wknob*0.5;
                maxx = true;
            }
            if(minx){porcentaje = 0;}
            if(maxx){porcentaje = o.maxValue;}

            var despachaClick = new CustomEvent("STOP_DRAG",{
                "detail":{
                    valor: porcentaje,
                    id:id
                }
            });
            this.setValue(value, porcentaje,o);
            TweenLite.to(barra, 0.1,{width:x, onComplete:function(bar, por){
                if(por === 0){
                    TweenLite.to(bar, 0.1,{width:min});
                }
                if(por === o.maxValue){
                    TweenLite.to(bar, 0.1,{width:o.w});
                }
                document.getElementById(div.substring(1)).addEventListener("STOP_DRAG", callback, false);
                document.getElementById(div.substring(1)).dispatchEvent(despachaClick);
            }, onCompleteParams:[barra,porcentaje]});
            TweenLite.to(knob, 0.1,{x:x-o.wknob*0.5});
        }.bind(this));
        Draggable.create(knob,
            {
                type:"x",
                bounds:{minX:min, maxX:max},
                edgeResistance:1,
                onDrag:function(){
                    barra.css("width",(this.x+o.wknob*0.5)+"px"); //tamaño barra indicadora 
                    porcentaje = ((o.maxValue*(this.x))/max).toFixed(o.decimales);
                    
                    Slider.setValue(value, porcentaje,o);
                    var despacha = new CustomEvent("ON_DRAG",{
                        "detail":{
                            valor: porcentaje,
                            id:id
                        }
                    });
                    Slider.setValue(value, porcentaje,o);
                    document.getElementById(div.substring(1)).addEventListener("ON_DRAG", callback, false);
                    document.getElementById(div.substring(1)).dispatchEvent(despacha);
                },
                onDragEnd:function(){
                    porcentaje = ((o.maxValue*(this.x))/max).toFixed(o.decimales);
                    if(porcentaje == o.maxValue){
                        TweenLite.to(barra,0.1,{width:o.w});
                    } else if(porcentaje === 0){
                        TweenLite.to(barra,0.1,{width:0});
                    }
                    var despacha = new CustomEvent("STOP_DRAG",{
                        "detail":{
                            valor: porcentaje,
                            id:id
                        }
                    });
                    Slider.setValue(value, porcentaje,o);
                    document.getElementById(div.substring(1)).addEventListener("STOP_DRAG", callback, false);
                    document.getElementById(div.substring(1)).dispatchEvent(despacha);
                }
            }
        );
    },
    setValue:function(value, valor, o){
        value.html(valor);
        var wvalue = value.width();
        if(valor > o.maxValue*0.5){
            value.css({"text-align":"left"});
            TweenMax.to(value, 0.2,{marginLeft:0, color:o.colorfondo});
        }else{
            value.css({"text-align":"right"});
            TweenMax.to(value, 0.2,{marginLeft:o.w-wvalue, color:o.colorbarra});
        }
    },
    onStopDrag:function(e){
        console.log("valor: ",e.detail.valor);
        console.log("id: ",e.detail.id);
    }
};
// lo siguiente es un polyfill para explorer 9 y otros navegadores del pasado que aún usan personas tontas.
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
