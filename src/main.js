import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import { Complete } from './js/mode-complete.js';
import { validater } from './js/validate-char.js';

function playAudio() {
  return document.querySelector("#soundPass").play();
}

function blink_text() {
  $(".blinker").fadeOut(150);
  $(".blinker").fadeIn(300);
}
setInterval(blink_text, 1500);

function textFocus() {
  $("#inputField").focus();
}

$(document).ready(function() { 
  $("#radio-form").focus();
  $("#start").show();
  $('#radio').submit(function(event) {
    setInterval(textFocus, 100);
    event.preventDefault();
    let difficulty = $('input:radio[name=diff]:checked').val();
    let game = new Complete;
    game = Complete.newGameInstance(0); // this adds a key-value pair to the game instance AND ups it by one each time called
    // $("#inputField").focus();
    gameStart(game, difficulty);
  });
  function gameStart(game, difficulty) {
    $('#seconds').html(`${game.time.minutes}:${game.time.seconds}`);
    // $('#minutes').html(`<span> </span>`);
    Timer();
    $("#visual").html("<span class='blinker'>|</span>");
    $("#inputField").val("");
    $("#start").hide();
    $("#promptOut").text(game.prompt[difficulty][0]);
    $("#progress").text(`1/${game.prompt[difficulty].length}`);
    // console.log(game.prompt[difficulty][game.turnsTaken - 1]);
    $("#inputField").on("input", function() {
      // console.log(`game.prompt value: ${game.prompt}`);
      // console.log(`difficulty value: ${difficulty}`);
      // console.log(`turns taken: ${game.turnsTaken - 1}`);
      // console.log(`checker used very soon: ${game.prompt[difficulty][game.turnsTaken - 1]}`);
      $("#visual").html(validater($("#inputField").val(), game.prompt[difficulty][game.turnsTaken -1]));
    });
    $("#input").submit(function(event) {
      event.preventDefault();
      game.userInput.push($("#inputField").val());
      if (game.checkAnswer(difficulty) === "correct") {
        game.turnsTaken ++;
        if (game.turnsTaken <= game.prompt[difficulty].length) {
          // $("#correct").show();
          $("#progress").css("background-color", "green");
          $("#inputField").val("");
          $("#promptOut").text(game.prompt[difficulty][game.turnsTaken - 1]);
          $("#progress").text((game.turnsTaken) + "/" + game.prompt[difficulty].length);
          $("#visual").html("<span class='blinker'>|</span>");
          playAudio().then(function() {
            console.log("soundPass has been played")
          });
          // var audio = new Audio('audio_file.mp3');
          // audio.play();
          // $("#soundPass").play();
          setTimeout(function() {
            // $("#correct").hide();
            $("#progress").css("background-color", "transparent");
          } , 200);
        } else {
          let score = showScore();
          console.log(score);
          $('#gameScore').html(`<span>${score}</span>`);
          game.resetPlayer();
          $('#gameOver').show();
        }
      } else if (game.checkAnswer(difficulty) === 'incorrect') {
        // $("#incorrect").show();
        $("#progress").css("background-color", "red");
        game.userInput.pop();
        setTimeout(function() {
          // $("#incorrect").hide();
          $("#progress").css("background-color", "transparent");
        } , 200);
      }
    });
    $("#promptForm").submit(function(e) {
      e.preventDefault();
      game.addPrompt($("#userPrompt").val(), difficulty);
      $('#progress').text((game.turnsTaken) + "/" + game.prompt[difficulty].length);
      $("#userPrompt").val("");
    });
    function Timer() {
      let timer = setInterval(function() {
        game.time.seconds ++;
        $('#seconds').html(`${game.time.minutes}:${game.time.seconds}`);
        if (game.time.seconds === 60) {
          game.time.minutes ++;
          $('#seconds').html(`${game.time.minutes}:${game.time.seconds}`);
          game.time.seconds = 0;
          clearInterval(timer);
          Timer();
        }
      }, 1000);
    }

    function showScore() {
      let num = 0;
      for (let i = 0; i < game.prompt[difficulty].length; i++) {
        num += game.prompt[difficulty][i].length;
      }
      let score =  Math.floor(num / (game.time.minutes + (game.time.seconds / 60))) + " Characters / minute";
      return score;
    }
  }
});