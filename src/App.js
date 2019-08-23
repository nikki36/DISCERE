import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink
}
from 'react-router-dom'
import './App.css';
import firebase, { db, auth } from './services/firebase'
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  FormControl
}
from 'react-bootstrap'
import wiki from 'wikijs'

class App extends React.Component {
  state = {
    user: null,
    name: '',
    email: '',
    password: '',
    interests: [],
    userInfo: null,
  }

  handleChange = (event) => {
    const value = event.target.value
    const name = event.target.name
    this.setState({ [name]: value})
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.setState({
          user: {
            displayName: user.displayName,
            email: user.email,
            uid: user.uid
          }
        })
        db.collection('learners')
          .where('uid', '==', user.uid)
          .get()
          .then( snapshot => {
            console.log(snapshot)
            const data = snapshot.docs[0].data()
            console.log(data)
            this.setState({ userInfo: data })
          })
          .catch(console.error)
      }
      else {
        // No user is signed in.\
        this.setState({ user: null })
      }
    })
  }

  signInUser = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user
        console.log(user.displayName)
        console.log(user.email)
      }).catch(function(error) {
        console.log(error)
      })
  }

  signOutUser = () => {
    auth.signOut()
  }
  
  addNewLearner = (name, email, password, interests) => {
    auth.createUserWithEmailAndPassword(email, password)
    .then( (res) => {
      console.log(res)
      db.collection('learners')
        .add({
          name: name,
          email: email,
          password: password,
          interests: interests,
          uid: res.user.uid

        }) 
        .catch( err => console.log(err))
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error)
      // ...
    })    
      // console.log(this.state.name)
      // console.log(this.state.emial)
      // console.log(this.state.password)
      // console.log(this.state.interests)
  }
  
  addStudiedIdea = () => {
    db.collection('learners')
      .add({
        idea: this.state.user.idea
      })
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div className="body">
            <FullNavbar signin={this.signInUser} signout={this.signOutUser} user={this.state.user}/>
            <Route exact path="/" component={ () => <Home user={this.state.user} />} />
            <Route path="/login" component={ () => <Login signin={this.signInUser} addNewLearner={this.addNewLearner} /> } />
            <Route path="/profile" component={() => <Profile user={this.state.user} userInfo={this.state.userInfo} />} />
            <Route exact path="/exploreideas" component={ () => <ExploreIdeas user={this.state.user} />} />
            <Route path="/exploreideas/nature" component={ () => <Nature user={this.state.user} />} />
            <Route path="/exploreideas/technology" component={ () => <Technology user={this.state.user} />} />
            <Route path="/exploreideas/food" component={ () => <Food user={this.state.user} />} />
            <Route path="/exploreideas/academics" component={ () => <Academics user={this.state.user} />} />
            <Route path="/mission" component={ () => <Mission user={this.state.user}/>} />
            <Route path="/contactus" component={ () => <ContactUs user={this.state.user}/>} />
            <Footer />
          </div>
        </Router>
      </div>
    )
  }
}

function FullNavbar(props) {
  return (
    <Navbar className="navigationB" variant="dark" expand="lg">
      <Navbar.Brand href="/" >DISCERE</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/profile">Profile</Nav.Link>
          <Nav.Link href="/exploreideas">Explore Ideas</Nav.Link>
          <NavDropdown title="About Us" id="basic-nav-dropdown"> 
            <NavDropdown.Item href="/mission">Mission</NavDropdown.Item>
            <NavDropdown.Item href="/contactus">Contact Us</NavDropdown.Item>
          </NavDropdown>
        </Nav>
            {
              props.user &&
              <Button onClick={props.signout} className="logbutton" variant="dark">
              Sign Out
              </Button>
            }
            {
              !props.user && 
              <Button className="logbutton" variant="dark">
                <NavLink className="thistext" to="/login">Start Learning</NavLink>
              </Button>
            }
      </Navbar.Collapse>
    </Navbar>
  )
}

