(function () {

    NJ.NJScreen = NJScreen;

    function NJScreen() {
        var self = this;
        NJ.screen = this;
        var layer = NJ.layer;

        this.group = new Konva.Group({
            x: 30,
            y: 30,
            dragDistance: 5,
            draggable: false
        });

        layer.add(this.group);

        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 400,
            height: 600,
            fill: '#009688',
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
        });

        this.text = new Konva.Text({
            x: 15,
            y: -20,
            text: 'Mobile screen',
            fontSize: 20,
            fontFamily: 'Calibri',
            fill: 'green'
        });

        this.group.add(this.rect);
        this.group.add(this.text);

        NJ.layer.draw();
    }

})();