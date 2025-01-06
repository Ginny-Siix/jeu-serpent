var canvasWidth = 900;
var canvasHeight = 600;
var blocSkize = 30;
var ctx;
var delay = 110;
var snakee; // Déclarer snakee ici pour qu'il soit accessible partout
var applee;
var widtchInBlocks = canvasWidth / blocSkize;
var heightInBlocks = canvasHeight / blocSkize;
var timeout;

window.onload = function () {
  init();
};

function init() {
  var canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.border = "30px solid purple";
  canvas.style.margin = "50px auto";
  canvas.style.display = "block";
  canvas.style.backgroundColor = "#ddd";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");

  // Initialiser le serpent avec sa position et direction
  snakee = new snake(
    [
      [6, 4],
      [5, 4],
      [4, 4],
      [3, 4],
      [2, 4],
    ],
    "right"
  );
  applee = new Apple([10, 10]);
  score = 0;
  // Lancer la boucle de rafraîchissement du canvas
  refreshCanvas();
}

// Fonction qui actualise l'affichage du canvas
function refreshCanvas() {
  snakee.advance(); // Faire avancer le serpent
  if (snakee.checkCollision()) {
    gameOver();
  } else {
    if (snakee.isEatingApple(applee)) {
      snakee.eatApple = true;
      score++;
      do {
        applee.setNewPosition();
      } while (applee.isOnSnake(snakee));
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Effacer le canvas
    drawScore();
    snakee.draw(); // Dessiner le serpent
    applee.draw(); // dessiner la pomme
    timeout = setTimeout(refreshCanvas, delay); // Appeler la fonction de nouveau après un délai
  }
}

function gameOver() {
  ctx.save();

  // "Game Over" avec une police plus grande
  ctx.font = "bold 50px sans-serif"; // Augmentation de la taille de la police pour "Game Over"
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5; // Correction de la faute de frappe

  var centreX = canvasWidth / 2;
  var centreY = canvasHeight / 2;

  // Affichage du "Game Over" avec une grande taille
  ctx.strokeText("Game Over", centreX, centreY - 180);
  ctx.fillText("Game Over", centreX, centreY - 180);

  // Retour à une taille de police plus petite pour le texte suivant
  ctx.font = "bold 30px sans-serif"; // Taille de police pour le second texte
  ctx.strokeText(
    "Appuyez sur la touche ESPACE pour rejouer",
    centreX,
    centreY - 120
  );
  ctx.fillText(
    "Appuyez sur la touche ESPACE pour rejouer",
    centreX,
    centreY - 120
  );

  ctx.restore();
}

function restart() {
  snakee = new snake(
    [
      [6, 4],
      [5, 4],
      [4, 4],
      [3, 4],
      [2, 4],
    ],
    "right"
  );
  applee = new Apple([10, 10]);
  score = 0;
  clearTimeout(timeout);

  // Lancer la boucle de rafraîchissement du canvas
  refreshCanvas();
}
function drawScore() {
  ctx.save();
  ctx.font = "bold 200px sans-serif";
  ctx.fillStyle = "gray";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  var centreX = canvasWidth / 2;
  var centreY = canvasHeight / 2;
  ctx.fillText(score.toString(), centreX, centreY);
  ctx.restore();
}

// Fonction qui dessine chaque bloc du serpent
function drawBlock(ctx, position) {
  var x = position[0] * blocSkize;
  var y = position[1] * blocSkize;
  ctx.fillRect(x, y, blocSkize, blocSkize);
}

// Objet serpent avec sa logique
function snake(body, direction) {
  this.body = body;
  this.direction = direction;
  this.eatApple = false;

  // Dessiner le serpent
  this.draw = function () {
    ctx.save();
    ctx.fillStyle = "#ff0000"; // Couleur rouge pour le serpent
    for (var i = 0; i < this.body.length; i++) {
      drawBlock(ctx, this.body[i]);
    }
    ctx.restore();
  };

  // Faire avancer le serpent en fonction de la direction
  this.advance = function () {
    var nextPosition = this.body[0].slice(); // Créer une copie de la tête
    switch (this.direction) {
      case "left":
        nextPosition[0] -= 1;
        break;
      case "right":
        nextPosition[0] += 1;
        break;
      case "down":
        nextPosition[1] += 1;
        break;
      case "up":
        nextPosition[1] -= 1;
        break;
      default:
        throw "Invalid direction"; // Si une direction invalide est donnée
    }
    this.body.unshift(nextPosition); // Ajouter la nouvelle tête
    if (!this.eatApple) this.body.pop(); // Supprimer la queue
    else this.eatApple = false;
  };

  // Changer la direction du serpent
  this.setDirection = function (newDirection) {
    var allowedDirections;
    switch (this.direction) {
      case "left":
      case "right":
        allowedDirections = ["up", "down"];
        break;
      case "down":
      case "up":
        allowedDirections = ["left", "right"];
        break;
      default:
        throw "Invalid direction";
    }
    if (allowedDirections.indexOf(newDirection) > -1) {
      this.direction = newDirection; // Met à jour la direction si elle est valide
    }
  };
  this.checkCollision = function () {
    var wallCollision = false;
    var snakeCollision = false;
    var head = this.body[0];
    var rest = this.body.slice(1);
    var snakeX = head[0];
    var snakeY = head[1];
    var minX = 0;
    var minY = 0;
    var maxX = widtchInBlocks - 1;
    var maxY = heightInBlocks - 1;
    var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
    var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

    if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
      wallCollision = true;
    }

    for (var i = 0; i < rest.length; i++) {
      if (snakeX == rest[i][0] && snakeY == rest[i][1]) {
        snakeCollision = true;
      }
    }

    return wallCollision || snakeCollision;
  };
  this.isEatingApple = function (appleToEat) {
    var head = this.body[0];
    if (
      head[0] === appleToEat.position[0] &&
      head[1] === appleToEat.position[1]
    ) {
      return true;
    } else {
      return false;
    }
  };
}

