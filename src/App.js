import { Component } from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Home from './components/Home/Home';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import CardList from './components/CardList/CardList';
import Card from './components/Card/Card';
import DeckList from './components/DeckList/DeckList';
import LoadingData from './components/LoadingData/LoadingData';

//imports time stamp for easy time tracking
//note, to use time do timestamp.utc('YYYYMMDDHHmm')
const timestamp = require('time-stamp');

// cards are within the deck component

/* Card are structured in the following way by index: 
          0: Question
          1: Answer
          2: Next review Timestamp
          3: SRS Level (space between next review)
          4: Unique Card Number*/


class App extends Component {
  // constructor to define state of the App component
  constructor() {
    super();
    // initial state to route to sign in before user is authenticated
    this.state = {
      currentUser: '', // stores current username
      route: 'signIn', //to navigate and display different compoenent based on route
      isSignedIn: false,
      nextCardNumber: 1, //to assign next card number to newly created cards
      decks: [],
      // decks list state
      addingDeck: false,
      newDeckName: "",
      // decks list item state
      currentDeck: null,
      // card state
      currentCard: null,
      editingCard: false,
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
      // changes state to reflect sign out
      let newState = this.state;
      newState.isSignedIn = false;
      newState.currentUser = "";
      this.setState({ newState });
    }
    else if (newRoute === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: newRoute });
  }

  // function to ensure deck counts are updated on route change to decks component
  changeRouteDecks = () => {
    this.updateCardCounts();
    this.onRouteChange("decks");
  }

  // function to toggle between editing and display mode
  toggleEditMode = () => {
    // gets the opposite of the current editing mode we are in
    const oppositeMode = !this.state.editingCard;
    this.setState({ editingCard: oppositeMode })
  }

  // sets the card to the mode for editing an individual card from the card list
  setToEditCardMode = (currentCard) => {
    let newState = this.state;
    newState.currentCard = currentCard;
    this.setState({ newState });
    this.toggleEditMode();
    this.onRouteChange("card");
  }

  // fetches user data through post request to backend
  fetchUserData = () => {
    // checks sign in information with backend
    fetch(process.env.REACT_APP_BACKEND_URL + 'user-data', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      // sends current user information in json
      body: JSON.stringify({
        currentUser: this.state.currentUser
      })
    })
      .then(res => res.json())
      .then(data => {
        const newState = data;
        // sets state with user data
        this.setState(newState);
      })
  }

  // saves user data on database
  saveData = () => {
    // checks sign in information with backend
    fetch(process.env.REACT_APP_BACKEND_URL + 'save-data', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      // sends current user information in json
      body: JSON.stringify({
        currentUser: this.state.currentUser,
        userdata: JSON.stringify(this.state)
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data !== "User data saved") {
          console.log("Update failed to save");
        }
      })
  }

  //----------------------------------------------------------------------------------------------

  //-------------------------- SIGN IN FUNCTIONS ------------------------

  // function to set state of current user to retreive user data on home page render
  setCurrentUser = (username) => {
    this.setState({ currentUser: username });
  }

  //----------------------------------------------------------------------------------------------


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
    this.setState({ decks: newDecks }, () => {
      //saves to db
      this.saveData();
    });
  }

  //function to toggle deck creation mode
  toggleDeckCreation = () => {
    this.setState({ addingDeck: !this.state.addingDeck }, () => {
      //saves to db
      this.saveData();
    });
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
      totalCount: 0,
      studying: []
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
        if (card[2] <= currentTime) return true;
        else return false;
      }).length;
      newDecks[i].toReviewCount = reviewCount;
    }
    // updates state to newDecks
    this.setState({ decks: newDecks }, () => {
      //saves to db
      this.saveData();
    });
  }

  //----------------------------------------------------------------------------------------------

  //--------------------------- DECK LIST ITEM FUNCTIONS ------------------------------------------------

  // function to update the current deck when user clicks on deck component
  updateCurrentDeck = (id) => {
    this.setState({ currentDeck: id });
  }

  // function to update deck and re-route to selected deck list item
  onDeckListItemSelection = (id) => {
    this.updateCurrentDeck(id - 1);
    this.onRouteChange("cardList", () => {
      //saves to db
      this.saveData();
    });
  }

  //----------------------------------------------------------------------------------------------

  //--------------------------- CARD LIST ITEM FUNCTIONS ------------------------------------------------

  // function to decriment card count for a particular deck
  decrimentTotalCardCount = (deckIndex) => {
    let newDecks = this.state.decks;
    newDecks[deckIndex].totalCount--;
    // sets state of deck to updated deck
    this.setState({ decks: newDecks })
  }

  decrimentReviewCount = (deckIndex, cardIndex) => {
    let newDecks = this.state.decks;
    // stores current date and time
    let currentTime = timestamp.utc('YYYYMMDDHHmm');
    // counts all cards due for review
    let reviewCount = newDecks[deckIndex].cards.filter(card => {
      if (card[2] <= currentTime) return true;
      else return false;
    }).length;
    // decriments review count if deleted deck is due
    if (newDecks[deckIndex].cards[cardIndex][2] < currentTime) {
      reviewCount--;
    }
    newDecks[deckIndex].toReviewCount = reviewCount;
    this.setState({ decks: newDecks });
  }

  // function to delete a card at a particular index
  deleteCard = (deckIndex, cardIndex) => {

    //only splices if there are cards to delete
    if (this.state.decks[deckIndex].cards.length > 1) {
      this.state.decks[deckIndex].cards.splice(cardIndex, 1);
    }
    else {
      this.state.decks[deckIndex].cards.pop();
    }
    // sets state to force render on the DOM
    this.setState({ decks: this.state.decks }, () => {
      this.decrimentTotalCardCount(deckIndex, () => {
        //saves to db
        // updates to study index and decriments if deleted card is due
        this.decrimentReviewCount(deckIndex, cardIndex, () => {
          this.saveData()
        });
      })
    });
  }

  // method to set study array and enter study mode
  setAndRenderStudy = (deckIndex) => {
    let newState = this.state;
    // resets the study section of deck to empty array
    newState.decks[deckIndex].studying = [];
    const currentTime = timestamp.utc('YYYYMMDDHHmm');
    for (let i = 0; i < newState.decks[deckIndex].cards.length; i++) {
      if (currentTime >= newState.decks[deckIndex].cards[i][2]) {
        // stores the index of the cards that need studying
        newState.decks[deckIndex].studying.push(i);
      }
    }
    // sets the state to reflect changes
    this.setState({ newState });
    // sets the route to study
    this.onRouteChange("card");
  }


  //----------------------------------------------------------------------------------------------

  //--------------------------- CARD FUNCTIONS ------------------------------------------------

  // toggle whether answer is hidden
  toggleHideAnswer = () => {
    this.setState({ cardAnswerIsHidden: !this.state.cardAnswerIsHidden });
  }

  // method to update current card
  updateCurrentCard = (newCardIndex) => {
    this.setState({ currentCard: newCardIndex });
  }

  // function to change the question and answer
  setEdits = (currentDeck, currentCard) => {
    let newState = this.state;
    // only sets edits if there have been edits made
    if (newState.editingCardQuestion !== "")
      newState.decks[currentDeck].cards[currentCard][0] = newState.editingCardQuestion;
    if (newState.editingCardQuestion !== "")
      newState.decks[currentDeck].cards[currentCard][1] = newState.editingCardAnswer;
    // resets edit fields to detect new edits
    newState.editingCardQuestion = "";
    newState.editingCardAnswer = "";
    this.setState({ newState });
  }

  // functions to track changes when editing
  onEditCardQuestion = (event) => {
    this.setState({ editingCardQuestion: event.target.value });
  }
  onEditCardAnswer = (event) => {
    this.setState({ editingCardAnswer: event.target.value });
  }

  // function to set edits and route to correct parent element
  setEditsAndRoute = (currentDeck, currentCard) => {
    this.setEdits(currentDeck, currentCard);
    //routes back to card list component
    this.onRouteChange("cardList");
    this.toggleEditMode();
    // updates database after half a second to allow state to update on change
    setTimeout(() => {
      this.saveData();
    }, 500);
  }

  // function to add a new card and enter edit mode
  addAndEditCard = (currentDeck) => {
    let newState = this.state;
    const newCardIndex = newState.decks[currentDeck].cards.length;
    newState.decks[currentDeck].cards.push(["", "", timestamp.utc("YYYYMMDDHHmm"), 0, newState.nextCardNumber++]);
    this.setState({ newState });
    this.setToEditCardMode(newCardIndex);
    // updates database after half a second to allow state to update on change
    setTimeout(() => {
      this.saveData();
    }, 500);
  }

  // // method to determine if a year is a leap year
  isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // // method to determine days in a month
  daysInMonth = (month, year) => {
    if (month === 1 || month === 3 || month === 5
      || month === 7 || month === 8 || month === 10
      || month === 12) {
      return 31
    }
    if (month === 2) return this.isLeapYear(year) ? 29 : 28;
    return 30;
  }

  // // method that takes a current time and number of days and returns a timestamp
  // // in form YYYYMMDDHHmm with days addec
  addDaysToTimestamp = (timestamp, days) => {
    let currentDay = parseInt(timestamp.substring(6, 8));
    let currentMonth = parseInt(timestamp.substring(4, 6));
    let currentYear = parseInt(timestamp.substring(0, 4));
    while (days !== 0) {
      // adds a year if future date will be past december
      if (currentMonth === 12 && currentDay + days > this.daysInMonth(currentMonth, currentYear)) {
        days -= (this.daysInMonth(currentMonth, currentYear) - currentDay + 1); // readjusts days for 1st of january next year
        currentYear++; //update current year to next year
        currentMonth = 1; // update to january
        currentDay = 1; // update to first day
      }
      // updates to next month
      else if (currentDay + days > this.daysInMonth(currentMonth, currentYear)) {
        days -= (this.daysInMonth(currentMonth, currentYear) - currentDay + 1); // readjusts days
        currentMonth++; // updates to next month
        currentDay = 1; // update to first day
      }
      else {
        currentDay += days;
        days = 0;
      }
    }
    // reformats back to string for valid return 
    let returnedTimestamp = "";
    returnedTimestamp += currentYear.toString();
    returnedTimestamp += currentMonth.toString().length === 1 ? "0" + currentMonth.toString() : currentMonth.toString();
    returnedTimestamp += currentDay.toString().length === 1 ? "0" + currentDay.toString() : currentDay.toString();
    returnedTimestamp += timestamp.substring(8);
    return returnedTimestamp;
  }


  // method to update card due time
  updatedCardDueTime = (currentDeck) => {
    const currentCardIndex = this.state.decks[currentDeck].studying[0];
    const nextLevel = this.state.decks[currentDeck].cards[currentCardIndex][3] >= 7 ? 7 : this.state.decks[currentDeck].cards[currentCardIndex][3] + 1;
    const currentTime = timestamp.utc('YYYYMMDDHHmm');
    // switch to return updated timestamp based on next level
    switch (nextLevel) {
      case 1: // review next day
        return this.addDaysToTimestamp(currentTime, 1);
      case 2: // review three days 
        return this.addDaysToTimestamp(currentTime, 3);
      case 3: // review one week 
        return this.addDaysToTimestamp(currentTime, 7);
      case 4: // review two week 
        return this.addDaysToTimestamp(currentTime, 14);
      case 5: // review 30 days 
        return this.addDaysToTimestamp(currentTime, 30);
      case 6: // review 90 days 
        return this.addDaysToTimestamp(currentTime, 90);
      case 7: // review 180 days 
        return this.addDaysToTimestamp(currentTime, 180);
      default:
        console.log("ERROR: Level range out of bounds");
    }
  }

  // display days until next review at next level
  displayDaysUntilNextReview = (currentDeck, currentCard) => {
    const nextLevel = this.state.decks[currentDeck].cards[currentCard][3] + 1;
    // switch to update to certain time based on level
    switch (nextLevel) {
      case 1: // review next day
        return "1 day";
      case 2: // review three days 
        return "3 days";
      case 3: // review one week 
        return "1 week";
      case 4: // review two week 
        return "2 weeks";
      case 5: // review 30 days 
        return "30 days";
      case 6: // review 90 days 
        return "90 days";
      case 7: // review 180 days 
        return "180 days";
      default:
        console.log("out of range level");
    }
  }

  // method that returns index of all cards in deck that need review
  cardsDueIndex = (currentDeck) => {
    const currentTime = timestamp.utc("YYYYMMDDHHmm");
    let indexArray = [];
    for (let i = 0; i < this.state.decks[currentDeck].cards.length; i++) {
      if (this.state.decks[currentDeck].cards[i][2] <= currentTime) indexArray.push(i);
    }
    return indexArray;
  }

  //method to move current card to back of the deck and updates card level
  // for incorrect answer
  wrongAnswer = (currentDeck) => {
    let newState = this.state;
    const currentCardIndex = newState.decks[currentDeck].studying[0];
    // updates level down a level if it is greater than level 1
    newState.decks[currentDeck].cards[currentCardIndex][3] <= 0 ? newState.decks[currentDeck].cards[currentCardIndex][3] = 0 : newState.decks[currentDeck].cards[currentCardIndex][3]--;
    // removes first element of study array
    newState.decks[currentDeck].studying.splice(0, 1);
    // adds previous first element to end of the study array
    newState.decks[currentDeck].studying.push(currentCardIndex);
    // sets the answer to hidden again
    newState.cardAnswerIsHidden = true;
    this.setState({ newState }, () => {
      this.saveData();
    });
  }

  // method to remove card from studying deck and update card due time and level on correct answer
  rightAnswer = (currentDeck) => {
    let newState = this.state;
    const currentCardIndex = newState.decks[currentDeck].studying[0];
    // updates timestamp to next review
    newState.decks[currentDeck].cards[currentCardIndex][2] = this.updatedCardDueTime(currentDeck);
    // updates to next level if less than 7
    newState.decks[currentDeck].cards[currentCardIndex][3] >= 7 ? newState.decks[currentDeck].cards[currentCardIndex][3] = 7 : newState.decks[currentDeck].cards[currentCardIndex][3]++;
    // removes first element of study array
    newState.decks[currentDeck].studying.splice(0, 1);
    // sets the answer to hidden again
    newState.cardAnswerIsHidden = true;
    this.setState({ newState }, () => {
      this.saveData();
    });
  }



  //----------------------------------------------------------------------------------------------

  render() {
    // destructures the state to individual props
    const { route, isSignedIn, decks, addingDeck, currentDeck, currentCard, editingCard, cardAnswerIsHidden } = this.state;
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
            ? <SignIn
              onRouteChange={this.onRouteChange}
              setCurrentUser={this.setCurrentUser}
            />
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
                          onDeckListItemSelection={this.onDeckListItemSelection}
                        />
                        : (
                          route === "cardList"
                            ? <CardList
                              decks={decks}
                              currentDeck={currentDeck}
                              deleteCard={this.deleteCard}
                              setToEditCardMode={this.setToEditCardMode}
                              addAndEditCard={this.addAndEditCard}
                              setAndRenderStudy={this.setAndRenderStudy}
                            />
                            : (route === "card"
                              ? <Card
                                decks={decks}
                                currentDeck={currentDeck}
                                currentCard={currentCard}
                                editingCard={editingCard}
                                cardAnswerIsHidden={cardAnswerIsHidden}
                                toggleHideAnswer={this.toggleHideAnswer}
                                onEditCardQuestion={this.onEditCardQuestion}
                                onEditCardAnswer={this.onEditCardAnswer}
                                setEditsAndRoute={this.setEditsAndRoute}
                                displayDaysUntilNextReview={this.displayDaysUntilNextReview}
                                wrongAnswer={this.wrongAnswer}
                                rightAnswer={this.rightAnswer}
                                changeRouteDecks={this.changeRouteDecks}
                              />
                              : (route === "loadingData"
                                ? <LoadingData
                                  route={route}
                                  fetchUserData={this.fetchUserData}
                                  onRouteChange={this.onRouteChange}
                                />
                                : <h1>Error, route not found.</h1>
                              )
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
