import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';


class Input extends React.Component {
  render() {
    return(
      <form className="input">
        <input type="text" value={this.props.typed} 
          onChange={this.props.changes} onKeyPress={this.props.enterCheck}
        />
      </form>
    );
  }
}

class Submit extends React.Component {
  render() {
    return(
      <button className="submit" onClick={() => this.props.submitted()}>
        Submit
      </button>
    );
  }
}

function Entry(props) {
  let elapsed =  (props.curTime - props.startTimes[props.i])
  const seconds = returnTime(elapsed, 'second').toString()
  const minutes = returnTime(elapsed, 'minute').toString()
  const hours = returnTime(elapsed, 'hour').toString()
  timeAlert(props.curTime - props.startTimes[props.i], props.content)
  return(
    <tr>
      <td>
        {props.content}
      </td>
      <td>
          {hours} hours {minutes} minutes {seconds} seconds elapsed
      </td>
    </tr> 
  );
}

class List extends React.Component {
  renderEntry(i) {
    return(
      <Entry
        content= {this.props.entries[i]}
        curTime = {this.props.curTime}
        startTimes = {this.props.startTimes}
        i= {i}
      />
    );
  }
  
  render() {
    const length_help= this.props.entries.length
    const ranger = Array.from(Array(length_help).keys())

    return(
      <React.Fragment>
      {ranger.map(j => {
        return (
          this.renderEntry(j)
        );
      })}
      </React.Fragment>
    );
  }
}

class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      content: "",
      startTimes: [],
      curTime: new Date(),
    };
  }

  componentDidMount() {
      setInterval(() => {
        this.setState({
            curTime: new Date()
        })
      }, 1000)
    }
  
  handleSubmit() {
    const newList = this.state.entries.concat(this.state.content)
    const newDates = this.state.startTimes.concat(new Date())
    this.setState({
      entries: newList,
      content: "",
      startTimes: newDates
    });
  }

  handleChange(event){
    this.setState({
      content: event.target.value
    });
  }

  enterCheck(event) {
      if(event.key === 'Enter'){
          this.handleSubmit()
          event.preventDefault();
      }
  }

  render(){
    return(
      <div>
        <table>
          <List
            entries = {this.state.entries}
            curTime = {this.state.curTime}
            startTimes={this.state.startTimes}
          />
        </table>
        <Input
          typed = {this.state.content}
          changes= {this.handleChange.bind(this)}
          enterCheck = {this.enterCheck.bind(this)}
        />
        <Submit
          submitted = {() => this.handleSubmit()}
        />
      </div>
    )
  }
}

function returnTime(duration, unit){
    duration += 1000
    if(unit === 'second'){
        return Math.floor((duration / 1000) % 60)
    }
    else if (unit === 'minute'){
        return Math.floor((duration / (1000 * 60)) % 60)
    }
    else if (unit === 'hour'){
        return Math.floor((duration / (1000 * 60 * 60)) % 24)
    }
}

function isInt(num){
    return num % 1 === 0
}

function timeAlert(elapsed, content){
    const minuteCheck =  (elapsed / (1000 * 60)) % 60
    const hourCheck =  (elapsed / (1000 * 60 * 60)) % 24
    if(isInt(minuteCheck)) {
        if (isInt(hourCheck) && hourCheck > 1) {
            alert(hourCheck.toString() +
                'hours since you said you would' + content)
        } else if (isInt(hourCheck) && hourCheck === 1) {
            alert(hourCheck.toString() +
                'hour since you said you would' + content)
        } else if (isInt(minuteCheck) && minuteCheck > 1) {
            alert(minuteCheck.toString() +
                'minutes since you said you would' + content)
        } else if (isInt(minuteCheck) && minuteCheck === 1) {
            alert(minuteCheck.toString() +
                'minute since you said you would' + content)
        }
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
