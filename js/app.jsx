var PortSelector = React.createClass({
  handleChange: function(e) {
    this.props.onChange(e.target.value);
  },
  render: function() {
    portNodes = [];
    this.props.ports.map(function(port) {
      portNodes.push(
        <option key={port.value.name} value={port.value}>{port.value.name}</option>
      )
    });
    return (
        <select onChange={this.handleChange}>
          <option>-</option>
          {portNodes}
        </select>
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
      messages: [],
      input: null,
      output: null,
    };
  },

  componentDidMount: function() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({
        sysex: true
      }).then(function(midiAccess) {
        var inputData = [];
        var inputs = midiAccess.inputs.values();
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
        //TODO Handle error 
      });
    }
  },

  handleConnect: function(e) {
    e.preventDefault();
    console.log(this.state.input);
    console.log(this.state.output);
  },

  handleInputChange: function(i) {
    this.setState({input: i});
  },

  handleOutputChange: function(o) {
    this.setState({output: o});
  },

  render: function() {
    return (
      <div>
      <form className="deviceSelector" onSubmit={this.handleConnect}>
        <div>
        Input: <PortSelector ports={this.state.inputs} onChange={this.handleInputChange} ref="input" />
        </div>
        <div>
        Output: <PortSelector ports={this.state.outputs} onChange={this.handleOutputChange} ref="output" />
        </div>
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

  handleSelect: function(input, output) {
    console.log(input, output);
  },

  render: function() {
    var messageNodes = this.state.messages.map(function(message) {
      return (
        <MIDIMessage bytes={message}/>
      );
    });
    return (
      <div className="midiLogger">
        <DeviceSelector deviceSelected={this.handleSelect}/>
        {messageNodes}
      </div>
    );
  }
});


React.render(
<MIDILogger />,
document.getElementById("content")
)
