function Game(selector) {

    if (!selector) {
        throw new Error('You do not insert selector. Please insert canvas selector.');
    }
    if(!document.getElementById(selector)) {
        throw new Error('Element with such ID not exist! Set another ID.');
    }

    //init constants
    var DIRECTIONS = {
        RIGHT: 39,
        LEFT: 37,
        UP: 38,
        DOWN: 40
    };
    var SNAKE_LENGTH = 3;

    //init canvas variables
    var canvas = document.getElementById(selector);
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    if (width !== height) {
        throw new Error('Canvas should be square. Please set width and height values equal.');
    }

    //init variables
    var snakeBody = [];
    var foodBody = {};
    var cell_qnt = 20;
    var cell_size = width / cell_qnt;
    var current_direction = DIRECTIONS.RIGHT;
    var game_live;
    var score = 0;
    var score_step = 5;
    var speed = 500;
    var speed_step = 30;
    var speed_score = 1;

    //public method
    function start () {//public
        _buildFood();
        game_live = setInterval(_paint, speed);
        document.addEventListener('keydown', _setKeyDownEventHandler, false);
    }

    function setPauseButton(selector) {//public
        var element = document.getElementById(selector);
        element.addEventListener('click', _setClickPauseEventHandler, false);
        return self;
    }

    function setRestartButton(selector) {//public
        var element = document.getElementById(selector);
        element.addEventListener('click', _setClickRestartEventHandler, false);
        return self;
    }

    function _setClickPauseEventHandler() {//private
        if(game_live) {
            clearInterval(game_live);
            game_live = undefined;
        } else {
            game_live = setInterval(_paint, speed);
        }
    }

    function _setClickRestartEventHandler() {//private
        _restart();
    }

    function _paint () {//private
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, width, height);

        _paintSnake();
        _paintFood();
        _paintText(5, height - 5, 'Score: ' + score + ' Speed: ' + speed_score);
    }


    function _paintSnake() {//private
         _buildSnake();
        for (var i = 0; i < snakeBody.length; i++) {
            _paintCell(snakeBody[i].x, snakeBody[i].y);
        }
    }

    function _buildSnake() {//private
        if (snakeBody.length) {
            _isInBorders() && _isNotEatItself() ? _setNewCoordinates() : _stopGame();
        } else {
            for (var i = 0; i < SNAKE_LENGTH; i++) {
                snakeBody.push({x: i, y: 0});
            }
        }
    }

    function _isInBorders() {//private
        var head = snakeBody[snakeBody.length-1];
        var result = false;
        switch (current_direction) {
            case DIRECTIONS.RIGHT:
                (head.x < cell_size-1) && (result = true);
                break;
            case DIRECTIONS.LEFT:
                (head.x > 0) && (result = true);
                break;
            case DIRECTIONS.UP:
                (head.y > 0) && (result = true);
                break;
            case DIRECTIONS.DOWN:
                (head.y < cell_size - 1) && (result = true);
                break;
        }
        return result;
    }

    function _isNotEatItself() {//private
        var flag = true;
        for(var i = 0; i < snakeBody.length-1; i++) {
            if (snakeBody[snakeBody.length-1].x === snakeBody[i].x &&
                snakeBody[snakeBody.length-1].y === snakeBody[i].y) {
                flag = false;
            }
        }
        return flag;
    }

    function _setNewCoordinates() {//private
        var coordinates = snakeBody[snakeBody.length-1];
        var x = coordinates.x;
        var y = coordinates.y;
        switch (current_direction) {
            case DIRECTIONS.RIGHT:
                x++;
                break;
            case DIRECTIONS.LEFT:
                x--;
                break;
            case DIRECTIONS.UP:
                y--;
                break;
            case DIRECTIONS.DOWN:
                y++;
                break;
        }
        snakeBody.push({x: x, y: y});
        if (foodBody.x === x && foodBody.y === y) {
            _buildFood();
            score++;
            if(score % score_step === 0 && (speed - speed_step > 0)) {
                speed = speed - speed_step;
                speed_score++
                clearInterval(game_live);
                game_live = setInterval(_paint, speed);
            }
        } else {
            snakeBody.shift();
        }
    }

    function _paintFood() {//private
        for(var i = 0; i < snakeBody.length; i++) {
            if(snakeBody[i].x === foodBody.x && snakeBody[i].y === foodBody.y) {
                _buildFood();
            }
        }
        _paintCell(foodBody.x, foodBody.y);
    }

    function _buildFood() {//private
        var x = Math.round(Math.random()*(cell_qnt - 1));
        var y = Math.round(Math.random()*(cell_qnt - 1));
        foodBody = {x: x, y: y};
    }

    function _paintCell(x, y) {//private
        ctx.fillStyle = "lightblue";
        ctx.fillRect(x*cell_size, y*cell_size, cell_size, cell_size);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*cell_size, y*cell_size, cell_size, cell_size);
    }

    function _paintText(x, y, text) {//private
        ctx.fillStyle = "black";
        ctx.fillText(text, x, y);
    }

    function _setKeyDownEventHandler(e) {//private
        var keyCode = e.keyCode;
        switch (keyCode) {
            case 37:
                current_direction !== DIRECTIONS.RIGHT && (current_direction = keyCode);
                break;
            case 38:
                current_direction !== DIRECTIONS.DOWN && (current_direction = keyCode);
                break;
            case 39:
                current_direction !== DIRECTIONS.LEFT && (current_direction = keyCode);
                break;
            case 40:
                current_direction !== DIRECTIONS.UP && (current_direction = keyCode);
                break;
        }
    }

    function _restart() {//private
        clearInterval(game_live);
        _refreshVariables();
        start();
    }

    function _refreshVariables() {//private
        snakeBody = [];
        foodBody = {};
        cell_size = 20;
        cell_qnt = 20;
        current_direction = DIRECTIONS.RIGHT;
        score = 0;
        speed = 500;
        speed_score = 1;
    }

    function _stopGame() {//private
        confirm("Game over!") ? _restart() : clearInterval(game_live);
    }

    var self = {
        setPauseButton: setPauseButton,
        setRestartButton: setRestartButton,
        start: start
    }

    return self;
}