document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let upTimerID;
  let downTimerID;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerID;
  let rightTimerID;
  let score = 0;
  let leftBlueTimerID;
  let rightBlueTimerID;
  let blueIsGoingLeft = false;
  let blueIsGoingRight = false;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBottomSpace + 'px';
  }

  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement('div');

      const visual = this.visual;
      visual.classList.add('platform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for(let i = 0; i < platformCount; i++) {
      let platformGap = 600 / platformCount;
      let newPlatformBottom = 100 + i * platformGap;
      let newPlatform = new Platform(newPlatformBottom);
      platforms.push(newPlatform);
    }
  }

  function movePlatforms() {
    if(doodlerBottomSpace > 200) {
      platforms.forEach(platform => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + 'px';

        if(platform.bottom < 10) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove('platform');
          platforms.shift();
          score++;
          // console.log(platforms);
          let newPlatform = new Platform(600);
          if(score > 2) {
            bluePlatform(newPlatform);
          }
          platforms.push(newPlatform);
        }
      })
    }
  }

  function bluePlatform(platform) {
    platform.visual.style.backgroundColor = 'blue';
    blueMoveLeft(platform);
    blueMoveRight(platform);
  }

  function blueMoveLeft(platform) {
    if(blueIsGoingRight) {
      clearInterval(blueRightTimerID);
      blueIsGoingRight = false;
    }
    blueIsGoingLeft = true;
    blueLeftTimerID = setInterval(function() {
      if(platform.left > 0) {
        platform.left -= 5;
        platform.visual.style.left = platform.left + 'px';
      } else blueMoveRight(platform);
    }, 20)
  }

  function blueMoveRight(platform) {
    if(blueIsGoingLeft) {
      clearInterval(blueLeftTimerID);
      blueIsGoingLeft = false;
    }
    blueIsGoingRight = true;
    blueRightTimerID = setInterval(function() {
      if(platform.left < 340) {
        platform.left += 5;
        platform.visual.style.left = platform.left + 'px';
      } else blueMoveLeft(platform);
    }, 20)
  }

  function jump() {
    clearInterval(downTimerID);
    isJumping = true;
    upTimerID = setInterval(function() {
      doodlerBottomSpace += 20;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if(doodlerBottomSpace > startPoint + 200) {
        fall();
      }
    }, 30)
  }

  function fall() {
    clearInterval(upTimerID);
    isJumping = false;
    downTimerID = setInterval(function() {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if(doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach(platform => {
        if(
          doodlerBottomSpace >= platform.bottom && 
          doodlerBottomSpace <= platform.bottom + 15 && 
          doodlerLeftSpace + 60 >= platform.left && 
          doodlerLeftSpace <= platform.left + 85 && 
          !isJumping
          ) {
          // console.log('Landed');
          startPoint = doodlerBottomSpace;
          jump();
        }
      })
    }, 30)
  }

  function gameOver() {
    console.log('Game Over');
    isGameOver = true;
    document.removeEventListener('keydown', control);
    document.removeEventListener('keydown', stopMoving);
    while(grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerID);
    clearInterval(downTimerID);
    clearInterval(leftTimerID);
    clearInterval(rightTimerID);
  }

  function control(e) {
    if(e.key === 'ArrowLeft') {
      moveLeft();
    } else if(e.key === 'ArrowRight') {
      moveRight();
    } else if(e.key === 'ArrowUp') {
      stopMoving();
    }
  }

  function moveLeft() {
    if(isGoingRight) {
      clearInterval(rightTimerID);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerID = setInterval(function() {
      if(doodlerLeftSpace > 0) {
        console.log('Going left: ' + doodlerLeftSpace)
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else moveRight();
    }, 20)
  }

  function moveRight() {
    if(isGoingLeft) {
      clearInterval(leftTimerID);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerID = setInterval(function() {
      if(doodlerLeftSpace < 340) {
        console.log('Going right: ' + doodlerLeftSpace)
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else moveLeft();
    }, 20)
  }

  function stopMoving() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerID);
    clearInterval(rightTimerID);
  }

  function start() {
    if(!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener('keydown', control);
      document.addEventListener('keyup', stopMoving);
    }
  }
  start();
});
