(function(){
  'use strict';
  angular.module('moi.controllers')
  .controller('TasksController', function(){
    var tasksmodel = this;

    tasksmodel.buttonsOptions = {
      neuron: {},
      content: {},
      buttons: {
        search: true,
        recomendation: true,
        showTasks: {
          disabled: true
        }
      }
    };

    tasksmodel.tabs = [
      {
        field:'notes',
        name: 'Notas',
        image: 'images/notes_tasks.png',
        selected: true,
        state: 'tasks.notes'
      },
      {
        field:'recomendations',
        name: 'Recomendaciones',
        image: 'images/recomendations_tasks.png',
        selected: false,
        state: 'tasks.default'
      },
      {
        field:'tasks',
        name: 'Tareas',
        image: 'images/notifications_tasks.png',
        selected: false,
        state: 'tasks.contents'
      },
      {
        field:'notifications',
        name: 'Notificaciones',
        image: 'images/notifications_tasks.png',
        selected: false,
        state: 'tasks.notifications'
      },
      {
        field:'favorites',
        name: 'Favoritos',
        image: 'images/favorites_tasks.png',
        selected: false,
        state: 'tasks.default'
      }
    ];

    tasksmodel.changeTab = function(field) {
      angular.forEach(tasksmodel.tabs, function(tab) {
        if(tab.field === field){
          tab.selected = true;
          tasksmodel.tabSelected = tab.field;
        }else{
          tab.selected = false;
        }
      });
    };

  });
})();
