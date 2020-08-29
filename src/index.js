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

function Finish (props) {
    return(
        <td>
            <button className="finish" onClick={() => props.finish(props.i)}>
                finished
            </button>
        </td>
    );
}

function Clear(props) {
    return(
        <td>
            <button className="clear" onClick={() => props.clear(props.i)}>
                clear
            </button>
        </td>
    )
}

class Entry extends React.Component {
    render() {
        let elapsed
        if(this.props.class === 'cross'){
            elapsed =  (this.props.stopTimes[this.props.i] - this.props.startTimes[this.props.i])
        }
        else{
            elapsed =  (this.props.curTime - this.props.startTimes[this.props.i])
        }
        const seconds = returnTime(elapsed, 'second').toString()
        const minutes = returnTime(elapsed, 'minute').toString()
        const hours = returnTime(elapsed, 'hour').toString()
        timeAlert(this.props.curTime - this.props.startTimes[this.props.i], this.props.content)
        return(
            <tr>
              <td className={this.props.class}>
                {this.props.content}
              </td>
              <td>
                  {hours}:{minutes}:{seconds} elapsed
              </td>
              <Finish
                  finish={this.props.finished}
                  i={this.props.i}
              />
              <Clear
                  clear={this.props.clear}
                  i={this.props.i}
              />
            </tr>
        );
    }
}

class List extends React.Component {
  renderEntry(i) {
    return(
      <Entry
        class = {this.props.classes[i]}
        content = {this.props.entries[i]}
        curTime = {this.props.curTime}
        startTimes = {this.props.startTimes}
        stopTimes = {this.props.stopTimes}
        finished = {this.props.finished}
        clear = {this.props.clear}
        i= {i}
      />
    );
  }
  
  render() {
    return(
      <React.Fragment>
      {this.props.ranger.map(j => {
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
      stopTimes: [],
      curTime: new Date(),
      classes: [],
      ranger: []
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
    const newClasses = this.state.classes.concat('un-crossed')
    const newRanger = this.state.ranger.concat(this.state.ranger.length)
    const newStops= this.state.ranger.concat(new Date())
    this.setState({
      entries: newList,
      content: "",
      startTimes: newDates,
      stopTimes: newStops,
      classes: newClasses,
      ranger: newRanger
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

  finished(i) {
      const new_list = this.state.ranger.map(
          j => ((i === j) ? 'cross' : this.state.classes[j]))
      const new_stops = this.state.ranger.map(
          j => ((i === j) ? new Date() : this.state.stopTimes[j]))
      this.setState({
          classes: new_list,
          stopTimes: new_stops
      })
  }

  clear(i) {
      const new_entries = removeIndex(this.state.entries, i)
      const new_startTimes = removeIndex(this.state.startTimes, i)
      const new_stopTimes = removeIndex(this.state.stopTimes, i)
      const new_classes = removeIndex(this.state.classes, i)
      const new_ranger = withoutLast(this.state.ranger)
      this.setState({
          entries: new_entries,
          startTimes: new_startTimes,
          stopTimes: new_stopTimes,
          classes: new_classes,
          ranger: new_ranger
      })
  }

  render(){
    return(
      <div>
        <table>
          <List
            classes = {this.state.classes}
            curTime = {this.state.curTime}
            clear= {this.clear.bind(this)}
            entries = {this.state.entries}
            finished = {this.finished.bind(this)}
            ranger = {this.state.ranger}
            startTimes={this.state.startTimes}
            stopTimes={this.state.stopTimes}
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

function removeIndex(list, j){
    let toReturn = []
    var i
    for (i = 0; i < list; i++){
        if(i !== j){
            toReturn = toReturn.concat(list[i])
        }
    }
    return toReturn
}

function withoutLast(list){
   let toReturn = []
    var i
    for (i = 0; i < list; i++){
        if(i !== list.length - 1){
            toReturn = toReturn.concat(list[i])
        }
    }
    return toReturn
}

ReactDOM.render(
  <ToDo />,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
