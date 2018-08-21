AutoForm.addInputType("sv-upload", {
    template: "afSvUpload",
    valueOut: function () {
        return this.jstree('get_selected', null, true);
    }
});

Template.afSvUpload.helpers({
    atts: function () {
        return _.omit(this.atts, 'settings', 'nodes');
    }
})

Template.afSvUpload.created = function () {
    this.value = new ReactiveVar(this.data.value);
};

Template.afSvUpload.rendered = function () {
    var self = this;
    var options = this.data.atts.settings || {};
    var $tree = $(this.firstNode);
    var data = self.data;
    var nodes = data.atts.nodes;

    selectnodes = function (node) {
        node.forEach(function(d) {
            if (_.contains(self.value.get(), d.id)) {
                d.state = {selected: true, opened: true};
            }
            if (d.children) {
                d.children = selectnodes(d.children)
            }
        })
        return node
    }
    nodes = selectnodes(nodes);

    this.autorun(function () {
        $tree.jstree({
            plugins: options.plugins || [],
            search: options.search || [],
            core: {
                themes: options.themes || {},
                data: function (node, cb) {
                    if (node.id === '#') {
                        var rootNode = [{
                                text: 'Top',
                                id: '1',
                                children: true,
                                state: {opened: true}
                            }];
                        cb(rootNode);
                    } else {
                        cb(nodes);
                    }
                }
            }
        });
    })
};
