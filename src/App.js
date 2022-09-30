import { Component } from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Home from './components/Home/Home';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import CardList from './components/CardList/CardList';
import Card from './components/Card/Card';
import DeckList from './components/DeckList/DeckList';
//imports time stamp for easy time tracking
//note, to use time do timestamp.utc('YYYYMMDDHHmm')
const timestamp = require('time-stamp');


class App extends Component {
  // constructor to define state of the App component
  constructor() {
    super();
    this.state = {
      route: 'signIn', //to navigate and display different compoenent based on route
      isSignedIn: false, // to determine if signed in or not
            decks: [{
                name: "Science",
                cards: [
                    "What is the powerhouse of a cell?",
                    "Mitochondria",
                    202309290544,
                    "What is the symbol for water?",
                    "H2O",
                    202309290544,
                    "What is the symbol for iron?",
                    "fe",
                    202210290544
                ],
                toReviewCount: 0,
                totalCount: 3
            },
            {
                name: "History",
                cards: [
                    "What year did WW2 end?",
                    "1945",
                    202209290544,
                    "What year did America declare independence?",
                    "1776",
                    202209290544
                ],
                toReviewCount: 2,
                totalCount: 2
            },
            {
                name: "Geography",
                cards: [],
                toReviewCount: 0,
                totalCount: 0
            }
            ],
            addingDeck: false,
            newDeckName: ""
  }
}

//-------------------------- MULTI-COMPONENT FUNCTIONS ------------------------

  // function that changes the state of isSignedIn depending on 
  // route variable passed in as parameter, and changes the current
  // state of route
  onRouteChange = (newRoute) => {
    if (newRoute === "signOut") {
      this.setState({ isSignedIn: false });
    }
    else if (newRoute === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: newRoute });
  }

  // functions to change the question and answer
  // onEditCardQuestion = (event) => {
    // this.setState({ question: event.target.value });
  // }

  // onEditCardAnswer = (event) => {
    // this.setState({ answer: event.target.value });
  // }



  //--------------------------- DECK LIST FUNCTIONS ------------------------------------------------

    // function to delete card at a certain index
    deleteCard = (startingIndex) => {
        let newDeck = [];
        //only splices if there are cards to delete
        if (this.state.decks.length > 1) {
            this.state.decks.splice(startingIndex, 1);
            newDeck = this.state.decks;
        }
        // sets state to new deck to force rerender
        this.setState({ decks: newDeck });
    }

    //function to toggle deck creation mode
    toggleDeckCreation = () => {
        this.setState({ addingDeck: !this.state.addingDeck });
    }

    //function to capture changes in name
    nameInputChanges = (event) => {
        this.setState({ newDeckName: event.target.value });
    }

    //function to add deck to deck list
    addDeck = () => {
        // creates new empty deck with name
        const newObject = {
            name: this.state.newDeckName,
            cards: [],
            toReviewCount: 0,
            totalCount: 0
        }
        // adds deck to state
        this.state.decks.push(newObject);
        // toggles deck creation
        this.toggleDeckCreation();
    }
  //----------------------------------------------------------------------------------------------
  render() {
    // destructures the state to individual props
    const { route, isSignedIn, decks, addingDeck, deleteCard } = this.state;
    return (
      <div className="App">
        {/* passes onRouteChange and isSignedIn as props to allow them to be called
        and changed the NavigationBar component */}
        <NavigationBar onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        <h1 className="fw8 f1 lh-title ma3">Simple Study Cards</h1>
        {
          // ternary statement to display different component depending on route
          route === "signIn" || route === "signOut"
            ? <SignIn onRouteChange={this.onRouteChange} />
            : (
              route === "register"
                ? <Register onRouteChange={this.onRouteChange} />
                : (
                  route === "home"
                    ? <Home onRouteChange={this.onRouteChange} />
                    : (
                      route === "decks"
                        ?
                        <DeckList
                            decks={decks}
                            addingDeck={addingDeck}
                            toggleDeckCreation={this.toggleDeckCreation}
                            nameInputChanges={this.nameInputChanges}
                            addDeck={this.addDeck}
                            deleteCard={this.deleteCard}
                        />
                        // <Card
                        //   question={question}
                        //   answer={answer}
                        //   onEditCardQuestion={this.onEditCardQuestion}
                        //   onEditCardAnswer={this.onEditCardAnswer} />
                        : (
                          route === "cardList"
                            ? <CardList />
                            : <h1>test</h1>
                        )
                    )
                )
            )
        }
      </div>
    );
  }
}

export default App;
