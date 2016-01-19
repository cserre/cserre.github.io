// Good luck!
$(document).ready(function() {

  // -------------------------------------------------------------
  // variables
  // -------------------------------------------------------------

  var grid_size = 0;
  var nb_bombs = 0;
  var nb_cells = 0;

  // -------------------------------------------------------------
  // functions
  // -------------------------------------------------------------

  // select a cell from its number
  var selectCell = function(number) {
    var modulo = Math.floor(number % grid_size);
    if (modulo == 0) {
      var line = Math.floor(number / grid_size);
      var column = grid_size;
    } else {
      var line = Math.floor(number / grid_size + 1);
      var column = modulo;
    }
    var selectedCell = $('#minesweeper tr:nth-child(' + line + ') td:nth-child(' + column + ')');
    return selectedCell;
  }
  // find a cell line with its number
  var cellLine = function(number) {
    var modulo = Math.floor(number % grid_size);
    if (modulo == 0) {
      var line = Math.floor(number / grid_size);
    } else {
      var line = Math.floor(number / grid_size + 1);
    }
    return line;
  }
  // find a cell column with its number
  var cellColumn = function(number) {
    var modulo = Math.floor(number % grid_size);
    if (modulo == 0) {
      var column = grid_size;
    } else {
      var column = modulo;
    }
    return column;
  }
  // check if a cell is a bomb
  var isBomb = function(cell_number) {
    var is_bomb = selectCell(cell_number).hasClass('mine');
    return is_bomb
  }
  var isNumber = function(cell_number) {
    var is_number = selectCell(cell_number).hasClass('mine-neighbour');
    return is_number
  }

  var isEmpty = function(cell_number) {
    is_empty = false
    if (!(isBomb(cell_number)) && !(isNumber(cell_number))) {
      is_empty = true;
    }
    return is_empty
  }

  var getNumber = function(td) {
    var index = $('td').index(td) + 1;
    return index
  }

  var emptyAround = function(number) {
    var col_before = false;
    var col_after = false;
    var line_before = false;
    var line_after = false;

    // is there a column before
    if (cellColumn(number) > 1) { col_before = true };
    // is there a row before
    if (cellLine(number) > 1) { line_before = true };
    // is there a column after
    if (cellColumn(number) < grid_size) { col_after = true };
    // is there a row after
    if (cellLine(number) < grid_size) { line_after = true };

    selectCell(number).removeClass('unopened');
    selectCell(number).addClass('opened');
    // left cell
    if (col_before) {
      if (isEmpty(number - 1) && selectCell(number - 1).hasClass('unopened')) {
        emptyAround(number - 1)
      } else if (isNumber(number - 1)) {
        selectCell(number - 1).removeClass('unopened');
      }
    }

    // right cell
    if (col_after) {
      if (isEmpty(number + 1)  && selectCell(number + 1).hasClass('unopened')) {
        emptyAround(number + 1)
      } else if (isNumber(number + 1)) {
        selectCell(number + 1).removeClass('unopened');
      }
    }
    // up cell
    if (line_before) {
      if (isEmpty(number - grid_size) && selectCell(number - grid_size).hasClass('unopened')) {
        emptyAround(number - grid_size)
      } else if (isNumber(number - grid_size)) {
        selectCell(number - grid_size).removeClass('unopened');
      }
    }
    // down cell
    if (line_after) {
      if (isEmpty(number + grid_size) && selectCell(number + grid_size).hasClass('unopened')) {
        emptyAround(number + grid_size)
      } else if (isNumber(number + grid_size)) {
        selectCell(number + grid_size).removeClass('unopened');
      }
    }
    if (col_before && line_before) {
      if (isEmpty(number - grid_size - 1) && selectCell(number - grid_size - 1).hasClass('unopened')) {
        emptyAround(number - grid_size - 1)
      } else if (isNumber(number - grid_size - 1)) {
        selectCell(number - grid_size - 1).removeClass('unopened');
      }
    }
    // up right cell
    if (col_after && line_before) {
      if (isEmpty(number - grid_size + 1) && selectCell(number - grid_size + 1).hasClass('unopened')) {
        emptyAround(number - grid_size + 1)
      } else if (isNumber(number - grid_size + 1)) {
        selectCell(number - grid_size + 1).removeClass('unopened');
      }
    }
    // down left cell
    if (col_before && line_after) {
      if (isEmpty(number + grid_size - 1) && selectCell(number + grid_size - 1).hasClass('unopened')) {
        emptyAround(number + grid_size - 1)
      } else if (isNumber(number + grid_size - 1)) {
        selectCell(number + grid_size - 1).removeClass('unopened');
      }
    }
    // down right cell
    if (col_after && line_after) {
      if (isEmpty(number + grid_size + 1) && selectCell(number + grid_size + 1).hasClass('unopened')) {
        emptyAround(number + grid_size + 1)
      } else if (isNumber(number + grid_size + 1)) {
        selectCell(number + grid_size + 1).removeClass('unopened');
      }
    }
  }

  // -------------------------------------------------------------
  // start the code
  // -------------------------------------------------------------


  $('#level').submit(function(event) {
    event.preventDefault();
    // $("#minesweeper").on('click', handler);
    var grid_ready = false; // becomes true when grid is ready
    var nb_cells_bomb = 0; // begin with no bombs on the grid

    // -------------------------------------------------------------
    // select the level
    // -------------------------------------------------------------

    $('#minesweeper').empty();
    $('#result').empty();
    var level = $('#level option:selected').text();

    // different sizes depending on difficulty
    if ($.trim(level) == 'beginner') {
      grid_size = 6;
      nb_bombs = 5;
    } else if ($.trim(level) == 'intermediate') {
      grid_size = 10;
      nb_bombs = 15;
    } else if ($.trim(level) == 'expert') {
      grid_size = 15;
      nb_bombs = 30;
    } else if ($.trim(level) == 'no life') {
      grid_size = 18;
      nb_bombs = 50;
    }

    for (var tr = 1; tr <= grid_size; tr +=1) {
      // console.log('tr : ' + tr);
      $('#minesweeper').append('<tr></tr>');
      for (var td = 1; td <= grid_size; td +=1) {
        // console.log('            td : ' + td);
        $('#minesweeper tr:last-child').append("<td class='unopened'></td>");
      }
    }

    nb_cells = grid_size * grid_size; // a square is nice
    // -------------------------------------------------------------
    // put the mines
    // -------------------------------------------------------------

    // randomly position the bombs
    while (!grid_ready) {


      var bool_bomb = true;
      while (bool_bomb)  {
        // random selection of a cell
        var bomb_cell = Math.floor((Math.random() * nb_cells) + 1);

        // select the right cell and check if it is already a bomb
        var is_bomb = isBomb(bomb_cell);
        // if yes, start again
        // if not set it as a bomb
        if (!is_bomb) {
          selectCell(bomb_cell).addClass('mine');
// a retirer apres pour cacher les bombes
          //selectCell(bomb_cell).removeClass('unopened');
          bool_bomb = false;
          nb_cells_bomb += 1;
        }
        if (nb_cells_bomb == nb_bombs) { grid_ready = true };
      }
    }

    // -------------------------------------------------------------
    // put the numbers
    // -------------------------------------------------------------

    // when grid is ready, position the numbers
    // go through the cells
    if (grid_ready) {
      for (var number = 1; number <= nb_cells; number += 1) {
        // check if the cell is a bomb -> next
        var is_bomb = isBomb(number);

        var col_before = false;
        var col_after = false;
        var line_before = false;
        var line_after = false;
        var nb_bombs_around = 0;

        if (!is_bomb) {
          // if not a bomb, check if there are bombs around
          // is there a column before
          if (cellColumn(number) > 1) { col_before = true };
          // is there a row before
          if (cellLine(number) > 1) { line_before = true };
          // is there a column after
          if (cellColumn(number) < grid_size) { col_after = true };
          // is there a row after
          if (cellLine(number) < grid_size) { line_after = true };

          // console.log('number : '+ number, 'col_before : ' + col_before, 'col_after : ' + col_after, 'line_before : ' + line_before, 'line_after : ' + line_after);
          // left cell
          if (col_before) {
            if (isBomb(number - 1)) { nb_bombs_around += 1 };
          }
          // right cell
          if (col_after && isBomb(number + 1)) { nb_bombs_around += 1 };
          // up cell
          if (line_before && isBomb(number - grid_size)) { nb_bombs_around += 1 };
          // down cell
          if (line_after && isBomb(number + grid_size)) { nb_bombs_around += 1 };
          // up left cell
          if (col_before && line_before && isBomb(number - grid_size - 1)) { nb_bombs_around += 1 };
          // up right cell
          if (col_after && line_before && isBomb(number - grid_size + 1)) { nb_bombs_around += 1 };
          // down left cell
          if (col_before && line_after && isBomb(number + grid_size - 1)) { nb_bombs_around += 1 };
          // down right cell
          if (col_after && line_after && isBomb(number + grid_size + 1)) { nb_bombs_around += 1 };

          // console.log('number : ' + number, 'bombs around : ' + nb_bombs_around);
          if (nb_bombs_around == 0) {
            // selectCell(number).addClass('opened');
          } else {
            selectCell(number).addClass('mine-neighbour mine-neighbour-' + nb_bombs_around);
          }

// a retirer apres pour cacher les bombes
          // selectCell(number).removeClass('unopened');
        } // end of if is not bomb
      } // end of for
    }; // end of grid ready



    startUp();
  }); // end of sumbit




function startUp() {
    // -------------------------------------------------------------
    // play the game
    // -------------------------------------------------------------

    // retire le menu du clic droit
    $('body').on('contextmenu', function() {
      return false;
    });

    $('#minesweeper').on('mousedown', 'td', function(event) {
      event.preventDefault();
      var click_type = event.button;
      var index = getNumber($(this));

      // clic gauche = normal
      if (click_type == 0) {
        // if it is a number
        if (isNumber(index)) {
          $(this).removeClass('unopened');
        } else if (isBomb(index)) {
        // if it is a bomb
          $("#minesweeper .mine").removeClass('unopened flagged');
          $('.bg h1').html('Will you be good enough ? Nope... <i class="fa fa-frown-o"></i>');
          $("#minesweeper").off("mousedown");
        } else if (isEmpty(index)) {
          // if it is empty
          var empty = emptyAround(index);
        }

        // check if the guy won
        var won = true;
        // console.log(nb_cells);
        for (var i = 1; i <= nb_cells; i += 1) {
          if (selectCell(i).hasClass('unopened') && !(isBomb(i))) {
            // console.log('i : ' + i, 'isbomb : ' + isBomb(i));
            won = false;
            break;
          }
        }
        // stop if won = true
        if (won == true) {
          $("#minesweeper .mine").removeClass('unopened flagged');
          $('.bg h1').html('Will you be good enough ? Yes! <i class="fa fa-smile-o"></i>');
          $("#minesweeper").off("mousedown");
        };
      // clic droit = 2 doigts sur mac
      } else if (click_type == 2) {
        if ($(this).hasClass('flagged')) {
          $(this).removeClass('flagged');
          $(this).addClass('question');
        } else if ($(this).hasClass('question')) {
          $(this).removeClass('question');
        } else {
          $(this).addClass('flagged');
        }
      }
      // if MINE = show all mines and game is lost

      // if number = show

    });
  }
});

