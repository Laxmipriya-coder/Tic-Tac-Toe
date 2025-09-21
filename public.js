const boardEl = document.getElementById("board");
    const winnerDiv = document.getElementById("winner");
    const resetBtn = document.getElementById("reset");
    const twoPlayerBtn = document.getElementById("twoPlayer");
    const vsAIBtn = document.getElementById("vsAI");

    let cells = [];
    let currentPlayer = "X";
    let gameActive = true;
    let mode = "2p"; // "2p" or "ai"
    let scoreX = 0, scoreO = 0, scoreDraw = 0;

    function createBoard() {
      boardEl.innerHTML = "";
      cells = [];
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => handleClick(i));
        boardEl.appendChild(cell);
        cells.push(cell);
      }
    }

    function handleClick(i) {
      if (!gameActive || cells[i].textContent) return;
      cells[i].textContent = currentPlayer;
      cells[i].classList.add("taken");

      const winPattern = checkWinner();
      if (winPattern) {
        showWinner(currentPlayer, winPattern);
        gameActive = false;
        updateScore(currentPlayer);
      } else if (cells.every(c => c.textContent)) {
        showDraw();
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        if (mode === "ai" && currentPlayer === "O" && gameActive) {
          setTimeout(aiMove, 500);
        }
      }
    }

    function aiMove() {
      const emptyCells = cells
        .map((c, i) => (c.textContent ? null : i))
        .filter(i => i !== null);
      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      handleClick(randomIndex);
    }

    function checkWinner() {
      const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      for (let pattern of winPatterns) {
        const [a,b,c] = pattern;
        if (
          cells[a].textContent &&
          cells[a].textContent === cells[b].textContent &&
          cells[a].textContent === cells[c].textContent
        ) return pattern;
      }
      return null;
    }

    function showWinner(player, winPattern) {
      winnerDiv.innerHTML = `🎉 Winner: ${player} 🎉<br>
        <img src="Bunny.jpg">`;
      winPattern.forEach(i => cells[i].classList.add("winner"));
    }

    function showDraw() {
      winnerDiv.innerHTML = `😮 It's a Draw! <br>
        <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png">`;
      gameActive = false;
      scoreDraw++;
      updateScoreboard();
    }

    function resetGame() {
      currentPlayer = "X";
      gameActive = true;
      winnerDiv.innerHTML = "";
      createBoard();
    }

    function updateScore(player) {
      if (player === "X") scoreX++;
      else scoreO++;
      updateScoreboard();
    }

    function updateScoreboard() {
      document.getElementById("scoreX").textContent = scoreX;
      document.getElementById("scoreO").textContent = scoreO;
      document.getElementById("scoreDraw").textContent = scoreDraw;
    }

    // Mode switching
    twoPlayerBtn.addEventListener("click", () => {
      mode = "2p";
      twoPlayerBtn.classList.add("active");
      vsAIBtn.classList.remove("active");
      resetGame();
    });

    vsAIBtn.addEventListener("click", () => {
      mode = "ai";
      vsAIBtn.classList.add("active");
      twoPlayerBtn.classList.remove("active");
      resetGame();
    });

    resetBtn.addEventListener("click", resetGame);

    // Init
    createBoard();
    updateScoreboard();