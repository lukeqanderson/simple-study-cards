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
import Search from './components/Search/Search';
import Stats from './components/Stats/Stats';
import LogList from './components/LogList/LogList'

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
      editingCardAnswer: "",
      // stores previous route for logging and going back to parent components
      previousRoute: "",
      searchField: "",
      // array of logging data for study sessions to generate statistics
      logs: [],
      currentLog: 0,
      // stats object for tracking stats from logs in machine and human 
      // readable formats
      stats: {
        rightAnswerCount: 0,
        totalAnswers: 0,
        totalStudyTime: 0,
        correctAnswerRatio: 0,
        averageTimePerAnswer: 0,
        bestDeck: "",
        bestDeckRatio: 0,
        worstDeck: "",
        worstDeckRatio: 100
      },
      readableStats: {
        totalAnswers: "",
        totalStudyTime: "",
        correctAnswerRatio: "",
        averageTimePerAnswer: "",
        bestDeck: "",
        bestDeckRatio: "",
        worstDeck: "",
        worstDeckRatio: ""
      }
    }
  }

  //-------------------------- MULTI-COMPONENT FUNCTIONS ------------------------

  // function that changes the state of isSignedIn depending on 
  // route variable passed in as parameter, and changes the current
  // state of route
  onRouteChange = (newRoute) => {
    let newState = this.state;
    // updates to the new route
    newState.previousRoute = newState.route;
    newState.route = newRoute;
    if (newRoute === "signOut") {
      // changes state to reflect sign out
      newState.isSignedIn = false;
      newState.currentUser = "";
    }
    if (newRoute === "home") {
      newState.isSignedIn = true;
    }
    if (newRoute === "card" && !newState.editingCard) {
      // populates logs for start of new session
      newState.logs.push({
        deckName: newState.decks[newState.currentDeck].name,
        wrongAnswers: 0,
        rightAnswers: 0,
        // grabs UNIX timestamp and converts milliseconds to seconds
        startTime: Math.floor(Date.now() / 1000),
        endTime: 0
      })
    }
    // updates end time if leaving study session and end time is not recorded
    if (newRoute !== "card" && newState.logs.length > 0) {
      if (newState.logs[newState.logs.length - 1].endTime === 0) {
        // Grabs UNIX timestamp in seconds for finished study session
        newState.logs[newState.logs.length - 1].endTime = Math.floor(Date.now() / 1000);
      }
    }
    // generate stats on route to stats
    if (newRoute === "stats") {
      this.generateStats();
    }

    // sets the state and ensures logs are saved in all routing conditions 
    if (newRoute === "signOut"
      || newRoute === "card"
      || (newRoute === "search" && newState.previousRoute === "card")
      || (newRoute === "stats" && newState.previousRoute === "card")) {
      this.setState({ newState }, () => {
        this.saveData();
      });
    }
    else {
      this.setState({ newState });
    }
  }

  // function to ensure deck counts are updated on route change to decks component
  changeRouteDecks = () => {
    this.updateCardCounts();
    this.onRouteChange("decks");
  }

  // function to toggle between editing and display mode
  toggleEditMode = (currentMode) => {
    // gets the opposite of the current editing mode we are in
    return !currentMode;
  }

  // sets the card to the mode for editing an individual card from the card list
  setToEditCardMode = (currentDeck, currentCard) => {
    let newState = this.state;
    newState.currentCard = currentCard;
    newState.currentDeck = currentDeck;
    newState.editingCard = this.toggleEditMode(newState.editingCard);


    this.onRouteChange("card", () => {
      this.setState({ newState })
    });
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
    this.setState({ newState }, () => {
      // sets the route to study
      this.onRouteChange("card");
    });

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

  // functions to track changes when editing
  onEditCardQuestion = (event) => {
    this.setState({ editingCardQuestion: event.target.value });
  }
  onEditCardAnswer = (event) => {
    this.setState({ editingCardAnswer: event.target.value });
  }

  // function to set edits and route to correct parent element
  setEditsAndRoute = (currentDeck, currentCard) => {
    let newState = this.state;
    // only sets edits if there have been edits made
    if (newState.editingCardQuestion !== "")
      newState.decks[currentDeck].cards[currentCard][0] = newState.editingCardQuestion;
    if (newState.editingCardQuestion !== "")
      newState.decks[currentDeck].cards[currentCard][1] = newState.editingCardAnswer;
    // resets edit fields to detect new edits
    newState.editingCardQuestion = "";
    newState.editingCardAnswer = "";
    //routes back to the previous route
    let previousRoute = newState.route;
    newState.route = newState.previousRoute;
    newState.previousRoute = previousRoute;
    newState.editingCard = this.toggleEditMode(newState.editingCard);
    // updates state and db
    this.setState({ newState }, () => {
      this.saveData()
    });
  }

  // function to add a new card and enter edit mode
  addAndEditCard = (currentDeck) => {
    let newState = this.state;
    const newCardIndex = newState.decks[currentDeck].cards.length;
    newState.decks[currentDeck].cards.push(["", "", timestamp.utc("YYYYMMDDHHmm"), 0, newState.nextCardNumber++]);
    newState.currentCard = newCardIndex;
    newState.currentDeck = currentDeck;
    // sets to editing mode
    newState.editingCard = this.toggleEditMode(newState.editingCard);
    // updatse current and previous routes
    newState.previousRoute = newState.route;
    newState.route = "card";
    // sets state and updates db
    this.setState({ newState }, () => {
      this.saveData();
    })
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
    // marks log as wrong
    newState.logs[newState.logs.length - 1].wrongAnswers++;
    // tracks right answer on total answers
    newState.stats.totalAnswers++;
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
    // marks log as right
    newState.logs[newState.logs.length - 1].rightAnswers++;
    // tracks right answer on total answers and right answer count
    newState.stats.totalAnswers++;
    newState.stats.rightAnswerCount++;
    this.setState({ newState }, () => {
      this.saveData();
    });
  }

  //----------------------------------------------------------------------------------------------

  //--------------------------- SEARCH FUNCTIONS ------------------------------------------------

  // methods to update search field on user input
  onSearchChange = (event) => {
    this.setState({ searchField: event.target.value });
  }

  //----------------------------------------------------------------------------------------------

  //--------------------------- STATS FUNCTIONS ------------------------------------------------

  // method to calculate stats from logs 
  generateStats = () => {
    // only generates stats if there is a log
    if (this.state.logs.length > 0) {
      let newState = this.state;
      // clears original stats except counts to prevent acculuation over counted logs 
      newState.stats = {
        rightAnswerCount: newState.stats.rightAnswerCount,
        totalAnswers: newState.stats.totalAnswers,
        totalStudyTime: 0,
        correctAnswerRatio: 0,
        averageTimePerAnswer: 0,
        bestDeck: "",
        bestDeckRatio: 0,
        worstDeck: "",
        worstDeckRatio: 100
      }
      // calculates correct answer ration
      newState.stats.correctAnswerRatio = Math.round((newState.stats.rightAnswerCount / newState.stats.totalAnswers) * 100);
      // creates a hash map for access with Deck as the key and an array with [correct answers, total answers, time studied]
      const deckMap = new Map();
      // populates the Map
      newState.logs.forEach((log) => {
        // if deck is not present in the map, set the map to the first values in the log
        if (!deckMap.has(log.deckName)) {
          deckMap.set(log.deckName, [log.rightAnswers, log.rightAnswers + log.wrongAnswers, log.endTime - log.startTime]);
        }
        // if the deck is already present in the map, increment the values in the array of the current map
        else {
          deckMap.set(log.deckName,
            [deckMap.get(log.deckName)[0] + log.rightAnswers,
            deckMap.get(log.deckName)[1] + (log.rightAnswers + log.wrongAnswers),
            deckMap.get(log.deckName)[2] + (log.endTime - log.startTime)]);

        }
      })
      // loops through map to calculate deck specific statistics
      deckMap.forEach((val, key) => {
        // updates total study time
        newState.stats.totalStudyTime += val[2];
        // updates worst deck ratio of right answer to total answers to current minimum
        if (Math.round((val[0] / val[1]) * 100) <= newState.stats.worstDeckRatio) {
          newState.stats.worstDeckRatio = Math.round((val[0] / val[1]) * 100);
          newState.stats.worstDeck = key;
        }
        // updates best deck ratio to greatest value
        if (Math.round((val[0] / val[1]) * 100) >= newState.stats.bestDeckRatio) {
          newState.stats.bestDeckRatio = Math.round((val[0] / val[1]) * 100);
          newState.stats.bestDeck = key;
        }
      })
      // updates average time per answer
      newState.stats.averageTimePerAnswer = Math.round(newState.stats.totalStudyTime / newState.stats.totalAnswers);

      // sets state with updated stats then generates them to human readable format
      this.setState({ newState }, () => {
        this.generateReadableStats();
      });
    }
  }

  // method to convert seconds to a string indicating number of days, hours, minutes, and seconds
  convertSecondsToReadableString = (totalInSeconds) => {
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    // calculates days first
    days = Math.floor(totalInSeconds / 86400);
    totalInSeconds %= 86400;
    hours = Math.floor(totalInSeconds / 3600);
    totalInSeconds %= 3600;
    minutes = Math.floor(totalInSeconds / 60);
    totalInSeconds %= 60;
    seconds = totalInSeconds;
    let outputString = "";
    //only adds values except seconds if they are greater than 0
    outputString += days > 0 ? "Days: " + days.toLocaleString("en-US") + ", " : "";
    outputString += hours > 0 ? "Hours: " + hours.toString() + ", " : "";
    outputString += minutes > 0 ? "Minutes: " + minutes.toString() + ", " : "";
    outputString += "Seconds: " + seconds;
    return outputString;
  }

  // method to generate readable stats
  generateReadableStats = () => {
    let newState = this.state;
    let machineStats = this.state.stats;
    let readableStats = this.state.readableStats;
    readableStats.bestDeckRatio = machineStats.bestDeckRatio + "%";
    readableStats.correctAnswerRatio = machineStats.correctAnswerRatio + "%";
    readableStats.worstDeckRatio = machineStats.worstDeckRatio + "%";
    readableStats.bestDeck = machineStats.bestDeck;
    readableStats.worstDeck = machineStats.worstDeck;
    readableStats.totalAnswers = machineStats.totalAnswers.toLocaleString("en-US");
    readableStats.averageTimePerAnswer = this.convertSecondsToReadableString(machineStats.averageTimePerAnswer);
    readableStats.totalStudyTime = this.convertSecondsToReadableString(machineStats.totalStudyTime);
    newState.readableStats = readableStats;
    // sets new readable stats to state
    this.setState({ newState });
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
                                : (route === "search"
                                  ? <Search
                                    decks={this.state.decks}
                                    searchField={this.state.searchField}
                                    onSearchChange={this.onSearchChange}
                                    deleteCard={this.deleteCard}
                                    setToEditCardMode={this.setToEditCardMode}
                                  />
                                  : (route === "stats"
                                    ? <Stats
                                      logs={this.state.logs}
                                      readableStats={this.state.readableStats}
                                      onRouteChange={this.onRouteChange}
                                    />
                                    : (route === "logList"
                                      ? <LogList
                                        // reverses log for newest to older order
                                        logs={this.state.logs.reverse()}
                                        onRouteChange={this.onRouteChange}
                                      />
                                      : <h1>route not found</h1>))
                                )
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
