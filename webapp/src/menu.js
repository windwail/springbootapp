(function() {

    NJ.NJMenu = NJMenu;

    function NJMenu() {

        var layer = NJ.layer;

        var container = new Konva.Rect({
            x: 0,
            y: 0,
            width: 150,
            height: 400,
            fill: 'gray',
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
            cornerRadius: 5,
        });


        var box = new Konva.Rect({
            x: container.getWidth() - 6,
            y: 0,
            width: 12,
            height: 60,
            fill: '#a7dbd8',
            stroke: 'black',
            strokeWidth: 1,
            draggable: true,
            cornerRadius: 5,
            dragBoundFunc: function (pos) {
                //console.log(pos.y + ":" + container.getAbsolutePosition().y);

                var y = pos.y;
                // scroller upper than container.
                if (y <= container.getAbsolutePosition().y) {
                    y = container.getAbsolutePosition().y;
                }

                var lowest_point = container.getAbsolutePosition().y + container.getHeight() - box.getHeight();

                if (y >= lowest_point) {
                    y = lowest_point;
                }

                return {
                    x: this.getAbsolutePosition().x,
                    y: y
                }
            }
        });

        box.on('dragmove', function (evt) {
            var k = box.getAttr('y') / (container.getHeight() - box.getHeight());
            var way = container.getHeight() - subgroup.getClientRect().height - 20;
            var delta = way * k;
            subgroup.setAttr('y', delta);
            subgroup.clip({
                x: 0,
                y: -delta,
                width: container.getWidth(),
                height: container.getHeight()
            })
        })

        var subgroup = new Konva.Group({
            x: 0,
            y: 0,
            draggable: false,
            clip: {
                x: 0,
                y: 0,
                width: container.getWidth(),
                height: container.getHeight()
            },
        });

        var group = new Konva.Group({
            x: 10,
            y: 30,
            draggable: false
        });

        group.add(container);
        group.add(box);

        var menu = ["Button", "Input", "Label"]

        for (var i = 0; i < 3; i++) {
            var x = 10;
            var y = i * 60 + 10;

            new NJ.NJButtonMenuItem(subgroup, x, y, menu[i]);
        }

        group.add(subgroup);

        layer.add(group);

        NJ.layer.draw();
    }


})();