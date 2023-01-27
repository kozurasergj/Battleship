// Здесь наше представление
const view = {
  displayMessage(msg) {
    const messageArea = document.querySelector('#messageArea');
    messageArea.innerHTML = msg;
  },

  displayHit(location) {
    const cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },

  displayMiss(location) {
    const cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

// Здесь наша модель поведения игры
const model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }
  ],

  fire(guess) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      let index = ship.locations.indexOf(guess);

      if (ship.hits[index] === "hit") {
        view.displayMessage("Oops, you already hit that location!");
        return true;
      } else if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");

        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },

  isSunk(ship) {
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
  // Метод создает в модели массив ships
  generateShipLocations() {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
    console.log("Ships array: ");
    console.log(this.ships);
  },

  // метод создает один корабль
  generateShip() {
    let direction = Math.floor(Math.random() * 2);
    let row, col;

    if (direction === 1) { // horizontal
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
    } else { // vertical
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
      col = Math.floor(Math.random() * this.boardSize);
    }

    let newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },

  // метод получает один корабль и проверяет, что тот не перекрывается с другими кораблями
  collision(locations) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      for (let j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }

};

const controller = {
  gusses: 0,

  processGuess(guess) {
    let location = parseGuess(guess);
    if (location) {
      this.gusses++;
      let hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(`Вы потопили все корабли за: ${this.gusses} выстрелов`);
      }
    }
  }
}

function parseGuess(guess) {
  const alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Вы ввели неверные координаты");
  } else {
    firstChar = guess.charAt(0); //извлекаем со строки первый символ
    let row = alphabet.indexOf(firstChar);
    let column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Вы ввели неверные координаты");
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("Вы ввели неверные координаты");
    } else {
      return row + column;
    }
  }
  return null;
}

function init() {
  const fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  // поработаем с Enter
  const guessInput = document.getElementById('guessInput');
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}

function handleFireButton() {
  const guessInput = document.getElementById('guessInput');
  let guess = guessInput.value;
  controller.processGuess(guess);

  guessInput.value = "";
}

function handleKeyPress(e) {
  const fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;