function Footer() {
  return (
    <footer className="footer">
        <h5>Upperline Code 2019</h5>
    </footer>
  )
}

function Home(props) {
  return (
    <div>
      <h1>WELCOME</h1>
    </div>
  )
}

class Login extends React.Component{
  state = {
    name: '', 
    email: '', 
    password:'', 
    interests:'',
    idea:'none'
  }
  
  handleChange = event => {
    const name = event.target.name
    const value = event.target.value 
    
    this.setState({ [name]: value })
  }
  
  // handleChange = ({ target: { name, value }}) => this.setState({ [name]: value })
  
  render(){
    const { name, email, password, interests } = this.state
    return (
    <div>
    <h3>Login to DISCERE</h3>
    <button onClick={this.props.signin}>Login with Google</button>
    
    <h3>Sign Up for DISCERE</h3>
    <p>Name: <input name='name' onChange={this.handleChange} value={name} type="text"/></p>
    <p>Email: <input name='email' onChange={this.handleChange} value={email} type="email"/></p>
    <p>Password: <input name='password' onChange={this.handleChange} value={password} type="password"/></p>
    <p>Interests: <input name='interests' onChange={this.handleChange} value={interests} type="text"/></p>
    <button onClick={() => this.props.addNewLearner(name, email, password, interests)}>Sign Up</button>
    </div>
  )
  }
}

// function Login(props) {
//     return (
//       <div>
//       <h3>Login to DISCERE</h3>
//       <button onClick={props.signin}>Login with Google</button>
//       <h3>Sign Up for DISCERE</h3>
//       <p>Name: <input name='name' onChange={props.handleChange} value={props.name} type="text"/></p>
//       <p>Email: <input name='email' onChange={props.handleChange} value={props.email} type="email"/></p>
//       <p>Password: <input name='password' onChange={props.handleChange} value={props.password} type="password"/></p>
//       <p>Interests: <input name='interests' onChange={props.handleChange} value={props.interests} type="text"/></p>
//       <button onClick={props.addNewLearner}>Sign Up</button>
//       </div>
//     )
// }

function Profile(props) {
  if (!props.user) return <h2>Click Start Learning and Log in first to view profile!</h2>
  if (!props.userInfo) return <div></div>
  return (
    <div>
      <h1>{props.userInfo.name}</h1>
      <h4>Email: {props.userInfo.email}</h4>
      <h4>Interests: {props.userInfo.interests}</h4>
      {/*<h4>Researched Ideas: {props.userInfo.idea}</h4> */}
      
    </div>
  )
}

function ContactUs(props) {
  return (
    <div>
      <h1>Contact Us</h1>
      <h4>Email Us: email@gmail.com</h4>
      <h4>Call Us: phone-number</h4>
    </div>
  )
}

function Mission(props) {
  return (
    <div>
      <h1>Mission</h1>
      <p>DISCERE was made by a high school student hoping to keep track of every topic researched. It uses Google Firebase to store each user's information and the Wikipedia API to find information about whatever idea the user wants to know!</p>
    </div>
  )
}

class ExploreIdeas extends React.Component {
  state = {
    term: '',
    results: null,
    info: null
  }
  
  search = term => {
    wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
        .search(term)
        .then(data => {
          console.log(data)
          this.setState({ results: data.results })
          console.log(this.props.user)
          db.collection('ideas')
            .add({
              id: this.props.user.uid,
              idea: term
            })
            .catch(console.error)
        })
  }
  
  handleChange = event => {
    this.setState({ term: event.target.value })
  }
  
  getWikiInfo = item => {
    wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
        .page(item)
        .then(data => {
          console.log(data)
          console.log(data.html())
          // this.setState({ html: data.html() })
          // return data.html()
          return data.rawContent()
        })   
        .then( info => {
          console.log(info)
          this.setState({ fullInfo: info })
        })
        // .then( html => {
        //   this.setState({ html: html })
        // })
  }
  
