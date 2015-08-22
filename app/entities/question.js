define(function (require) {

    /*jshint camelcase: false */
    'use strict';

    var app = require('app');
    var Backbone = require('backbone');
    var msgBus = require('msgbus');
    var Entities = {};

    Entities.Question = Backbone.Model.extend({
        url: function () {
            return 'https://api.stackexchange.com/2.2/questions/' + app.globalModel.get('questionID') + '?filter=withbody&site=stackoverflow';
        }
    });

    
    var API = {

        getQuestionEntities: function () {
            var model = new Entities.Question();
            var defer = $.Deferred();

            msgBus.commands.execute('loading:show', {message: 'Loading...'});

                model.fetch({
                    success: function (data) {
                        defer.resolve(data);
                        msgBus.commands.execute('loading:hide');
                    },
                    error: function (model, jqXHR, textStatus) {
                        msgBus.commands.execute('loading:hide');
                        defer.reject(model, jqXHR, textStatus);
                    }
                });

            return defer.promise();
        }

    };

    msgBus.reqres.setHandler('question:entities', function () {
        return API.getQuestionEntities();
    });


});
