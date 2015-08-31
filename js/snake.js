(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

  var Snake = SG.Snake = function (board) {
    this.dir = "N";
    this.turning = false;
    this.board = board;

    // Finds the center of the board to initiate the snake
    var center = new SG.Coord(Math.floor(board.dim/2), Math.floor(board.dim/2));
    this.segments = [center];
    this.score = 0;
    this.growTurns = 0;
  };

  Snake.DIFFS = {
    "N": new SG.Coord(-1, 0),
    "E": new SG.Coord(0, 1),
    "S": new SG.Coord(1, 0),
    "W": new SG.Coord(0, -1)
  };

  Snake.SYMBOL = "S";
  Snake.GROW_TURNS = 3;

  Snake.prototype.eatApple = function () {
    if (this.head().equals(this.board.apple.position)) {
      this.growTurns += 3;
      this.score += 1;
      return true;
    } else {
      return false;
    }
  };

  Snake.prototype.isOccupying = function (array) {
    var result = false;
    this.segments.forEach(function (segment) {
      if (segment.i === array[0] && segment.j === array[1]) {
        result = true;
        return result;
      }
    });
    return result;
  };

  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.isValid = function () {
    var head = this.head();

    // checks whether snake is still within the boundry
    if (!this.board.validPosition(this.head())) {
      return false;
    }

    // checks whether snake has run into itself
    for (var i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }

    return true;
  };

  Snake.prototype.move = function () {
    // move snake forward
    this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));

    // allow turning again
    this.turning = false;

    // maybe eat an apple
    if (this.eatApple()) {
      this.board.apple.replace();
    }

    // if not growing, remove tail segment
    if (this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
      this.segments.shift();
    }

    // destroy snake if it eats itself or runs off grid
    if (!this.isValid()) {
      this.segments = [];
    }
  };

  Snake.prototype.turn = function (dir) {
    // avoid turning directly back on yourself
    if (Snake.DIFFS[this.dir].isOpposite(Snake.DIFFS[dir]) ||
      this.turning) {
      return;
    } else {
      this.turning = true;
      this.dir = dir;
    }
  };


})();
