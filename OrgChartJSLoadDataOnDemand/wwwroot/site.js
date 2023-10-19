OrgChart.templates.ana.expandButton = `<g data-expand-button transform="matrix(1,0,0,1,110,105)" style="cursor:pointer;">
${OrgChart.templates.ana.plus}
</g>`;

var chart = new OrgChart(document.getElementById("tree"), {
    template: 'ana',
    enableSearch: false,
    nodeBinding: {
        field_0: "id",
        field_1: "pid",
        expandButton: 'expandButton'
    }
});

var responseData = null;
var expandIdsWithLoadOnDemand = [];

fetch('/home/FetchNodes').then(response => response.json()).then(function (data) {    
    responseData = data;
    chart.load(responseData.demandedNodes);
});

chart.onNodeClick(function (args) { 
    var that = this;
    var target = args.event.target;
    while (target && target.hasAttribute && !target.hasAttribute('data-expand-button')) {
        target = target.parentNode;
    }
    if (target && target.hasAttribute) {
        fetch('/home/FetchNodes?id=' + args.node.id).then(response => response.json()).then(function (data) {
            responseData = data;
            for (var i = 0; i < responseData.demandedNodes.length; i++) {
                var node = responseData.demandedNodes[i];
                that.config.nodes.push(node);
                expandIdsWithLoadOnDemand.push(node.id);
            }

            that.expandCollapse(args.node.id, expandIdsWithLoadOnDemand, []);
        });
    }
    return false;
});

//you can remove render event listener if you are happy with the defailt opacity animation
chart.on('render', function (sender, args) {
    if (args.res.animations.length) {
        for (var i = 0; i < args.res.animations[0].length; i++) {
            var id = args.res.animations[0][i];
            if (expandIdsWithLoadOnDemand.indexOf(id) != -1) {
                var node = sender.getNode(id);
                args.res.animations[1][i].transform = [1, 0, 0, 1, node.parent.x, node.parent.y];
                args.res.animations[2][i].transform = [1, 0, 0, 1, node.x, node.y];
            }            
        }
    }
    expandIdsWithLoadOnDemand = [];
})

chart.onField(function (args) {
    if (responseData.nodeIdsWithChildren.has(args.node.id)) {
        if (args.name == 'expandButton') {
            args.value = 'show';
        }
    }
});

