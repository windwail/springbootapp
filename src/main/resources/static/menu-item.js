(function(){
    NJ.NJButtonMenuItem = NJButtonMenuItem;

    function NJButtonMenuItem (group, x, y, name) {

        var self = this;

        this.group = new Konva.Group({
            x: x,
            y: y,
            dragDistance: 5,
            draggable: true
        });

        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 130,
            height: 50,
            fill: red,
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
            cornerRadius: 5,
        });

        this.text = new Konva.Text({
            x: 0,
            y: 0,
            text: name,
            fontSize: 20,
            fontFamily: 'Calibri',
            fill: 'green'
        });

        this.group.add(this.rect);
        this.group.add(this.text);

        this.group.on('mousein', function (evt) {
            console.log("mousein");
        });

        this.rect.on('mousedown touchstart', function (evt) {
            evt.target.getParent().dragstartpos = evt.target.getParent().getAbsolutePosition();
            console.log(evt.target.getParent().dragstartpos)
            //console.log(evt.target.dragstartpos);
        });

        this.text.on('mousedown touchstart', function (evt) {
            evt.target.getParent().dragstartpos = evt.target.getParent().getAbsolutePosition();
        });

        this.group.on('dragstart', function (evt) {
            self.creature = new NJ.NJResizableRect();

            if(NJ.screen) {
                NJ.screen.group.add(self.creature.group);
            }

            self.creature.group.setAbsolutePosition({
                x: evt.evt.x,
                y: evt.evt.y
            });

            evt.target.setAbsolutePosition(evt.target.dragstartpos);
        });


        this.group.on('dragmove', function (evt) {
            evt.target.setAbsolutePosition(evt.target.dragstartpos);
            self.creature.group.setAbsolutePosition({
                x: evt.evt.x ,
                y: evt.evt.y - 30
            });

            var pos = NJ.stage.getPointerPosition();
            var shape = NJ.layer.getIntersection(pos);

            if(shape) {
                console.log(pos);
                console.log(shape.constructor.name);
            }
        });

        group.add(this.group);

        this.text.setX((this.rect.width() - this.text.width()) / 2);
        this.text.setY((this.rect.height() - this.text.height()) / 2);

    }

})();