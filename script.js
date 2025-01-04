var canvasWidth = 900;
var canvasHeight = 600;
var blocSkize = 30;
var ctx;
var delay = 100;
var snakee; // Déclarer snakee ici pour qu'il soit accessible partout
var applee;

window.onload = function () {
  init();
};

function init() {
  var canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.border = "1px solid";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");

  // Initialiser le serpent avec sa position et direction
  snakee = new snake(
    [
      [6, 4],
      [5, 4],
      [4, 4],
    ],
    "right"
  );
  applee = new Apple([10, 10]);

  // Lancer la boucle de rafraîchissement du canvas
  refreshCanvas();
}

// Fonction qui actualise l'affichage du canvas
function refreshCanvas() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Effacer le canvas
  snakee.advance(); // Faire avancer le serpent
  snakee.draw(); // Dessiner le serpent
  applee.draw();
  setTimeout(refreshCanvas, delay); // Appeler la fonction de nouveau après un délai
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
    this.body.pop(); // Supprimer la queue
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
}

function Apple(position) {
  this.position = position;
  this.draw = function () {
    ctx.save();
    ctx.fillStyle = "#33cc33";
    ctx.beginPath();
    var radius = blocSkize / 2;
    var x = position[0] * blocSkize + radius;
    var y = position[1] * blocSkize + radius;
    ctx.arc(x, y, radius, 0, Math.PI * 2); // Le dernier paramètre devrait être 2 * Math.PI pour un cercle complet
    ctx.fill(); // Remplir le cercle pour obtenir une pomme pleine
    ctx.restore();
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
    default:
      return; // Si ce n'est pas une touche fléchée, ne rien faire
  }
  snakee.setDirection(newDirection); // Met à jour la direction du serpent
};
// 04/01/2025