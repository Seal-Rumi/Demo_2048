define(["jquery"], function ($) {
  //Public
  let _Game = {
    rows: 0,
    columns: 0,
    numArr: [],
    score: 0,
    system: "none",
    mode: "3x3",
    history: [0, 0, 0, 0, 0],
  };
  let _numBlocks;

  //初始化
  function init(rows = 4, columns = 4) {
    _Game.rows = rows;
    _Game.columns = columns;
    _Game.numArr = [];
    for (let i = 0; i < _Game.rows; i++) {
      let rowArr = [];
      for (let j = 0; j < _Game.columns; j++) {
        rowArr.push(0);
      }
      _Game.numArr.push(rowArr);
    }
    _Game.score = 0;
    _Game.system = "none";
    _Game.mode = `${_Game.rows}x${_Game.columns}`;
  }
  function bgm() {
    $(document).ready(function () {});
  }

  //(前端)建立網格
  function createGrids() {
    $("#gameBlock").empty();
    for (let i = 0; i < _Game.rows; i++) {
      var numRow = $("<div></div>");
      numRow.attr("id", `numRow${i}`);
      numRow.addClass("numRow");
      $("#gameBlock").append(numRow);
      for (let j = 0; j < _Game.columns; j++) {
        var numBlock = $("<div></div>");
        numBlock.attr("id", `num${i * _Game.columns + j}`);
        numBlock.addClass("numBlock");
        numBlock.addClass("Game");
        $(`#numRow${i}`).append(numBlock);
      }
      $("#gameBlock").append(numRow);
    }
  }

  //檢查空容器
  function emptyCheck() {
    let emptyArr = [];
    for (let i = 0; i < _Game.rows; i++) {
      for (let j = 0; j < _Game.columns; j++) {
        if (_Game.numArr[i][j] == 0) {
          emptyArr.push(i * _Game.columns + j);
        }
      }
    }
    return emptyArr;
  }
  //隨機產生
  function randomGenerator(number = 2) {
    let emptyArr = emptyCheck();
    if (!emptyArr) {
      return;
    }
    let index = Math.floor(Math.random() * emptyArr.length);
    let row = Math.floor(emptyArr[index] / _Game.columns);
    let column = emptyArr[index] % _Game.columns;
    if (emptyArr.length > 0) {
      _Game.numArr[row][column] = number;
    }
    return [row, column];
  }
  function scoreCalculate() {
    //a0 = 0
    //an = 2an-1 + 2^(n+1)
    //=> an = n*2^(n+1)
    let score = 0;
    for (let i = 0; i < _Game.rows; i++) {
      for (let j = 0; j < _Game.columns; j++) {
        if (_Game.numArr[i][j] !== 0) {
          let n = Math.log(_Game.numArr[i][j]) / Math.log(2) - 1;
          score += n * Math.pow(2, n + 1);
        }
      }
    }
    _Game.score = score;
  }
  //更新前端
  function update() {
    //遊戲系統開始才更新
    if (_Game.system !== "start") {
      return;
    }
    //數字方塊
    let colorMap = [];
    for (let i = 0; i < _Game.rows; i++) {
      for (let j = 0; j < _Game.columns; j++) {
        let num = _Game.numArr[i][j];
        let targetDiv = $(`#num${i * _Game.columns + j}`);
        targetDiv.html("");
        if (num != 0) {
          targetDiv.html(`${num}`);
          // targetDiv.css("background-color", "#ffffff");
        }
      }
    }
    //分數
    $("#sub").html("" + _Game.score);
  }

  function gameOverCheck() {
    let boardFull = true;
    for (let i = 0; i < _Game.rows; i++) {
      for (let j = 0; j < _Game.columns; j++) {
        if (_Game.numArr[i][j] === 0) {
          boardFull = false;
          break;
        }
      }
      if (!boardFull) break;
    }
    if (!boardFull) return false;
    for (let i = 0; i < _Game.rows; i++) {
      for (let j = 0; j < _Game.columns; j++) {
        if (
          (i > 0 && _Game.numArr[i][j] === _Game.numArr[i - 1][j]) ||
          (i < _Game.rows - 1 &&
            _Game.numArr[i][j] === _Game.numArr[i + 1][j]) ||
          (j > 0 && _Game.numArr[i][j] === _Game.numArr[i][j - 1]) ||
          (j < _Game.columns - 1 &&
            _Game.numArr[i][j] === _Game.numArr[i][j + 1])
        ) {
          return false;
        }
      }
    }
    return true;
  }

  function moving(direction) {
    if (_Game.system !== "start") {
      return;
    }
    //推演函數
    function myPush(arr) {
      let newArr = arr.filter((num) => num !== 0);
      for (let i = 1; i < newArr.length; i++) {
        if (newArr[i] == newArr[i - 1]) {
          newArr[i - 1] *= 2;
          newArr[i] = 0;
        }
      }
      newArr = newArr.filter((num) => num !== 0);
      while (newArr.length < arr.length) {
        newArr.push(0);
      }
      return newArr;
    }
    let tmp = [];
    for (let i = 0; i < _Game.numArr.length; i++) {
      tmp.push(_Game.numArr[i].slice());
    }
    switch (direction) {
      //向左&向右
      case "left":
      case "right":
        for (let i = 0; i < _Game.rows; i++) {
          let row = _Game.numArr[i];
          if (direction === "right") {
            row = row.reverse();
          }
          _Game.numArr[i] = myPush(row);
          if (direction === "right") {
            _Game.numArr[i] = _Game.numArr[i].reverse();
          }
        }

        break;
      //向上&向下
      case "up":
      case "down":
        for (let i = 0; i < _Game.columns; i++) {
          let column = [];
          for (let j = 0; j < _Game.rows; j++) {
            column.push(_Game.numArr[j][i]);
          }
          if (direction === "down") {
            column = column.reverse();
          }
          column = myPush(column);
          if (direction === "down") {
            column = column.reverse();
          }
          for (let j = 0; j < _Game.rows; j++) {
            _Game.numArr[j][i] = column[j];
          }
        }
        break;
      default:
        break;
    }
    scoreCalculate();
    let rdFlag = false;
    for (let i = 0; i < _Game.rows; i++) {
      for (let j = 0; j < _Game.columns; j++) {
        if (_Game.numArr[i][j] !== tmp[i][j]) {
          rdFlag = true;
          break;
        }
      }
      if (rdFlag) break;
    }
    if (rdFlag) randomGenerator();
    if (gameOverCheck()) {
      update();
      _Game.system = "gameOver";
      setTimeout(function () {
        $("#gameOverUI").css("display", "flex");
        $("#restartBtn").hide();
        setTimeout(function () {
          $("#restartBtn").show();
        }, 1000);
        $("#bgMusic").trigger("pause");
      }, 500);
    }
  }

  function restart() {
    init(_Game.rows, _Game.columns);
    _Game.system = "start";
    createGrids();
    randomGenerator(2);
    update();
    $("#gameOverUI").css("display", "none");
  }

  //按鈕事件
  function btnReact() {
    //開始按鈕
    $(document).on("click", "#startBtn", function () {
      if (_Game.system !== "start") {
        _Game.system = "start";
        setTimeout(function () {
          $("#startMenu").css("display", "none");
        }, 600);
        $("#bgMusic").trigger("play");
        createGrids();
        randomGenerator(2);
        update();
      }
    });
    //選擇模式
    $(document).on("click", "#ModeBtn", function () {
      $("#modeBox").toggle();
    });
    $(document).on("click", "#mode3x3, #mode4x4, #mode5x5", function () {
      let mode = $(this).attr("id").substring(4);
      _Game.mode = mode;
      $("#modeText2").html(mode);
      $("#modeBox").hide();
      init(parseInt(mode.substring(0, 1)), parseInt(mode.substring(2)));
    });
    $(document).on("click", "#restartBtn", function () {
      $("#bgMusic").trigger("play");
      restart();
    });
  }
  //鍵盤事件
  function keyboardReact() {
    $(document).on("keydown", function (event) {
      let key = event.key.toUpperCase();
      let direction = ["W", "A", "S", "D"];
      let directionMap = { W: "up", A: "left", S: "down", D: "right" };
      if (direction.includes(key)) {
        moving(directionMap[key]);
        update();
      } else if (key === "R") {
        $("#bgMusic").trigger("play");
        restart();
      }
    });
  }

  function main() {
    btnReact();
    keyboardReact();
  }
  return {
    init: init,
    main: main,
  };
});
