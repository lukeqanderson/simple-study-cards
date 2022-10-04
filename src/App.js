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
                    ["What is the powerhouse of a cell?",
                    "Mitochondria",
                    202309290544],
                    ["What is the symbol for water?",
                    "H2O",
                    202309290544],
                    ["What is the symbol for iron?",
                    "fe",
                    202209290544]
                ],
                toReviewCount: 0,
                totalCount: 0 
            },
            {
                name: "History",
                cards: [
                    ["What year did WW2 end?",
                    "1945",
                    202209290544],
                    ["What year did America declare independence?",
                    "1776",
                    202209290544]
                ],
                toReviewCount: 0,
                totalCount: 0 
            },
            {
                name: "Geography",
                cards: [],
                toReviewCount: 0,
                totalCount: 0
            }
            ],
            // decks list state
            addingDeck: false,
            newDeckName: "",
            // decks list item state
            currentDeck: null,
            // card state
            currentCard: null,
            editingCard: false,
            editingFromStudyingOrCardList: "cardList",
            cardAnswerIsHidden: true,
            editingCardQuestion: "",
            editingCardAnswer: ""
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

  // function to ensure deck counts are updated on route change to decks component
  changeRouteDecks = () => {
    this.updateCardCounts();
    this.setState({route : "decks"});
  }




  //--------------------------- DECK LIST FUNCTIONS ------------------------------------------------

    // function to delete deck at a certain index
    deleteDeck = (startingIndex) => {
        let newDecks = [];
        //only splices if there are cards to delete
        if (this.state.decks.length > 1) {
            this.state.decks.splice(startingIndex, 1);
            newDecks = this.state.decks;
        }
        // sets state to new deck to force rerender
        this.setState({ decks: newDecks });
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

    // function to update card counts for all decks on Deck component render
    updateCardCounts = () => {
      let newDecks = this.state.decks;
      // stores current date and time
      let currentTime = timestamp.utc('YYYYMMDDHHmm');
      // loops through all items in array
      for (let i = 0; i < newDecks.length; i++) {
        newDecks[i].totalCount = newDecks[i].cards.length;
        // counts all cards due for review
        let reviewCount = newDecks[i].cards.filter(card => {
          if(card[2] < currentTime) return true;
          else return false;
        }).length;
        newDecks[i].toReviewCount = reviewCount;
      }
      // updates state to newDecks
      this.setState({decks : newDecks});
    }

  //----------------------------------------------------------------------------------------------
  
  //--------------------------- DECK LIST ITEM FUNCTIONS ------------------------------------------------
  
  // function to update the current deck when user clicks on deck component
  updateCurrentDeck = (id) => {
    this.setState({currentDeck : id});
  } 

  // function to update deck and re-route to selected deck list item
  onDeckListItemSelection = (id) => {
    this.updateCurrentDeck(id-1);
    this.onRouteChange("cardList");
  }

  //----------------------------------------------------------------------------------------------

  //--------------------------- CARD LIST ITEM FUNCTIONS ------------------------------------------------
  
  // function to decriment card count for a particular deck
  decrimentTotalCardCount = (deckIndex) => {
    let newDecks = this.state.decks;
    newDecks[deckIndex].totalCount--;
    // sets state of deck to updated deck
    this.setState({decks : newDecks})
  }

  decrimentReviewCount = (deckIndex, cardIndex) => {
    let newDecks = this.state.decks;
    // stores current date and time
    let currentTime = timestamp.utc('YYYYMMDDHHmm');
    // counts all cards due for review
    let reviewCount = newDecks[deckIndex].cards.filter(card => {
      if(card[2] < currentTime) return true;
      else return false;
    }).length;
    // decriments review count if deleted deck is due
    if (newDecks[deckIndex].cards[cardIndex][2] < currentTime) {
      reviewCount--;
    }
    newDecks[deckIndex].toReviewCount = reviewCount;
    this.setState({decks : newDecks});
  }

  // function to delete a card at a particular index
  deleteCard = (deckIndex, cardIndex) => {
        // updates to study index and decriments if deleted card is due
        this.decrimentReviewCount(deckIndex, cardIndex);
        //only splices if there are cards to delete
        if (this.state.decks[deckIndex].cards.length > 1) {
            this.state.decks[deckIndex].cards.splice(cardIndex, 1);
        }
        else {
          this.state.decks[deckIndex].cards.pop();
        }
        // sets state to force render on the DOM
        this.setState({decks : this.state.decks});
        // decriments the total number of cards
        this.decrimentTotalCardCount(deckIndex);
  }

  setToEditCardMode = (currentCard) => {
    let newState = this.state;
    newState.currentCard = currentCard;
    newState.editingFromStudyingOrCardList = "cardList";
    this.setState({newState});
    this.toggleEditMode();
    this.onRouteChange("card");
  }

  //----------------------------------------------------------------------------------------------

  //--------------------------- CARD FUNCTIONS ------------------------------------------------

    // toggle whether answer is hidden
    toggleHideAnswer = () => {
      this.setState({ cardAnswerIsHidden: !this.state.cardAnswerIsHidden });
    }


    // function to change isCorrect state
    markAnswerCorrect = () => {
        this.setState({ isCorrect: !this.state.isCorrect});
    }

    // function to toggle between editing and display mode
    toggleEditMode = () => {
        // gets the opposite of the current editing mode we are in
        const oppositeMode = !this.state.editing;
        this.setState({ editing: oppositeMode })
        // hides answer after editing
        this.toggleHideAnswer();
    }

    // function to change the question and answer
    setEdits = (currentDeck, currentCard) => {
      let newState = this.state;
      // only sets edits if there have been edits made
      if(newState.editingCardQuestion !== "") 
        newState.decks[currentDeck].cards[currentCard][0] = newState.editingCardQuestion;
      if(newState.editingCardQuestion !== "") 
        newState.decks[currentDeck].cards[currentCard][1] = newState.editingCardAnswer;
      // resets edit fields to detect new edits
      newState.editingCardQuestion = "";
      newState.editingCardAnswer = "";
      this.setState({newState });
    }

    // functions to track changes when editing
    onEditCardQuestion = (event) => {
      this.setState({ editingCardQuestion: event.target.value });
    }
    onEditCardAnswer = (event) => {
      this.setState({ editingCardAnswer : event.target.value });
    }

    // function to set edits and route to correct parent element
    setEditsAndRoute = (currentDeck, currentCard) => {
      this.setEdits(currentDeck, currentCard);
      this.onRouteChange(this.state.editingFromStudyingOrCardList);
      this.toggleEditMode();
    }

    // function to add a new card and enter edit mode
    addAndEditCard = (currentDeck) => {
      let newDeck = this.state.decks;
      const newCardIndex = newDeck[currentDeck].cards.length;
      newDeck[currentDeck].cards.push(["","",timestamp.utc("YYYYMMDDHHmm")]);
      this.setState({decks : newDeck});
      this.setToEditCardMode(newCardIndex);
    }
  //----------------------------------------------------------------------------------------------

  render() {
    // destructures the state to individual props
    const { route, isSignedIn, decks, addingDeck, currentDeck, currentCard, editingCard, editingFromStudyingOrCardList, cardAnswerIsHidden  } = this.state;
    return (
      <div className="App">
        {/* passes onRouteChange and isSignedIn as props to allow them to be called
        and changed the NavigationBar component */}
        <NavigationBar 
        onRouteChange={this.onRouteChange} 
        changeRouteDecks={this.changeRouteDecks}
        isSignedIn={isSignedIn} 
        />
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
                    ? <Home 
                    changeRouteDecks={this.changeRouteDecks}
                    />
                    : (
                      route === "decks"
                        ?
                        <DeckList
                            decks={decks}
                            addingDeck={addingDeck}
                            toggleDeckCreation={this.toggleDeckCreation}
                            nameInputChanges={this.nameInputChanges}
                            addDeck={this.addDeck}
                            deleteDeck={this.deleteDeck}
                            onDeckListItemSelection = {this.onDeckListItemSelection}
                        />
                        : (
                          route === "cardList"
                            ? <CardList 
                              decks={decks}
                              currentDeck={currentDeck}
                              deleteCard={this.deleteCard}
                              setToEditCardMode={this.setToEditCardMode}
                              addAndEditCard={this.addAndEditCard}
                            />
                            : ( route === "card"
                            ?<Card
                              decks={decks}
                              currentDeck={currentDeck}
                              currentCard={currentCard}
                              editingCard={editingCard} 
                              editingFromStudyingOrCardList={editingFromStudyingOrCardList}
                              cardAnswerIsHidden={cardAnswerIsHidden}
                              toggleHideAnswer={this.toggleHideAnswer}
                              markAnswerCorrect={this.markAnswerCorrect}
                              toggleEditMode={this.toggleEditMode}
                              onEditCardQuestion={this.onEditCardQuestion}
                              onEditCardAnswer={this.onEditCardAnswer}
                              setEditsAndRoute={this.setEditsAndRoute}
                            /> 
                            : <></>
                            )
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
