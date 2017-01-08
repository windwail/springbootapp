
/* Global vars */
var indigo = '#3f51b5';
var blue = '#2196f3'
var lightBlue = '#03a9f4';
var cyan = '#03a9f4';
var teal = '#009688';
var red = '#f44336';


/* Global class */
var NJEditor = function() {

    var self = this;

    this.selected = null;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.stage = this.stage = new Konva.Stage({
        container: 'container',
        width: this.width,
        height: this.height,
    });


    //document.getElementById('container').style.background = indigo;

    this.stage.on("click", function(){
        NJ.njUnselect();
    });

    window.addEventListener('resize', function (event) {
        self.stage.setWidth(window.innerWidth);
        self.stage.setHeight(window.innerHeight);
        document.getElementById('props').style.height = window.innerHeight;
    });

    this.layer = new Konva.Layer();

    this.stage.add(this.layer);
}

/* Methods */
NJEditor.prototype.njSetSelected = function(njElement) {
    if(this.selected) {
        this.selected.njUnselect();
    }
    this.selected = njElement;
    if(this.selected) {
        this.selected.njSelect();
    }
}

NJEditor.prototype.njUnselect = function() {
    this.njSetSelected(null);
}

NJEditor.prototype.saveToServer = function() {
    alert("saved to server");
}


NJEditor.prototype.initStage = function() {

}

var NJ = new NJEditor();