function Apple(position) {
  this.position = position;
  this.draw = function () {
    ctx.save();
    ctx.fillStyle = "#33cc33";
    ctx.beginPath();
    var radius = blocSkize / 2;
    var x = this.position[0] * blocSkize + radius;
    var y = this.position[1] * blocSkize + radius;
    ctx.arc(x, y, radius, 0, Math.PI * 2); // Le dernier paramètre devrait être 2 * Math.PI pour un cercle complet
    ctx.fill(); // Remplir le cercle pour obtenir une pomme pleine
    ctx.restore();
  };
  this.setNewPosition = function () {
    do {
      var newX = Math.floor(Math.random() * widtchInBlocks);
      var newY = Math.floor(Math.random() * heightInBlocks);
      this.position = [newX, newY];
    } while (this.position[0] < 0 || this.position[1] < 0); // On vérifie que la position est valide
  };

  this.isOnSnake = function (snakeToCheck) {
    for (var i = 0; i < snakeToCheck.body.length; i++) {
      if (
        this.position[0] === snakeToCheck.body[i][0] &&
        this.position[1] === snakeToCheck.body[i][1]
      ) {
        return true; // Retourne true si la pomme est sur le serpent
      }
    }
    return false; // Retourne false si la pomme n'est pas sur le serpent
  };
}

// Écouteur de touche pour gérer les directions
document.onkeydown = function handleKeyDown(e) {
  var key = e.key;
  var newDirection;
  switch (key) {
    case "ArrowLeft":
      newDirection = "left";
      break;
    case "ArrowUp":
      newDirection = "up";
      break;
    case "ArrowRight":
      newDirection = "right";
      break;
    case "ArrowDown":
      newDirection = "down";
      break;
    case " ":
      restart();
      return;
    default:
      return; // Si ce n'est pas une touche fléchée, ne rien faire
  }
  snakee.setDirection(newDirection); // Met à jour la direction du serpent
};
