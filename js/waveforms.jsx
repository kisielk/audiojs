function sine(x) {
  return Math.sin(x * Math.PI * 2);
};

function triangle(x) {
  x = x - Math.floor(x);
  return x;
};

function saw(x) {
  x = x - Math.floor(x);
  val = x * 2;
  if (x > 0.5) {
    val += -2; 
  }
  return val;
};

var Slider = React.createClass({
  render: function() {
    return (
      <span>
        <input type="range" value={this.props.value} min={this.props.min} max={this.props.max} step={this.props.step} onChange={this.props.onChange}/>
        <span>{this.props.value}</span>
      </span>
    );
  }
});

var Square = React.createClass({
  getInitialState() {
    return {
      pulseWidth: 50,
    };
  },

  componentDidMount() {
    this.props.onChange(this.wave);
  },

  wave: function(x) {
    x = x % 1;
    return x < this.state.pulseWidth / 100 ? 1 : -1;
  },

  handleChange: function(widget, e) {
    var newState = {}
    newState[widget] = Number(e.target.value);
    this.setState(newState);
    this.props.onChange(this.wave);
  },

  render: function() {
    return (
      <div>
      <div>Ratio: <Slider value={this.state.pulseWidth} min="0" max="100" step="0.1" 
      onChange={this.handleChange.bind(this, "pulseWidth")}/>
      </div>
      </div>
    );
  },

});

var SineTriangle = React.createClass({
  getInitialState() {
    return {
      ratio: 0,
    };
  },

  wave: function(x) {
    var ratio = this.state.ratio / 100;
    return (1 - ratio) * sine(x) + ratio * triangle(x);
  },

  componentDidMount() {
    this.props.onChange(this.wave);
  },

  handleChange: function(widget, e) {
    var newState = {}
    newState[widget] = Number(e.target.value);
    this.setState(newState);
    this.props.onChange(this.wave);
  },

  render: function() {
    return (
      <div>
      <div>Ratio: <Slider key="ratio" value={this.state.ratio} min="0" max="100" step="0.1" 
      onChange={this.handleChange.bind(this, "ratio")}/>
      </div>
      </div>
    );
  },
});

var Saw = React.createClass({
  getInitialState() {
    return {
      amplitude: 0,
      ratio: 1,
    };
  },

  wave: function(x) {
    return (1 - this.state.amplitude) * saw(x) + this.state.amplitude * saw(x * this.state.ratio);
  },

  componentDidMount() {
    this.props.onChange(this.wave);
  },

  handleChange: function(widget, e) {
    var newState = {}
    newState[widget] = Number(e.target.value);
    this.setState(newState);
    this.props.onChange(this.wave);
  },

  render: function() {
    return (
      <div>
      <div>Amplitude: <Slider key="amplitude" value={this.state.amplitude} min="0" max="1.0" step="0.01" 
      onChange={this.handleChange.bind(this, "amplitude")}/>
      </div>
      <div>Ratio: <Slider key="ratio" value={this.state.ratio} min="1" max="100" step="0.1" 
      onChange={this.handleChange.bind(this, "ratio")}/>
      </div>
      </div>
    );
  }
});

var Canvas = React.createClass({
  componentDidMount: function() {
    var context = this.getDOMNode().getContext("2d");
    this.paint(context);
  },

  componentDidUpdate: function() {
    var context = this.getDOMNode().getContext("2d");
    context.clearRect(0, 0, this.props.width, this.props.height);
    this.paint(context);
  },

  paint: function(ctx) {
    var center = this.props.height / 2;
    ctx.moveTo(0, center);
    ctx.clearRect(0, 0, this.props.width, this.props.height);
    ctx.beginPath();
    var period = this.props.width / 2;
    for (var i = 0; i <= this.props.width; i++) {
        ctx.lineTo(i, center - (center * 0.9) * this.props.waveFunc(i / period));
    }
    ctx.stroke();
    ctx.closePath();
  },

  render: function() {
    return (
      <canvas width={this.props.width} height={this.props.height} style={{border: "1px solid black"}}></canvas>
    )
  },
});

var Waveforms = React.createClass({
  getInitialState: function() {
    return {
      waveFunc: function(x) { return 0 },
      waveform: "saw",
    };
  },

  selectWaveform: function(w) {
    this.setState({waveform: w.target.value});
  },

  newWave: function(wave) {
    this.setState({waveFunc: wave});
  },

  render: function() {
    var waveform;
    if (this.state.waveform == "sine") {
      waveform = <SineTriangle onChange={this.newWave}/>
    } else if (this.state.waveform == "saw") {
      waveform = <Saw onChange={this.newWave}/>
    } else if (this.state.waveform == "square") {
      waveform = <Square onChange={this.newWave}/>
    }
    return (
      <div className="Waveforms">
      <div>
      <Canvas width={400} height={300} waveFunc={this.state.waveFunc}/>
      </div>
      <div>
      <select onChange={this.selectWaveform} value={this.state.waveform}>
      <option value="sine">Sine</option>
      <option value="saw">Saw</option>
      <option value="square">Square</option>
      </select>
      </div>
      {waveform}
      </div>
    )
  }
});

React.render(
  <Waveforms />,
  document.getElementById("content")
);
