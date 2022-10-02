import { useState, useEffect, useCallback } from 'react';

import { ScoreBoard } from './ScoreBoard';

import blank from '../images/blank.png';
import blueCandy from '../images/blue-candy.png';
import greenCandy from '../images/green-candy.png';
import orangeCandy from '../images/orange-candy.png';
import purpleCandy from '../images/purple-candy.png';
import redCandy from '../images/red-candy.png';
import yellowCandy from '../images/yellow-candy.png';

const WIDTH = 8;
const CANDY_COLORS = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
];

export const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const checkForColumnOfFour = useCallback(() => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + WIDTH, i + WIDTH * 2, i + WIDTH * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (
        columnOfFour.every(
          square => currentColorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay(score => score + 4);
        columnOfFour.forEach(
          square => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  }, [currentColorArrangement]);

  const checkForRowOfFour = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];

      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every(
          square => currentColorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay(score => score + 4);
        rowOfFour.forEach(square => (currentColorArrangement[square] = blank));
        return true;
      }
    }
  }, [currentColorArrangement]);

  const checkForColumnOfThree = useCallback(() => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + WIDTH, i + WIDTH * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (
        columnOfThree.every(
          square => currentColorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay(score => score + 3);
        columnOfThree.forEach(
          square => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  }, [currentColorArrangement]);

  const checkForRowOfThree = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];

      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every(
          square => currentColorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay(score => score + 3);
        rowOfThree.forEach(square => (currentColorArrangement[square] = blank));
        return true;
      }
    }
  }, [currentColorArrangement]);

  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * CANDY_COLORS.length);
        currentColorArrangement[i] = CANDY_COLORS[randomNumber];
      }

      if (currentColorArrangement[i + WIDTH] === blank) {
        currentColorArrangement[i + WIDTH] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  }, [currentColorArrangement]);

  const dragStart = e => {
    setSquareBeingDragged(e.target);
  };

  const dragDrop = e => {
    setSquareBeingReplaced(e.target);
  };

  const dragEnd = e => {
    const squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute('data-id')
    );
    const squareBeingDraggedId = parseInt(
      squareBeingDragged.getAttribute('data-id')
    );

    currentColorArrangement[squareBeingReplacedId] =
      squareBeingDragged.getAttribute('src');
    currentColorArrangement[squareBeingDraggedId] =
      squareBeingReplaced.getAttribute('src');

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - WIDTH,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + WIDTH,
    ];

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfFour = checkForRowOfFour();
    const isARowOfThree = checkForRowOfThree();

    if (
      squareBeingReplacedId &&
      validMove &&
      (isAColumnOfFour || isAColumnOfThree || isARowOfFour || isARowOfThree)
    ) {
      setSquareBeingReplaced(null);
      setSquareBeingDragged(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] =
        squareBeingReplaced.getAttribute('src');
      currentColorArrangement[squareBeingDraggedId] =
        squareBeingDragged.getAttribute('src');
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  };

  const createBoard = () => {
    const randomColorArrangement = [];

    for (let i = 0; i < WIDTH * WIDTH; i++) {
      const randomColor =
        CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 300);
    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArrangement,
  ]);

  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            size={5}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={e => e.preventDefault()}
            onDragEnter={e => e.preventDefault()}
            onDragLeave={e => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
};
