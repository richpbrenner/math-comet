import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


function Submit(props) {
  return (
    <div className="Submit">{props.message}</div>
  );
}

function DifficultyButton(props) {
  let classes = "SettingsButton";
  if (!props.isActive) {
  classes += " Inactive"
  } else {
    if (props.isSelected) {
    classes += " Selected"
  }
  }
  return (
    <button className={classes} onClick={props.onClick}>{props.difficulty}</button>
  );
}

function OperationButton(props) {
  let classes = "SettingsButton";
  if (props.isActive) {
    classes += " Selected"
  }
  return (
    <button className={classes} onClick={props.onClick}>{props.operationName}</button>
  );
}

function RestoreDefaultButton(props) {
  return (
    <button className="SettingsButton Selected" onClick={props.onClick}>Restore Default Settings</button>
  );
}

function RadixButton(props) {
  let classes = "SettingsButton";
  if (props.isActive) {
    classes += " Selected"
  }
  return (
    <button className={classes} onClick={props.onClick}>{props.radixName}</button>
  );
}

function AdvancedOptionsButton(props) {
  let text = "Show Advanced Options";
  if (props.isActive) {
    text = "Hide Advanced Options"
  } 
  return (
    <button className="SettingsButton Selected" onClick={props.onClick}>{text}</button>
  );
}

function FeedbackIcon(props) {
  let classes = "material-icons FeedbackIcon"
  if (props.icon === "done") {
    classes += " FeedbackIcon-Blue";
  } else {
    classes += " FeedbackIcon-Grey";
  }
  if (props.visible) {
    classes += " FadeOut";
  } 
  return (
    <i className={classes}>{props.icon}</i>
  );
}

function SettingRow(props) {
  let yesButton;
  let noButton;
  if (props.isActive) {
    yesButton = <button className="SettingsButton Selected">Yes</button>;
    noButton = <button className="SettingsButton" onClick={props.onClick}>No</button>;
    }
  else {
    yesButton = <button className="SettingsButton" onClick={props.onClick}>Yes</button>
    noButton = <button className="SettingsButton Selected">No</button>
  }
  
  return (
      <div className="SettingsRow">
        <div className="SettingsTitle">{props.title}</div>
        {yesButton}
        {noButton}
      </div> 
  );
} 

