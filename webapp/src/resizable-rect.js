(function () {

    NJ.NJResizableRect = NJResizableRect;

    function NJResizableRect(dropX, dropY, data) {

        var self = this;
        var gX = !!dropX ? dropX : 0;
        var gY = !!dropY ? dropY : 0;

        this.data = data;

        var layer = NJ.layer;

        this.group = new Konva.Group({
            x: gX,
            y: gY,
            dragDistance: 5,
            draggable: true
        });

        layer.add(this.group);
        
        var HEIGHT = 50;
        var WIDTH = 160;

        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: WIDTH,
            height: HEIGHT,
            fill: '#00D2FF',
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
        });

        this.text = new Konva.Text({
            x: 30,
            y: 30,
            text: 'Simple Text',
            fontSize: 30,
            fontFamily: 'Calibri',
            fill: 'green'
        });

        this.group.add(this.rect);

        this.group.add(this.text);
        this.addAnchor(0, 0, 'topLeft');
        this.addAnchor(WIDTH, 0, 'topRight');
        this.addAnchor(WIDTH, HEIGHT, 'bottomRight');
        this.addAnchor(0, HEIGHT, 'bottomLeft');

        this.updateTextPosition();

        this.group.on('click', function (evt) {
            NJ.njSetSelected(self);
            evt.cancelBubble = true;
        });

        this.group.on('dragmove', function (evt) {
            //console.log(evt.target.getX());
        });

        this.njUnselect();

    };

    NJResizableRect.prototype.updateTextPosition = function () {
        var group = this.group;

        var topLeft = group.get('.topLeft')[0];
        var topRight = group.get('.topRight')[0];
        var bottomRight = group.get('.bottomRight')[0];
        var bottomLeft = group.get('.bottomLeft')[0];

        var width = topRight.getX() - topLeft.getX();
        var height = bottomLeft.getY() - topLeft.getY();

        this.text.setX((width - this.text.width()) / 2);
        this.text.setY((height - this.text.height()) / 2);
    }

    NJResizableRect.prototype.updateAnchors = function (activeAnchor) {
        var group = activeAnchor.getParent();

        var topLeft = group.get('.topLeft')[0];
        var topRight = group.get('.topRight')[0];
        var bottomRight = group.get('.bottomRight')[0];
        var bottomLeft = group.get('.bottomLeft')[0];

        var anchorX = activeAnchor.getX();
        var anchorY = activeAnchor.getY();

        // update anchor positions
        switch (activeAnchor.getName()) {
            case 'topLeft':
                topRight.setY(anchorY);
                bottomLeft.setX(anchorX);
                break;
            case 'topRight':
                topLeft.setY(anchorY);
                bottomRight.setX(anchorX);
                break;
            case 'bottomRight':
                bottomLeft.setY(anchorY);
                topRight.setX(anchorX);
                break;
            case 'bottomLeft':
                bottomRight.setY(anchorY);
                topLeft.setX(anchorX);
                break;
        }

        this.rect.position(topLeft.position());

        var width = topRight.getX() - topLeft.getX();
        var height = bottomLeft.getY() - topLeft.getY();
        if (width && height) {
            this.rect.width(width);
            this.rect.height(height);

            this.text.setX((width - this.text.width()) / 2);
            this.text.setY((height - this.text.height()) / 2);
        }

    }

    NJResizableRect.prototype.addAnchor = function (x, y, name) {
        //var stage = group.getStage();
        var layer = this.group.getLayer();
        var self = this;

        var anchor = new Konva.Circle({
            x: x,
            y: y,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 2,
            radius: 8,
            name: name,
            draggable: true,
            dragOnTop: false
        });

        anchor.on('dragmove', function () {
            self.updateAnchors(this);
            layer.draw();
        });
        anchor.on('mousedown touchstart', function () {
            self.group.setDraggable(false);
            this.moveToTop();
        });
        anchor.on('dragend', function () {
            self.group.setDraggable(true);
            layer.draw();
        });
        // add hover styling
        anchor.on('mouseover', function () {
            var layer = this.getLayer();
            document.body.style.cursor = 'pointer';
            this.setStrokeWidth(4);
            layer.draw();
        });
        anchor.on('mouseout', function () {
            var layer = this.getLayer();
            document.body.style.cursor = 'default';
            this.setStrokeWidth(2);
            layer.draw();
        });

        this.group.add(anchor);
    }

    NJResizableRect.prototype.njSelect = function() {
        var group = this.group;
        var layer = this.group.getLayer();

       // group.get('.topLeft')[0].visible(true);
        //group.get('.topRight')[0].visible(true);
        group.get('.bottomRight')[0].visible(true);
        //group.get('.bottomLeft')[0].visible(true);

        layer.draw();


    };

    NJResizableRect.prototype.njUnselect = function() {
        var group = this.group;
        var layer = this.group.getLayer();

        group.get('.topLeft')[0].visible(false);
        group.get('.topRight')[0].visible(false);
        group.get('.bottomRight')[0].visible(false);
        group.get('.bottomLeft')[0].visible(false);

        layer.draw();

    };


})();