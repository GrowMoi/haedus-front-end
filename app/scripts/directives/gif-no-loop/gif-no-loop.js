(function () {
  'use strict';

  angular
    .module('moi')
    .directive('gifNoLoop', gifNoLoopDirective);

  function gifNoLoopDirective() {
    var directive = {
      restrict: 'EA',
      require: ['gifNoLoop', '^gifQueue'],
      templateUrl: 'templates/directives/gif-no-loop/gif-no-loop.html',
      scope: {
        order: '=',
        src: '@',
        sound: '@',
        clickeable: '&'
      },
      link: gifNoLoopLink,
      controller: gifNoLoopController,
      controllerAs: 'vm',
      bindToController: true,
      transclude: true
    };

    return directive;
  }

  function gifNoLoopLink(scope, element, attrs, controllers){
    var gifController = controllers[0],
        gifQueue = controllers[1];

    gifQueue.enqueue(gifController);
  }

  function gifNoLoopController($element, $q, $scope){
    var vm = this,
        moiSound,
        $img = $element.find('img'),
        audioLoadDefer = $q.defer(),
        playbackDeferred = $q.defer();

    /* jshint camelcase: false */
    var gif = new SuperGif({
      gif: $img[0],
      loop_mode: false,
      auto_play: false,
      rubbable: false,
      max_width: 150,
      draw_while_loading: false,
      on_end: playbackDeferred.resolve
    });

    vm.load = load;
    vm.play = play;

    $scope.$on('audioLoaded', function (e, moiSoundInstance) {
      moiSound = moiSoundInstance;
      audioLoadDefer.resolve();
    });

    function load() {
      var loadPromises = [ loadGif() ];
      if (!!vm.sound) {
        loadPromises.push(audioLoadDefer.promise);
      }

      var deferred = $q.defer();
      $q.all(loadPromises).then(function () {
        deferred.resolve(vm);
      });
      return deferred.promise;
    }

    function loadGif() {
      var deferred = $q.defer();
      /* jshint camelcase: false */
      gif.load_url(vm.src, deferred.resolve);
      return deferred.promise;
    }

    function play() {
      gif.play();
      if (moiSound) {
        moiSound.play();
      }
      return playbackDeferred.promise;
    }
  }

})();