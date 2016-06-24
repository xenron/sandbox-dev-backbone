define(['jquery', 'underscore', 'backbone', 'views/editModalView', 'views/taskView', 'models/task', 'routers/router', 'components/dataService'],
    function ($, _, Backbone, EditModal, TaskView, Task, Router, dataService) {
    var detailsView = Backbone.View.extend({
        template: _.template($('#details-template').html()),
        tagName: 'div',
        events: {
            'click #btnEditAgent': 'editAgent',
            'click #btnDeleteAgent': 'deleteAgent',
            'click #btnBack': 'back',
            'keypress #txtNewTask': 'addNewTask'
        },
        $cache: {
           taskTable: null,
           EnterKey: 13
        },
        initialize: function() {
            this.listenTo(this.model, 'change', this.modelChanged);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$cache.taskTable = this.$el.find('#taskTable');
            this.model.get('tasks').each(function(task) {
                this.addTask(task);
            }, this);
            return this;
        },
        addTask: function(task) {
            var view = new TaskView({ model: task });
            this.$cache.taskTable.append(view.render().el);
        },
        editAgent: function(event) {
            var view = new EditModal({ model: this.model });
            view.render().showModal();
        },
        deleteAgent: function() {
            if (confirm('Are you sure you want to delete the agent?')) {
                app.agents.remove(this.model);
                dataService.deleteAgent(this.model).then(function() {
                    Router.navigate('#/', { trigger: true });
                });                
            }
        },
        back: function() {
            Router.navigate('#/', {trigger: true});
        },
        addNewTask: function(event) {
            var txt = $('#txtNewTask'),
                self = this;
            if (event.which !== this.$cache.EnterKey || !txt.val().trim()) {
                return;
            }            
            
            var task = new Task({ description: txt.val(), agentID: this.model.get('agentID') });
            this.model.get('tasks').add(task);            
            dataService.addTask(task).then(function () {
                txt.val('');
                self.render();
            });            
        },
        modelChanged: function() {
            this.render();
        }
    });

    return detailsView;
});