function Footer(props) {
  return (
    <footer className="Footer">
    &copy; Copyright 2016-17 Rich P. Brenner | Built with React
    </footer>
  );
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {firstFactor: Math.round(Math.random()*10) + 1, 
      secondFactor: Math.round(Math.random()*10) + 1,
      showCorrect: false,
      showIncorrect: false,
      currentOperationId: 0, 
      userAnswer: "", streak: 0, 
      //operation order: addition, subtraction, multiplication, division
      allowedOperations : [true, true, true, true],
      //0 = easy, 1 = medium, 2 = hard
      operationDifficulty : [1, 1, 0, 0],
      //radix order: decimal, binary, octal, hexadecimal
      allowedRadices: [true, false, false, false],
      firstFactorRadixId: 0,
      secondFactorRadixId: 0,
      answerRadixId: 0,
      allowDifferentFactorRadix: false,
      allowDifferentAnswerRadix: false,
      showAdvancedOptions: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  restoreDefault = () => {
    this.setState({allowedOperations: [true, true, true, true],
      operationDifficulty: [1, 1, 0, 0],
      allowedRadices: [true, false, false, false],
      allowDifferentFactorRadix: false,
      allowDifferentAnswerRadix: false,
    })
  }

  resetIcons = () => {
    setTimeout(() => {this.setState({showCorrect: false,
      showIncorrect: false})}, 500);
  }  

  checkAnswer = () => {
    let correctAnswer;
    switch(this.state.currentOperationId) {
      case 0:
        correctAnswer = this.state.firstFactor + this.state.secondFactor;
        break;
      case 1:
        correctAnswer = this.state.firstFactor - this.state.secondFactor;
        break;
      case 2:
        correctAnswer = this.state.firstFactor * this.state.secondFactor;
        break;
      case 3:
        correctAnswer = this.state.firstFactor / this.state.secondFactor;
        break;
    }
    //parseInt(value, base)
    const radix = [10, 2, 8, 16][this.state.answerRadixId];
    const parsedAnswer = parseInt(this.state.userAnswer, radix);

    if (parsedAnswer === correctAnswer) {
      this.setState(prevState => ({streak: prevState.streak + 1,
        showIncorrect: false, showCorrect: true}));
    } 
    else {
      this.setState({streak: 0, showIncorrect: true,
        showCorrect: false});
    }
    this.chooseOperation();
    this.resetIcons();
  }

  chooseRadixId = () => {
    //Returns a random radixId from allowed Ids
    const radices = this.state.allowedRadices;
    let radixIndices = [];
    for (let i = 0; i < radices.length; i++) {
      if(radices[i]) {
        radixIndices.push(i)
      }
    }
    return (radixIndices[Math.floor(Math.random()*radixIndices.length)]);
  }

  chooseAllRadices = () => {
    let firstFactorRadixId;
    let secondFactorRadixId;
    let answerRadixId;
    const allowDifferentFactorRadix = this.state.allowDifferentFactorRadix;
    const allowDifferentAnswerRadix = this.state.allowDifferentAnswerRadix;

    if (!allowDifferentFactorRadix && !allowDifferentAnswerRadix) {
      const radixId = this.chooseRadixId();
      firstFactorRadixId = radixId;
      secondFactorRadixId = radixId;
      answerRadixId = radixId;
    } else if (!allowDifferentFactorRadix && allowDifferentAnswerRadix) {
      const radixId = this.chooseRadixId();
      firstFactorRadixId = radixId;
      secondFactorRadixId = radixId;
      answerRadixId = this.chooseRadixId();
    } else if (allowDifferentFactorRadix && !allowDifferentAnswerRadix) {
      const radixId = this.chooseRadixId();
      firstFactorRadixId = radixId;
      secondFactorRadixId = this.chooseRadixId();
      answerRadixId = radixId;
    } else {
      firstFactorRadixId = this.chooseRadixId();
      secondFactorRadixId = this.chooseRadixId();
      answerRadixId = this.chooseRadixId();
    }

    return ([firstFactorRadixId, secondFactorRadixId, answerRadixId]);
  }

  chooseOperation = () => {
    //choose random element from array of allowed operation indices 
    const operations = this.state.allowedOperations;
    let operationIndices = [];
    for (let i = 0; i < operations.length; i++) {
      if(operations[i]) {
        operationIndices.push(i)
      }
    }
    const operationId = operationIndices[Math.floor(Math.random()*operationIndices.length)];    

    let operationMethod;
    switch(operationId) {
      case 0:
        operationMethod = this.generateAddition;
        break;
      case 1:
        operationMethod = this.generateSubtraction;
        break;
      case 2:
        operationMethod = this.generateMultiplication;
        break;
      case 3:
        operationMethod = this.generateDivision;
        break;
    }

    const radixArray = this.chooseAllRadices();

    this.setState({
      currentOperationId: operationId,
      firstFactorRadixId: radixArray[0],
      secondFactorRadixId: radixArray[1],
      answerRadixId: radixArray[2],
    });

    operationMethod();
  }

  generateAddition = () => {
    const upperBound = Math.pow(10, this.state.operationDifficulty[0] + 1) + 10;
    this.setState({
      firstFactor: Math.round(Math.random()*upperBound) + 1,
      secondFactor: Math.round(Math.random()*upperBound) + 1,
      userAnswer: ""
    });
  }

  generateSubtraction = () => {
    const upperBound = Math.pow(10, this.state.operationDifficulty[1] + 1) + 10;
    const minuend = Math.round(Math.random()*upperBound) + 1;
    const subtrahend = Math.floor(Math.random()*minuend);
    this.setState({
      firstFactor: minuend,
      secondFactor: subtrahend,
      userAnswer: ""
    });
  }

  generateMultiplication = () => {
    const upperBound = Math.pow(10, this.state.operationDifficulty[2]) + 10;
    this.setState({
      firstFactor: Math.round(Math.random()*upperBound) + 1,
      secondFactor: Math.round(Math.random()*upperBound) + 1,
      userAnswer: ""
    });
  }  

  generateDivision = () => {
    const upperBound = this.state.operationDifficulty[3]*10 + 10;
    const quotient = Math.round(Math.random()*upperBound) + 2;
    const divisor = Math.round(Math.random()*upperBound) + 2;
    const dividend = quotient * divisor;
    this.setState({
      firstFactor: dividend,
      secondFactor: divisor,
      userAnswer: ""
    });
  }

  handleChange(e) {
    this.setState({userAnswer: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.checkAnswer();
  }

  changeDifficulty = (index, value) => {
    let newOperationDifficulty = this.state.operationDifficulty.slice();
    newOperationDifficulty[index] = value;
    this.setState({
      operationDifficulty: newOperationDifficulty
    })
  }
  
  //can we use destructuring to generalize "toggle state boolean"
  toggleAdvancedOptions = () => {
    this.setState(prevState => ({showAdvancedOptions: !prevState.showAdvancedOptions}));
  }  

  toggleAllowDifferentFactorRadix = () => {
    this.setState(prevState => ({allowDifferentFactorRadix: !prevState.allowDifferentFactorRadix}));
  }

  toggleAllowDifferentAnswerRadix = () => {
    this.setState(prevState => ({allowDifferentAnswerRadix: !prevState.allowDifferentAnswerRadix}));
  }

  changeOperation = (index) => {
    let newAllowedOperations = this.state.allowedOperations.slice();
    //if the operation being toggled, is the only true value in the array, 
    //prevent the change and alert user
    if (newAllowedOperations.filter(value => value).length === 1 && newAllowedOperations[index]) {
      alert('You must have at least one operation selected!');
    }
    else {      
      newAllowedOperations[index] = !newAllowedOperations[index];
      this.setState({
        allowedOperations: newAllowedOperations
      })
    }
  }  

  changeRadix = (index) => {
    let newAllowedRadices = this.state.allowedRadices.slice();
    if (newAllowedRadices.filter(value => value).length === 1 && newAllowedRadices[index]) {
      alert('You must have at least one operation selected!');
    }
    else {      
      newAllowedRadices[index] = !newAllowedRadices[index];
      this.setState({
        allowedRadices: newAllowedRadices
      })
    }
  }

  render() {
    //convert factors to correct radix before rendering
    //base 10 is default and isn't rendered as subscript in html
    const radices = [{radix: 10, representation: ""}, {radix: 2, representation: "2"}, 
      {radix: 8, representation: "8"}, {radix: 16, representation: "16"}];
    const firstFactorRadix = radices[this.state.firstFactorRadixId];
    const secondFactorRadix = radices[this.state.secondFactorRadixId];
    const answerRadix = radices[this.state.answerRadixId];

    const firstFactorConverted = this.state.firstFactor.toString(firstFactorRadix.radix);
    const secondFactorConverted = this.state.secondFactor.toString(secondFactorRadix.radix);

    const operationSymbol = [" + ", " - ", " x ", " / "][this.state.currentOperationId];
    const expression = firstFactorConverted + " " + operationSymbol + secondFactorConverted;
    const operations = ["Addition", "Subtraction", "Multiplication", "Division"];
    const radixNames = ["Decimal", "Binary", "Octal", "Hexadecimal"];

    let advancedOptions;
    if (this.state.showAdvancedOptions) {    
    advancedOptions = (<div className="AdvancedOptions"> 
      <AdvancedOptionsButton isActive={this.state.showAdvancedOptions} onClick={() => this.toggleAdvancedOptions()} />
        <div className="SettingsDescription">Select bases</div>
        <div className="ButtonRow">
        {this.state.allowedRadices.map((value, index) =>
            <RadixButton radixName={radixNames[index]} isActive={value} onClick={() => this.changeRadix(index)} />
          )}
        </div>
        <SettingRow title="Factors in problem can have different bases" isActive={this.state.allowDifferentFactorRadix} onClick={() => this.toggleAllowDifferentFactorRadix()} />
        <SettingRow title="Answer can have different base than factors" isActive={this.state.allowDifferentAnswerRadix} onClick={() => this.toggleAllowDifferentAnswerRadix()} />
        <RestoreDefaultButton onClick={() => this.restoreDefault()} />
    </div>); } 
    else {
      advancedOptions = (<div className="AdvancedOptions"> 
      <AdvancedOptionsButton isActive={this.state.showAdvancedOptions} onClick={() => this.toggleAdvancedOptions()} />
      </div>); 
    } 

    return (
      <div className="App">
        <div className="Expression">{firstFactorConverted}<sub>{firstFactorRadix.representation}</sub>{" " + operationSymbol + " " + secondFactorConverted}
          <sub>{secondFactorRadix.representation}</sub>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="FormRow">
          <FeedbackIcon icon={"clear"} visible={this.state.showIncorrect} />
          <input 
            className="UserText"
            type="text"
            value={this.state.userAnswer}
            onChange={this.handleChange}
             />
             <sub>{answerRadix.representation}</sub>
          <FeedbackIcon icon={"done"} visible={this.state.showCorrect} />
           </div>
        </form>
        <div className="Streak"> Streak: {this.state.streak}</div>
        <div className="Settings">
          <div className="UserSettingsContainer">
            <div className="OperationButtonContainer">
              <div className="SettingsDescription">Select operations</div>
              {this.state.allowedOperations.map((value, index) =>
                  <OperationButton operationName={operations[index]} isActive={value} onClick={() => this.changeOperation(index)} />
                )}
            </div>
            <div className="DifficultyButtonContainer">
              <div className="SettingsDescription">Select problem difficulty</div>
            {this.state.operationDifficulty.map((value, index) =>
              <div className="ButtonRow">
                <DifficultyButton difficulty="Easy" isSelected={value===0} isActive={this.state.allowedOperations[index]} onClick={() => this.changeDifficulty(index, 0)} />
                <DifficultyButton difficulty="Medium" isSelected={value===1} isActive={this.state.allowedOperations[index]} onClick={() => this.changeDifficulty(index, 1)} />
                <DifficultyButton difficulty="Hard" isSelected={value===2} isActive={this.state.allowedOperations[index]} onClick={() => this.changeDifficulty(index, 2)} />
              </div>
              )
            }
            </div>
          </div>
          {advancedOptions}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