  render(){
  if (!this.props.user) {
    return <h2>Click Start Learning and Log in first to begin exploring ideas!</h2>
  }    
    return (
      <div>
      <h3>Explore Popular Ideas</h3>
      <button>
      <Nav.Link href="/exploreideas/nature">Nature</Nav.Link>
      </button>
      <button>
      <Nav.Link href="/exploreideas/technology">Technology</Nav.Link>
      </button>
      <button>
      <Nav.Link href="/exploreideas/food">Food</Nav.Link>
      </button>
      <button>
      <Nav.Link href="/exploreideas/Academics">Academics</Nav.Link>
      </button>
      <h3>Research an Idea</h3>
      <div className="centerdiv">
        <Form inline>
          <FormControl onChange={this.handleChange} value={this.state.term} type="text" placeholder="Search" className="mr-sm-2" />
          <Button onClick={() => this.search(this.state.term)} variant="dark">Search</Button>
        </Form>
      </div>
      <ul>
      {
        this.state.results && this.state.results.map( result => {
          return <li onClick={() => this.getWikiInfo(result)}>{result}</li>
        })
      }
      {
        false && this.state.html && <div dangerouslySetInnerHTML={{ __html: this.state.html }} />
      }
      {
        this.state.fullInfo &&
        <div>{this.state.fullInfo}</div>
      }
      </ul>
    </div>      
    )
  }
}

// function ExploreIdeas(props) {
//   if (!props.user) {
//     return <h2>Click Start Learning and Log in first to begin exploring ideas!</h2>
//   }
  
//   const search = (term) => {
//     wiki.search(term)
//         .then(data => console.log(data.results.length));
    
//   }
  
//     return (
//       <div>
//       <h3>Explore Popular Ideas</h3>
//       <button>
//       <Nav.Link href="/exploreideas/nature">Nature</Nav.Link>
//       </button>
//       <button>
//       <Nav.Link href="/exploreideas/technology">Technology</Nav.Link>
//       </button>
//       <button>
//       <Nav.Link href="/exploreideas/food">Food</Nav.Link>
//       </button>
//       <button>
//       <Nav.Link href="/exploreideas/Academics">Academics</Nav.Link>
//       </button>
//       <h3>Specific Search</h3>
//       <div className="centerdiv">
//         <Form inline>
//           <FormControl type="text" placeholder="Search" className="mr-sm-2" />
//           <Button onClick={() => search()} variant="dark">Search</Button>
//         </Form>
//       </div>
//     </div>
//     )

// }

function Nature(props) {
  // wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
  //   .page('Batman')
  //   .then(page => {
  //     console.log(page)
  //     return page.info('alterEgo')
  //   })
  //   .then(console.log)

  if (!props.user) {
    return <h1>Log in first to begin exploring ideas!</h1>
  }
  else
    return (
      <div>
      <h1>Nature Ideas</h1>
      <li>Animals</li>
      <li>Plants</li>
      <li>Microorganisms</li>
    </div>
    )
}

function Food(props) {
  if (!props.user) {
    return <h1>Log in first to begin exploring ideas!</h1>
  }
  else
    return (
      <div>
      <h1>Food Ideas</h1>
      <li>Recipes</li>
      <li>Restaurants</li>
      <li>Nutrition</li>
    </div>
    )
}

function Technology(props) {
  if (!props.user) {
    return <h1>Log in first to begin exploring ideas!</h1>
  }
  else
    return (
      <div>
      <h1>Technology Ideas</h1>
      <li>Artificial Intelligence</li>
      <li>Computer Science</li>
      <li>Robotics</li>
    </div>
    )
}

function Academics(props) {
  if (!props.user) {
    return <h1>Log in first to begin exploring ideas!</h1>
  }
  else
    return (
      <div>
      <h1>Academic Ideas</h1>
      <li>STEAM</li>
      <li>Social Sciences</li>
      <li>Humanities</li>
    </div>
    )
}

export default App;