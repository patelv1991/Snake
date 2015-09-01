(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

  var View = SG.View = function ($el, difficulty) {
    this.$el = $el;

    this.board = new SG.Board(45);
    this.setupGrid();
    this.paused = false;
    this.renderLandingPage();

    // renders all time highest score upon initialization
    if (localStorage.getItem('allTimeHigh')) {
      $('.all-time-high').html(localStorage.getItem('allTimeHigh'));
    }
  };

  View.KEYS = {
    // arrow key codes
    38: "N",
    39: "E",
    40: "S",
    37: "W",

    // WASD keycodes
    87: "N",
    68: "E",
    83: "S",
    65: "W"
  };

  View.SPEED = {
    "easy": 100,
    "medium": 60,
    "hard": 40
  };

  View.prototype.handleKeyEvent = function (event) {
    if (!this.paused && View.KEYS[event.keyCode]) {
      this.board.snake.turn(View.KEYS[event.keyCode]);
    } else {
      if (event.keyCode === 32) {
        this.togglePause();
      }
    }
  };

  View.prototype.render = function () {

    this.updateClasses(this.board.snake.segments, "snake");
    // this.updateClasses([this.board.snake.head()], "head");
    this.updateClasses([this.board.apple.position], "apple");

    $('.score').html(this.board.snake.score);
    if (SG.highScore) {
      $('.high-score').html(SG.highScore);
    }
    if (localStorage.getItem('allTimeHigh')) {
      $('.all-time-high').html(localStorage.getItem('allTimeHigh'));
    }
  };

  View.prototype.restartGame = function () {
    // debugger;
    $(window).off();
    this.board = new SG.Board(45);
    this.renderLandingPage();
  };

  View.prototype.setupGrid = function () {
    var html = "";

    for (var i = 0; i < this.board.dim; i++) {
      html += "<ul>";
      for (var j = 0; j < this.board.dim; j++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = this.$el.find("li");
  };

  View.prototype.startGame = function (difficulty) {
    // debugger
    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.SPEED[this.difficulty]
    );

    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
      SG.updateHighScore(this.board.snake.score);
      this.updateAllTimeHighScore(this.board.snake.score);
    } else {
      this.gameOver();
      // SG.gameOver(this.$el);
      $(window).off();
      window.clearInterval(this.intervalId);
    }
  };

  View.prototype.togglePause = function () {
    if (this.paused) {
      $('.pause-screen').addClass('hidden');
      this.paused = false;
      this.intervalId = window.setInterval(
        this.step.bind(this),
        View.SPEED[this.difficulty]
      );
    } else {
      $('.pause-screen').removeClass('hidden');
      this.paused = true;
      window.clearInterval(this.intervalId);
    }
  };

  View.prototype.updateClasses = function(coords, className) {
    this.$li.filter("." + className).removeClass(className);

    if (coords && coords[0]) {
      coords.forEach(function(coord){
        var flatCoord = (coord.i * this.board.dim) + coord.j;
        this.$li.eq(flatCoord).addClass(className);
      }.bind(this));
    }
  };

  View.prototype.renderLandingPage = function () {
    // debugger
    var $welcome = $('.welcome');
    $welcome.removeClass('hidden');
    $('div.level button').click(function(event) {
      $welcome.addClass('hidden');
      $('div.level button').unbind('click');
      // $('div.level button').off();
      var difficulty = event.target.className;
      this.difficulty = difficulty;
      this.renderCountDown();
    }.bind(this));
  };

  View.prototype.renderCountDown = function () {
    var $countdown = $('.countdown');
    $countdown.removeClass('hidden');
    $countdown.find('p').text('3');
    window.setTimeout(function () {
      $countdown.find('p').text('2');
      window.setTimeout(function () {
        $countdown.find('p').text('1');
        window.setTimeout(function () {
          $countdown.addClass('hidden');
          this.startGame();
        }.bind(this), 1000);
      }.bind(this), 1000);
    }.bind(this), 1000);
  };

  View.prototype.gameOver = function () {
    // debugger
    // this.$el.find('.apple').addClass('hidden');
    var $gameOver = $('.gameover');
    $gameOver.removeClass('hidden');
    $gameOver.find('button').on('click', function (event) {
      $gameOver.find('button').unbind('click');
      $gameOver.addClass('hidden');
      this.restartGame();
    }.bind(this));
  };

  SG.updateHighScore = function (score) {
    if (this.highScore) {
      if (score > this.highScore) {
        this.highScore = score;
      }
    } else {
      this.highScore = score;
    }
  };

  View.prototype.updateAllTimeHighScore = function (score) {
    // debugger
    if (localStorage.getItem('allTimeHigh')) {
      if (score > localStorage.getItem('allTimeHigh')) {
        localStorage.setItem('allTimeHigh', score, { path: "" });
      }
    } else {
      localStorage.setItem('allTimeHigh', score, { path: "" });
    }
  };
})();
