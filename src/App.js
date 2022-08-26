import './App.css';
import { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const app = new Clarifai.App({
	apiKey: 'fcfa6c128378498ca1722ad6667c83ea'
});

class App extends Component {
	constructor() {
    	super();
    	this.state = {
        	input: '',
			imageUrl: ''
    	}
  	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	// HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
		// A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
		// for the Face Detect Mode: https://www.clarifai.com/models/face-detection
		// If that isn't working, then that means you will have to wait until their servers are back up. Another solution
		// is to use a different version of their model that works like the ones found here: https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js
		// so you would change from:
		// .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
		// to:
		// .predict('53e1df302c079b3db8a0a36033ed2d15', this.state.input)
	onButtonSubmit = () => {
		console.log('click');
		this.setState({imageUrl: this.state.input});
		app.models
		  .predict(
			Clarifai.FACE_DETECT_MODEL,
			'https://samples.clarifai.com/face-det.jpg')
		  .then(response => {
			console.log('hi', response)
			if (response) {
			  fetch('http://localhost:3000/image', {
				method: 'put',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
				  id: this.state.user.id
				})
			  })
				.then(response => response.json())
				.then(count => {
				  this.setState(Object.assign(this.state.user, { entries: count}))
				})
	
			}
			this.displayFaceBox(this.calculateFaceLocation(response))
		  })
		  .catch(err => console.log(err));
	  }

	render() {
		return (
			<div className="App">
         		<Particles className='particles' params={particlesOptions}/>
		    	<Navigation />
		    	<Logo />
		    	<Rank />
		    	<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
				<FaceRecognition imageUrl={this.state.imageUrl}/>
			</div>
		);
	}
}


export default App;
