import React, { Component } from 'react';
import Sound from 'react-sound';
import './Game.css';
import './helpers.css';
import {select_sound, randomNumber} from './helpers.js';
import Timer from './Timer.js';
import lives from './img/lives.png'

import sounds from './sounds.js';

var FontAwesome = require('react-fontawesome');

const SECONDS = 60;

class Game extends Component {
    constructor(props){
        super(props);

        this.state = {
            // is game on?
            playing: false,

            // time
            seconds: SECONDS,
            timerRun: false,

            // voices
            voices: true,

            // sounds
            sounds: true,
            soundStatus: 'stop',
            soundName: '',

            // numbers and mark
            number_One: '',
            number_Two: '',
            mark: '',
            sums: '',

            // display
            display: true,

            // score
            score: 0,

            // value input
            inputValue: '',
            numberValue: 0,

            // disabled input
            disabled: false,

            // lives for game
            lives: 3
        };

        this.turnVoices = this.turnVoices.bind(this);
        this.turnSound = this.turnSound.bind(this);

        this.controlDisplay = this.controlDisplay.bind(this);

        this.setTime = this.setTime.bind(this);

        // handle time update from timer
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);

        // handle keys
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // new game function
        this.newGame = this.newGame.bind(this);
        this.handleFinishedPlaying = this.handleFinishedPlaying.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    addEventListener () {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    removeEventListeners () {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }

    componentDidMount() {
        this.newGame();

        // add key listener
        this.addEventListener();
    }

    componentWillUnmount() {
        // remove key listener
        this.removeEventListeners();
    }

    // turn voices off/on
    turnVoices() {
        this.setState({
            voices: !this.state.voices
        }, () => !this.state.voices ? window.responsiveVoice.cancel() : window.responsiveVoice.speak(" ", "Czech Female"));

        this.buttonVoices.blur();
    }

    // turn sounds off/on
    turnSound() {
        this.setState({
            sounds: !this.state.sounds
        });       

        this.buttonSounds.blur();
    }

    // display controls - blind mode
    controlDisplay() {
        this.setState({
            display: !this.state.display
        });

        this.buttonDisplay.blur();
    }

    // timer update - to (in/de)crease actual time by specified time (seconds)
    setTime(currentTime, sec) {
        if (this.state.playing) {
            if ((currentTime + sec) > 60) {
                return 60;
            } else if ((currentTime - sec) < 0) {
                return 0;
            } else {
                return currentTime + sec;
            }
        } else {
            return 60;
        }
    }

    // handle keyDown - move player by 'Arrow keys', 'Alt' to read possible directions
    handleKeyDown(e) {
        if (!this.state.playing || !this.state.timerRun) {
            if (e.keyCode === 82) {
                e.preventDefault(); // cancel focus event from turn voices button
                this.newGame();
            } else {
                return;
            }
        }

        switch (e.keyCode) {
            case 18: // alt
                e.preventDefault();
                if (!this.state.voices) return;
                this.readerExam();
                break;

            case 13:
                if(e.keyCode === 13) {
                    e.preventDefault();
                    this.sumsNumber();
                    this.compareSums();

                }
                break;
            default:
                break;
        }
    }

    // random generate number
    generateRandomNumber() {
       let number1 = randomNumber(1, 100);
       let number2 =  randomNumber(1, 100);
       let numberMark = randomNumber(0,4);
       let primeNumbers = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
       let primeNumber1 = primeNumbers.includes(number1);
       let primeNumber2 = primeNumbers.includes(number2);

       if (numberMark === 1 && number1 < number2) {
          return this.generateRandomNumber();
       }

       if (numberMark === 3 && Number.isInteger(number1/number2) === false || number1 > number2 || primeNumber1 === true || primeNumber2 === true) {
           return this.generateRandomNumber();
       }

       if ((number1 + number2) > 100 || (number1*number2) > 100) {
           return this.generateRandomNumber();
       }

       let mark;
       let markStr;
       switch (numberMark) {
           case 0:
               mark = '+';
               markStr = 'plus';
               break;

           case 1:
               mark = '-';
               markStr = 'mínus';
               break;

           case 2:
               mark = '*';
               markStr = 'krát';
               break;

           case 3:
               mark = '/';
               markStr = 'děleno';
               break;

           default:
               break;
       }

        this.setState({
            number_One: number1,
            number_Two: number2,
            mark: mark,
            timerRun: false,
        });

        /*window.responsiveVoice.speak("Tvůj příklad je " + number1 + ' ' + markStr + ' ' + number2, "Czech Female",{onend: this.onEnd});*/

    }

    readerExam () {
        let number1 = this.state.number_One;
        let number2 = this.state.number_Two;
        let mark = this.state.mark;
        let markStr;

        switch (mark) {
            case '+':
                markStr = 'plus';
                break;

            case '-':
                markStr = 'mínus';
                break;

            case '*':
                markStr = 'krát';
                break;

            case '/':
                markStr = 'děleno';
                break;

            default:
                break;
        }
        window.responsiveVoice.speak("Tvůj příklad je " + number1 + ' ' + markStr + ' ' + number2, "Czech Female");

    }

    // sums number
    sumsNumber () {
        let number1 = this.state.number_One;
        let number2 = this.state.number_Two;
        let mark = this.state.mark;
        let sums;

        switch (mark) {
            case '+':
                sums = number1 + number2;
                break;

            case '-':
                sums = number1 - number2;
                break;

            case '*':
                sums = number1 * number2;
                break;

            case '/':
                sums = number1 / number2;
                break;

            default:
                break;
        }

        this.setState({
            sums: sums,
        });
    }

    // compare my sums with correct sums
    compareSums () {
        let myValue = this.state.inputValue;
        let myValueNumber = parseInt(myValue);
        let correctResult = this.state.sums;
        let newScore = 5;
        let last = this.state.sums;
        if(myValueNumber === correctResult) {
            this.setState({
                soundStatus: 'play',
                soundName: 'success',
                score: this.state.score + newScore,
                sums: '',
                inputValue: '',
            });
        } else {
            this.setState({
                soundStatus: 'play',
                soundName: 'failure',
                sums: '',
                inputValue: '',
                lives: this.state.lives -1,
                timerRun: false,
                last: last
            });
        }

        if (this.state.lives > 0) {
            this.generateRandomNumber();
            let number1 = this.state.number_One;
            let number2 = this.state.number_Two;
            let mark = this.state.mark;
            let markStr;
            let lastStr;
            if (this.state.soundName === 'failure') {
                lastStr = " Správný výsledek byl " + last;
            } else {
                lastStr = '';
            }

            switch (mark) {
                case '+':
                    markStr = 'plus';
                    break;

                case '-':
                    markStr = 'mínus';
                    break;

                case '*':
                    markStr = 'krát';
                    break;

                case '/':
                    markStr = 'děleno';
                    break;

                default:
                    break;
            }
            window.responsiveVoice.speak(lastStr+ " Nový příklad je " + number1 + ' ' + markStr + ' ' + number2, "Czech Female", {onend: this.onEnd});
        }

        if (this.state.lives === 0) {
            this.setState({
                disabled:true,
                timerRun: false,
                playing: false,
            });
            window.responsiveVoice.speak("Došli ti životy nahrál jsi " + this.state.score + " bodů", "Czech Female");
        }
    }

    // handle keyUp
    handleKeyUp(e) {
        if (!this.state.playing) return;
    }

    // handle finish sound playing
    handleFinishedPlaying() {
        this.setState({
            soundStatus: 'stop'
        });
    }

    onEnd() {
        this.setState({
            timerRun: true
        });
    }

    // init new game
    newGame() {
        window.clearTimeout(this.startGameTimer);
        this.generateRandomNumber();

        this.setState({
            playing: false,
            seconds: SECONDS,
            lives: 3,
            disabled: false,
            timerRun: false,
            score: 0
        }, () => {
            this.setState({
                playing: true,
                timerRun: true
            });
            this.readerExam();

            this.buttonRefresh.blur();
        });
    }

    // handle time update
    handleTimeUpdate(seconds) {
        this.setState({
            seconds
        });

        if (seconds === 3) {
            this.setState({
                soundStatus: 'play',
                soundName: 'tick',
            });
        } else if (seconds === 0 || seconds < 0) {
            this.setState({
                playing: false,
                timerRun: false,
                disabled: true
            });
            
            window.responsiveVoice.speak("Konec hry " + this.state.score + " bodů", "Czech Female");
        }
    }

    render() {
        const {
            playing,
            timerRun,
            seconds,
            display,
            sounds: stateSounds,
            voices
        } = this.state;

        let iconVoices = voices ? <FontAwesome name='toggle-on' size='2x' /> : <FontAwesome name='toggle-off' size='2x' />;
        let iconSounds = stateSounds ? <FontAwesome name='volume-up' size='2x' /> : <FontAwesome name='volume-off' size='2x' />;
        let iconDisplay = display ? <FontAwesome name='eye-slash' size='4x' /> : <FontAwesome name='eye' size='4x' />;

        return (
            <div className="Game">
                <header>
                    {/* <h1>ProjectName<span>Easy</span></h1> */}

                    <div className="options">
                        <button onClick={this.newGame} ref={(buttonRefresh) => { this.buttonRefresh = buttonRefresh; }}>
                            <FontAwesome name='refresh' size='2x' />
                        </button>

                        <button onClick={this.turnSound} ref={(buttonSounds) => { this.buttonSounds = buttonSounds; }}>
                            {iconSounds}
                        </button>

                        <button className="speech-btn" onClick={this.turnVoices} ref={(buttonVoices) => { this.buttonVoices = buttonVoices; }}>
                            {iconVoices}
                            <span>číst</span>
                        </button>
                    </div>
                    <div className="lives">
                        {this.state.lives}
                        <span> <img src={lives} alt="heart"/></span>
                    </div>
                </header>

                <div className={display ? 'Playground__area' : 'Playground__area blur'}>

                    <div className="example-wrapper">
                        <p className="example number-one"> {this.state.number_One} </p>
                        <p className="mark example"> {this.state.mark} </p>
                        <p className="example number-two"> {this.state.number_Two} </p>
                        <p className="equals example"> = </p>
                        <p className="sums example"> {this.state.sums} </p>
                    </div>

                    <form>
                        <input id="myAnswer" type="number"
                               disabled={this.state.disabled}
                               autoFocus="autoFocus"
                               autoComplete="off"
                               onChange={(e) => { this.setState({inputValue:e.target.value}) }}
                               value={this.state.inputValue}
                               ref={(input) => this.input = input}
                        />
                    </form>

                    {
                        !this.state.display
                            ? <div className="overlay"/>
                            : null
                    }

                </div>

                <div className="options options-display">
                    <button onClick={this.controlDisplay} ref={(buttonDisplay) => this.buttonDisplay = buttonDisplay}>
                        {iconDisplay}
                    </button>
                </div>

                {
                    playing && seconds > 0
                    ? <Timer status={timerRun} duration={seconds} timeCallback={this.handleTimeUpdate} />
                    : null
                }

                {
                    !this.state.sounds || this.state.soundStatus !== 'play'
                    ? null
                    : (
                        <Sound
                            url={select_sound(sounds, this.state.soundName).url}
                            playStatus={'PLAYING'}
                            volume={100}
                            onFinishedPlaying={this.handleFinishedPlaying}
                        />
                    )
                }

                <div className="score">
                    {this.state.score}
                    <span> points</span>
                </div>

                <footer>
                    {/* Powered by <a href="http://evalue.cz/">eValue.cz</a> */}
                </footer>
            </div>
        );
    }
}

export default Game;