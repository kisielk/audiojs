var InputSelector = React.createClass({
  render: function() {
    inputNodes = [];
    this.props.inputs.map(function(input) {
      inputNodes.push(
        <option key={input.value.name}>{input.value.name}</option>
      )
    });
    return (
      <div className="inputSelector">Input: 
        <select>
          {inputNodes}
        </select>
      </div>
    );
  }
});

var OutputSelector = React.createClass({
  render: function() {
    outputNodes = [];
    this.props.outputs.map(function(output) {
      outputNodes.push(
        <option key={output.value.name}>{output.value.name}</option>
      )
    });
    return (
      <div className="outputSelector">Output: 
        <select>
          {outputNodes}
        </select>
      </div>
    );
  }
});

var MIDIMessage = React.createClass({
  render: function() {
    return (
      <div className="midiMessage">
        {this.props.bytes}
      </div>
    );
  }
});

var DeviceSelector = React.createClass({
  getInitialState: function() {
    return {
      inputs: [],
      outputs: [],
      messages: []
    };
  },

  componentDidMount: function() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({
        sysex: true
      }).then(function(midiAccess) {
        var inputData = [];
        var inputs = midiAccess.inputs.values();
        console.log(inputs);
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
          inputData.push(input);
        }
        var outputData = [];
        var outputs = midiAccess.outputs.values();
        for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
          outputData.push(output);
        }
        this.setState({inputs: inputData, outputs: outputData});
      }.bind(this), function(e) {
      
      });
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    console.log("submit!");
  },

  render: function() {
    return (
      <div>
      <form className="deviceSelector" onSubmit={this.handleSubmit}>
        <InputSelector inputs={this.state.inputs} />
        <OutputSelector outputs={this.state.outputs} />
        <input type="submit" value="Connect" />
      </form>
      </div>
    );
  }
});

var MIDILogger = React.createClass({
  getInitialState: function() {
    return {messages: []};
  },

  render: function() {
    var messageNodes = this.state.messages.map(function(message) {
      return (
        <MIDIMessage bytes={message}/>
      );
    });
    return (
      <div className="midiLogger">
        <DeviceSelector/>
        {messageNodes}
      </div>
    );
  }
});


React.render(
<MIDILogger />,
document.getElementById("content")
)
