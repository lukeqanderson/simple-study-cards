import { Component } from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Home from './components/Home/Home';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import CardList from './components/CardList/CardList';
import Card from './components/Card/Card';
import DeckList from './components/DeckList/DeckList';


class App extends Component {
  // constructor to define state of the App component
  constructor() {
    super();
    this.state = {
      route: 'signIn', //to navigate and display different compoenent based on route
      isSignedIn: false, // to determine if signed in or not
      question: "What is the scientific symbol for water?",
      answer: "H20"
    }
  }

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
  onEditCardQuestion = (event) => {
    this.setState({ question: event.target.value });
  }

  onEditCardAnswer = (event) => {
    this.setState({ answer: event.target.value });
  }

  render() {
    // destructures the state to individual props
    const { route, isSignedIn, question, answer } = this.state;
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
                        <DeckList />
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
