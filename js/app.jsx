var PortSelector = React.createClass({
  handleChange: function(e) {
    this.props.onChange(e.target.value);
  },
  render: function() {
    portNodes = [];
    this.props.ports.map(function(port) {
      portNodes.push(
        <option key={port.name} value={port.id}>{port.name}</option>
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

  scanDevices: function() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({
        sysex: true
      }).then(function(midiAccess) {
        var inputData = [];
        var inputs = midiAccess.inputs.values();
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
          inputData.push(input.value);
        }
        var outputData = [];
        var outputs = midiAccess.outputs.values();
        for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
          outputData.push(output.value);
        }
        this.setState({inputs: inputData, outputs: outputData});
      }.bind(this), function(e) {
        //TODO Handle error 
      });
    }
  },

  componentDidMount: function() {
    this.scanDevices();
  },

  handleConnect: function(e) {
    e.preventDefault();
    this.props.onConnect(this.state.input, this.state.output);
  },

  handleRescan: function(e) {
    e.preventDefault();
    this.scanDevices();
  },

  handleInputChange: function(id) {
    var inputs = this.state.inputs.filter(function(i) {
      return i.id == id;                                 
    })
    this.setState({input: inputs[0]});
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
        <input type="button" value="Rescan" onClick={this.handleRescan} />
        <input type="submit" value="Connect" />
      </form>
      </div>
    );
  }
});

var MIDILogger = React.createClass({
  getInitialState: function() {
    return {
      input: null,
      output: null,
      messages: [],
    };
  },

  handleConnect: function(input, output) {
    // TODO: Disconnect any existing connections
    input.onmidimessage = this.onMessage;
    this.setState({input: input, output: output});
    console.log(input, output);
  },

  onMessage: function(m) {
    console.log(m);
    this.setState({messages: this.state.messages.concat([m])});
  },

  render: function() {
    var messageNodes = this.state.messages.map(function(message) {
      return (
        <MIDIMessage bytes={message.data}/>
      );
    });
    return (
      <div className="midiLogger">
        <DeviceSelector onConnect={this.handleConnect}/>
        {messageNodes}
      </div>
    );
  }
});


React.render(
<MIDILogger />,
document.getElementById("content")
)
