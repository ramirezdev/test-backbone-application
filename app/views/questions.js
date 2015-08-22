define(function (require, exports, module) {
    'use strict';

    var app = require('app');
    var msgBus = require('msgbus');
    //var moment = require('moment');
    var QuestionsView;

    var QuestionItem = Backbone.View.extend({
        manage: true,
        template: 'question-item',
        tagName: 'li',

        events: {
            'click': 'showQuestion'
        },

        serialize: function () {
            var data = this.model.toJSON();
            return data;
        },

        /***
         * show Question page
         */
        showQuestion: function () {
            msgBus.commands.execute('question:get', this.model.id);
            app.router.navigate('question/' + this.model.get('question_id'));
        }

        
    });

    QuestionsView = Backbone.Layout.extend({
        template: 'questions',

        events: {
            'click #topic-submit': 'searchQuestions',
            'change #param-sort': 'sortQuestions'
        },

        searchQuestions: function () {
            var term = $('#topic').val();
            if (term !== '') {
                msgBus.commands.execute('questions:search', term);
            }
            
        },

        sortQuestions: function () {

            var newSort = $('#param-sort').val();
            app.globalModel.set('currentSort', newSort);
            msgBus.commands.execute('questions:get');

        },

        initialize: function () {
            msgBus.commands.execute('scroll:top');
        },

        afterRender: function () {

            var currentTerm = app.globalModel.get('searchTerm');
            var currentSort = app.globalModel.get('currentSort');
            if (currentTerm) {
                $('#topic').val(currentTerm);
            }
            $('#param-sort').val(currentSort);

        },

        beforeRender: function () {
            
            this.collection.each(function (item) {

                this.insertView('.questions-list', new QuestionItem({
                    model: item
                }));

            }, this);
        }

    });

    module.exports = QuestionsView;
});