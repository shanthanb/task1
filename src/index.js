import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Score(props) {
  if(props.over)
    return (
      <div className='score gameOver'>
        Game Over! Final Score: {props.score}
        <span className='highScore'>High Score: {props.highScore}</span>
        <button className="restartButton" onClick={props.handleRestart}>Restart</button>
      </div>
    );
  else
    return <div className='score'>Score: {props.score} <span className='highScore'>High Score: {props.highScore}</span></div>;
}

function Snake(props) {
  return <span className='snake' style={{left: props.y * 25 + 'px', top: props.x * 25 + 'px'}}></span>;
}

function Food(props) {
  return <span className='food' style={{left: props.y * 25 + 'px', top: props.x * 25 + 'px'}}></span>;
}

class Surface extends React.Component {
  genSnake() {
    let snake = [];
    for(let i = 0; i < this.props.snake.length; i++) {
      snake.push(<Snake key={i} x={this.props.snake[i][0]} y={this.props.snake[i][1]} />);
    }
    return snake;
  }
  render() {
    return <div id='Surface' style={{width: this.props.surface * 25, height: this.props.surface * 25}}>{this.genSnake()}<Food x={this.props.food[0]} y={this.props.food[1]} /></div>;    
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snake: [
        [5, 6],
        [5, 7],
        [5, 8],
      ],
      direction: 'left',
      food: [10, 10],
      keyEvent: false,
      highScore: 0,
    }
    this.restartGame = this.restartGame.bind(this);
    this.timeout = null;
  }

  componentDidMount() {
    this.initLoop();
  }

  initLoop() {
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    this.timeout = setTimeout(
      () => {this.moveSnake(this.state.direction)},
      75
    );
  }

  checkCollision() {
    let oldSnake = this.state.snake;
    let snakeHead = oldSnake[0];
    let food = this.state.food;
    let length = oldSnake.length;
    if(snakeHead[0] === food[0] && snakeHead[1] === food[1]) {
      this.increaseSnake();
      this.generateFood();
      return false;
    } else {
      for(let i = 1; i < length; i++) {
        if(snakeHead[0] === oldSnake[i][0] && snakeHead[1] === oldSnake[i][1])
          return true;
      }
      return false;
    }
  }

  moveSnake(direction) {
    let oldSnake = this.state.snake;
    let snakeHead = oldSnake[0];
    let size = this.props.size - 1;

    if(this.checkCollision()) {
      this.endGame();
    }
    switch(direction) {
      case 'left':
        if(snakeHead[1] === 0)
          oldSnake.unshift([snakeHead[0], size]);
        else
          oldSnake.unshift([snakeHead[0], snakeHead[1] - 1]);
          oldSnake.pop();
        break;
      case 'right':
        if(snakeHead[1] === size)
          oldSnake.unshift([snakeHead[0], 0]);
        else
          oldSnake.unshift([snakeHead[0], snakeHead[1] + 1]);
          oldSnake.pop();
        break;
      case 'up':
        if(snakeHead[0] === 0)
          oldSnake.unshift([size, snakeHead[1]]);
        else
          oldSnake.unshift([snakeHead[0] - 1, snakeHead[1]]);
          oldSnake.pop();
        break;
      case 'down':
        if(snakeHead[0] === size)
          oldSnake.unshift([0, snakeHead[1]]);
        else
          oldSnake.unshift([snakeHead[0] + 1, snakeHead[1]]);
          oldSnake.pop();
        break;
      default:
        return;
    }
    this.setState({
      snake: oldSnake,
      keyEvent: false,
    });
    setTimeout(
      () => {this.moveSnake(this.state.direction)},
      75
    );
  }

  handleKeyPress(e) {
    let keycode = e.keyCode;
    let direction = this.state.direction;
    if(this.state.keyEvent || direction === '')
      return;
    switch(keycode) {
      case 37: //left
        if(direction === 'left' || direction === 'right')
          break;
        this.setState({
          direction: 'left',
          keyEvent: true,
        });
        break;
      case 39: //right
        if(direction === 'left' || direction === 'right')
          break;
        this.setState({
          direction: 'right',
          keyEvent: true,
        });
       break;
      case 38: //up
        if(direction === 'up' || direction === 'down')
          break;
        this.setState({
          direction: 'up',
          keyEvent: true,
        });
        break;
      case 40: //down
        if(direction === 'up' || direction === 'down')
          break;
        this.setState({
          direction: 'down',
          keyEvent: true,
        });
        break;
      default:
        //do nothing
    }
  }

  generateFood() {
    let snake = this.state.snake;
    let x = Math.floor(Math.random() * (this.props.size - 1)) + 1;
    let y = Math.floor(Math.random() * (this.props.size - 1)) + 1;
    let collision = false;
    do {
      collision = false;
      for(let i = 0; i<snake.length; i++) {
        if(snake[i][0] === x && snake[i][1] === y) {
          x = Math.floor(Math.random() * (this.props.size - 1)) + 1;
          y = Math.floor(Math.random() * (this.props.size - 1)) + 1;
          collision = true;
          continue;
        }
      }
    } while(collision);
    this.setState({
      food: [x, y],
    });
  }

  increaseSnake() {
    let oldSnake = this.state.snake;
    let highScore = this.state.highScore;
    oldSnake.push(oldSnake[oldSnake.length - 1]);
    if(highScore < oldSnake.length - 3) {
      this.setState({
        snake: oldSnake,
        highScore: oldSnake.length - 3,
      });      
    } else {
      this.setState({
        snake: oldSnake,
      });
    }
  }

  endGame() {
    this.setState({
      direction: '',
    });
  }

  restartGame() {
    this.setState({
      snake: [
        [5, 6],
        [5, 7],
        [5, 8],
      ],
      direction: 'left',
      food: [10, 10],
      keyEvent: false,
    });
    this.initLoop();
  }

  render() {
    let snake = this.state.snake;
    if(this.state.direction === '') {
      clearTimeout(this.timeout);
      return <div><Score score={snake.length - 3} highScore={this.state.highScore} over={true} handleRestart={this.restartGame} /></div>;
    }
    return <div><Score score={snake.length - 3} highScore={this.state.highScore} over={false} /><Surface food={this.state.food} snake={snake} surface={this.props.size} /></div>;

  }
}

ReactDOM.render(
  <Game size='20' />,
  document.getElementById('Game')
);
