import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


class Input extends React.Component {
  render() {
    return(
      <form className="input">
        {this.props.typed}
      </form>
    );
  }
}

class Submit extends React.Component {
  render() {
    return(
      <button className="submit" onClick={this.props.submitted}>
        Submit
      </button>
    );
  }
}

function Entry(props) {
  return(
    <div>
      {props.content}
    </div>
  );
}

class List extends React.Component {
  renderEntry(i) {
    return(
      <Entry
        content={this.prop.entries[i]}
      />
    );
  }
  
  ranger = Array.from(Array(<>{this.props.entries.length}</>).keys())
  render() {
    const ranger = Array(<>{this.props.entries.length}</>).keys()
    return(
      <div>
      0
      </div>
    )
  }
}

class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries:[],
      content: ""
    };
  }
  
  handleSubmit() {
    const newList = this.state.entries.push(this.state.content)
    this.setState({
      entries: newList,
      content: ""
    });
  }

  render(){
    return(
      <div>
        <List
          entries = {this.state.entries}
        />
        <Submit
          submitted = {this.handleSubmit}
        />
        <Input
          typed = {this.state.content}
        />
      </div>
    )
  }
}


ReactDOM.render(
  <ToDo />,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
