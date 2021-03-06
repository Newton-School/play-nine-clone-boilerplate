import React, { Component } from 'react';
import _ from 'lodash';
import '@fortawesome/react-fontawesome';
import '../styles/App.css';
//import 'font-awesome/css/font-awesome.min.css';

const Stars = (props) => {
	
	return (
	  <div className="col-5">
		{_.range(props.numberOfStars).map(i =>
        	<i key={i} className="fa fa-star fa-2x" id={`star${i}`}> <span hidden value={props.numberOfStars}>{props.numberOfStars}</span> </i>
      	)}
	  </div>
	);
};

const Button = (props) => {
	let button;
	switch(props.answerIsCorrect){
		case true:
			button = <button className="btn btn-success" onClick={props.acceptAnswer} id='tick'>
						<i className="fa fa-check"></i>
					</button>; 
					alert("Click tick again for next number");
			break;

		case false:
			button = <button className="btn btn-danger" id='cross'>
						<i className="fa fa-times"></i>
					</button>;
			break;

		default:
			button  = 
				<button className="btn btn-primary" 
						onClick = {props.checkAnswer}
						disabled = {props.selectedNumbers.length === 0} id='equal'>
						=
				</button>;
			break;	
	}
	return (
		<div className="col-2 pt-2">
			{button}
			<br /><br/>
			<button className="btn btn-warning btn-sm p-2" 
					onClick = {props.redraw}
					disabled ={props.redraws === 0} value={props.redraws} id='refresh'>
				<i className="fa fa-refresh"> </i>
				{props.redraws}
			</button>
		</div>
  );
};


const Answer = (props) => {
  return (
    <div className="col-5">
     {props.selectedNumbers.map((number, i) =>
      	<span key={i} onClick={ () => props.unselectNumber(number)} > {number} </span>
      )}
    </div>
  );
};

const Numbers = (props) => {
	const numberClassName = (number) => {
		if(props.usedNumbers.indexOf(number) >=0 ){	//if its already used in the list
			return 'used'
		}
		if(props.selectedNumbers.indexOf(number) >=0 ){	//if its selected by the user
			return 'selected'
		}
	}
	return (
	  <div className="card text-dark bg-dark ">
		<div>
		{Numbers.list.map((number, i) =>
        	<span key = {i} className = {numberClassName(number)}
							onClick={() => props.selectNumber(number)}
							id={i}
			> 
			{number}
			 </span>
        )}
		</div>
	  </div>
	);
  };
  Numbers.list = _.range(1, 10);

const DoneFrame = (props) => {
	return(
		<div>
			<h2 className="p-4 font-weight-bold">
				{props.doneStatus}
			</h2>
			<button className="btn btn-warning"
					onClick={props.resetGame}
			>Play Again</button>
		</div>
	);
}  

var possibleCombinationSum = function(arr, n) {
	if (arr.indexOf(n) >= 0) { return true; }
	if (arr[0] > n) { return false; }
	if (arr[arr.length - 1] > n) {
	  arr.pop();
	  return possibleCombinationSum(arr, n);
	}
	var listSize = arr.length, combinationsCount = (1 << listSize)
	for (var i = 1; i < combinationsCount ; i++ ) {
	  var combinationSum = 0;
	  for (var j=0 ; j < listSize ; j++) {
		if (i & (1 << j)) { combinationSum += arr[j]; }
	  }
	  if (n === combinationSum) { return true; }
	}
	return false;
  };


  class Game extends React.Component {
    static randomNumber = () => 1 + Math.floor(Math.random()*9);
    static initialState = () => ({
      selectedNumbers: [],
      randomNumberOfStars: Game.randomNumber(),
      usedNumbers: [],
      answerIsCorrect: null,
      redraws: 5,
      doneStatus: null,
    });
    state  = Game.initialState();
  
    selectNumber = (clickedNumber) => {
      /* Handling the condition where same no gets added in the answer compo */
      if(this.state.selectedNumbers.indexOf(clickedNumber)>=0){//if it no already exists do nothing
        return;
      }
      this.setState( prevState => ({
        answerIsCorrect:null,
        selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
      }));
    };
    unselectNumber = (clickedNumber) => {
      /* This unselects the number by using filter ie if it matches it removes it from answer*/
      this.setState( prevState => ({
        answerIsCorrect:null,
        selectedNumbers: prevState.selectedNumbers
                     .filter(number => number !== clickedNumber)
      }))
    }
    checkAnswer = () => {
      this.setState( prevState =>  ({
        /* Since we want the accumulated result of the numOfStar to the selectedNumbers we use reduce */
        answerIsCorrect:prevState.randomNumberOfStars === prevState.selectedNumbers.reduce( (acc,n) => acc + n, 0)
          
      }));
  
    }
    acceptAnswer = () => {
      this.setState( prevState => ({
        /* Simply mark the no as used if its in selectedNumbers list  & re render UI*/
        usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
        answerIsCorrect: null,
        selectedNumbers: [],
        randomNumberOfStars: Game.randomNumber(),
      
      }), this.updateDoneStatus);
      /* Since we want to updateStatus when react is done setting the state so we used this callback fun since the setState is async using multiple setStates wont work intendingly */
    }
    redraw = () => {
      if(this.state.redraws === 0){
        return;
      }
      this.setState( prevState => ({
        randomNumberOfStars: Game.randomNumber(),
        answerIsCorrect: null,
        selectedNumbers: [],
        redraws: prevState.redraws - 1,
      
      }), this.updateDoneStatus);
    }
    
    PossibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
      /* We want to exclude the used Numbers so using filter from new poss range */
      const possibleNumbers = _.range(1,10)
                  .filter(number => usedNumbers.indexOf(number) === -1);
      
      return	possibleCombinationSum(possibleNumbers, randomNumberOfStars);
    };
    updateDoneStatus = () => {
      this.setState( prevState => {
        if(prevState.usedNumbers.length === 9){
          return {doneStatus: 'Done, Thanks For Playing!!'}
        }
        if(prevState.redraws === 0 && !this.PossibleSolutions(prevState)){
          return {doneStatus: 'Game Over!!'}
        }
      });
    }
    resetGame = () => this.setState(Game.initialState());
  
    render=()=> {
      /* Destructuring the elements */
      const { 
        selectedNumbers, 
        randomNumberOfStars, 
        answerIsCorrect, 
        usedNumbers,
        redraws,
        doneStatus
              } = this.state;
      return (
        <div className="container-fluid text-center p-5">
          <h1 className="text-success pb-4">Play Nine</h1>
          <hr />
          <div className="row">
            <Stars numberOfStars={randomNumberOfStars}/>
  
            <Button selectedNumbers = {selectedNumbers}
                redraws = {redraws}
                checkAnswer = {this.checkAnswer}
                answerIsCorrect = {answerIsCorrect}
                acceptAnswer = {this.acceptAnswer}
                redraw = {this.redraw}
            />
  
            <Answer selectedNumbers={selectedNumbers}
                unselectNumber={this.unselectNumber}
            />
  
          </div>
          <br />
          {	doneStatus ? <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus}/> 
                  :  <Numbers selectedNumbers = {selectedNumbers}
                    selectNumber = {this.selectNumber}	
                    usedNumbers = {usedNumbers}
                  />
          }	
  
        </div>
      );
    }
  }

class App extends Component {
    render() {
      return (
       <div>
         <center><Game /></center>
         
       <div className='note'><center>NOTE: You can select multiple numbers to make their sum equal to number of stars</center></div>
       </div> 
     
      );
    }
  }
  

export default App;
