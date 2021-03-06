
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
        document.getElementById('container').style.height = window.innerHeight;
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

        var dt = this.selected.data;
        $("#nj-properties-div").find('tbody').empty();


        var tableBody = $("#nj-properties-div").find('tbody');


        for(var index in dt) {
            var v = dt[index];

            // Primitive value
            if(v !== Object(v)) {
                tableBody.append($('<tr>')
                    .append($('<td>')
                        .append($('<span>')
                            .attr('src', '')
                            .text(index)
                        )
                    )
                    .append($('<td>')
                        .append($('<input>')
                            .attr('value', v)
                            .attr('style', "display:table-cell; width:100%;")
                            .attr('onkeyup', 'NJ.setData("' + index + '",event.target.value)')
                            .text(v)
                        )
                    )
                );
            }


            if(v === Object(v)) {
                console.log("OBJEcT");

                tableBody.append($('<tr>')
                    .append($('<td>')
                        .append($('<span>')
                            .attr('src', '')
                            .text(index)
                        )
                    )
                );

                tableBody.append($('<tr>')
                        .append($('<td colspan="2">')
                            .append($('<textarea>')
                                .attr('value', v)
                                .attr('style', "display:table-cell; width:100%;")
                                .attr('onkeyup', 'NJ.setData("' + index + '",event.target.value)')
                                .text(v.value)
                            )
                        )
                    );



            }
        }
    }


}

NJEditor.prototype.setData = function(fieldName, fieldValue) {
    if(this.selected) {
        var field = this.selected.data[fieldName];
        if(field === Object(field)) {
            // object;

            this.selected.data[fieldName].value = fieldValue;
        } else {
            // primitive;
            this.selected.data[fieldName] = fieldValue;
        }
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

NJEditor.prototype.initPalettePanel = function() {

}

NJEditor.prototype.initPropertiesPanel = function() {

}

var NJ = new NJEditor();

