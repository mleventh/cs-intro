// Generated by CoffeeScript 1.3.3
(function() {
  var Alias, Bar, L1Bar, N, abs, alias, animate, bar, colors, computeAll, f, f_coeff, f_text, height, id, k, l1Bar, m, tmax, tmin, width, _i, _len, _ref;

  _ref = ["func", "alias_graph", "l1_bar"];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    id = _ref[_i];
    $("#" + id).empty();
  }

  abs = function(z) {
    var k, _j, _ref1, _results;
    _results = [];
    for (k = _j = 0, _ref1 = z.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(Math.abs(z[k]));
    }
    return _results;
  };

  m = [20, 20, 20, 80];

  width = 400 - m[1] - m[3];

  height = 300 - m[0] - m[2];

  N = 27;

  tmin = -2;

  tmax = 3;

  colors = ["red", "blue", "green"];

  f_coeff = function(k) {
    return [k, k / 2, 1 - k / 2];
  };

  f = function(t, k) {
    var z;
    return z = numeric.dot(f_coeff(k), [1, t, t * t]);
  };

  f_text = function(k) {
    var a, p, s, tr;
    p = f_coeff(k);
    a = function(n) {
      return Math.round(100 * p[n]) / 100;
    };
    s = function(n) {
      return "<span style='color: " + colors[n] + "'>" + (a(n)) + "</span>";
    };
    tr = function(td1, td2) {
      return "<tr><td style='text-align:right;'>" + td1 + "</td><td>" + td2 + "</td><tr/>";
    };
    return "<table class='func'>\n" + (tr("f(t) = ", s(0))) + "\n" + (tr("+", s(1) + "t")) + "\n" + (tr("+", s(2) + "t<sup>2</sup>")) + "\n</table>";
  };

  Bar = function(k) {
    this.margin = {
      top: 20,
      right: 30,
      bottom: 20,
      left: 50
    };
    this.width = 120 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;
    this.stack = d3.layout.stack().values(function(d) {
      return d.values;
    });
    this.compute = function(k) {
      var b;
      b = function(n, k) {
        return {
          key: "Key_" + n,
          values: [
            {
              "x": 0,
              "y": abs(f_coeff(k))[n]
            }
          ]
        };
      };
      this.data = [b(2, k), b(1, k), b(0, k)];
      this.keys = this.data[0].values.map(function(item) {
        return item.x;
      });
      return this.layers = this.stack(this.data);
    };
    this.compute(k);
    return this;
  };

  Alias = function(k) {
    var f0, f1, f_axis, f_to_px, fdata, n_to_t, samples, t_axis, t_to_px;
    t_to_px = d3.scale.linear().domain([tmin, tmax]).range([0, width]);
    f_to_px = d3.scale.linear().domain([0, 5]).range([height, 0]);
    n_to_t = d3.scale.linear().domain([0, N]).range([tmin, tmax]);
    t_axis = d3.svg.axis().scale(t_to_px).ticks(6);
    f_axis = d3.svg.axis().scale(f_to_px).orient("left").ticks(6);
    this.f_data = function(k) {
      var _j, _results;
      return (function() {
        _results = [];
        for (var _j = 0; 0 <= N ? _j < N : _j > N; 0 <= N ? _j++ : _j--){ _results.push(_j); }
        return _results;
      }).apply(this).map(function(d) {
        return {
          tn: n_to_t(d),
          fn: f(n_to_t(d), k)
        };
      });
    };
    fdata = this.f_data(k);
    this.f_svg = d3.svg.line().x(function(d) {
      return t_to_px(d.tn);
    }).y(function(d) {
      return f_to_px(d.fn);
    });
    f0 = [t_to_px(-1), f_to_px(f(-1, k))];
    f1 = [t_to_px(2), f_to_px(f(2, k))];
    samples = [f0, f1];
    this.graph = d3.select("#alias_graph").append("svg").attr("width", width + m[1] + m[3]).attr("height", height + m[0] + m[2]).append("g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    this.graph.append("g").attr("class", "axis").attr("transform", "translate(0," + height + ")").call(t_axis);
    this.graph.append("g").attr("class", "axis").attr("transform", "translate(-25,0)").call(f_axis);
    this.graph.append("path").attr("d", this.f_svg(fdata)).attr("id", "poly");
    this.graph.selectAll("circle").data(samples).enter().append("circle").attr("cx", function(d) {
      return d[0];
    }).attr("cy", function(d) {
      return d[1];
    }).attr("r", 5);
    this.compute = function(k) {
      fdata = this.f_data(k);
      return this.graph.select("#poly").transition().attr("d", this.f_svg(fdata));
    };
    return this;
  };

  L1Bar = function(bar) {
    var f_axis, t_axis, x, y;
    this.svg = d3.select("#l1_bar").append("svg").attr("width", bar.width + bar.margin.left + bar.margin.right).attr("height", bar.height + bar.margin.top + bar.margin.bottom).append("g").attr("transform", "translate(" + bar.margin.left + "," + bar.margin.top + ")");
    this.layer = this.svg.selectAll(".layer").data(bar.layers).enter().append("g").attr("class", "layer").style("fill", function(d, i) {
      return colors[2 - i];
    });
    this.x = d3.scale.ordinal().domain(bar.keys).rangeRoundBands([0, bar.width], 0.08);
    this.y = d3.scale.linear().domain([0, 5]).range([bar.height, 0]);
    x = this.x;
    y = this.y;
    this.layer.selectAll("rect").data(function(d) {
      return d.values;
    }).enter().append("rect").attr("fill-opacity", 0.5).attr("stroke", "#000").attr("width", x.rangeBand()).attr("x", function(d) {
      return d.x;
    }).attr("y", function(d) {
      return y(d.y0 + d.y);
    }).attr("height", function(d) {
      return y(d.y0) - y(d.y0 + d.y);
    });
    t_axis = d3.svg.axis().scale(x).tickSize(0).tickPadding(6).orient("bottom");
    f_axis = d3.svg.axis().scale(y).ticks(6).tickSize(0).tickPadding(6).orient("left");
    this.svg.append("g").attr("class", "axis").call(f_axis);
    this.compute = function() {
      this.layer = this.svg.selectAll(".layer").data(bar.layers);
      y = this.y;
      return this.layer.selectAll("rect").data(function(d) {
        return d.values;
      }).attr("y", function(d) {
        return y(d.y0 + d.y);
      }).attr("height", function(d) {
        return y(d.y0) - y(d.y0 + d.y);
      });
    };
    return this;
  };

  k = -1;

  bar = new Bar(k);

  alias = new Alias(k);

  l1Bar = new L1Bar(bar);

  d3.select("#func").html(f_text(k));

  computeAll = function(k) {
    alias.compute(k);
    bar.compute(k);
    l1Bar.compute();
    return d3.select("#func").html(f_text(k));
  };

  animate = function(from, to, time) {
    var run, start, timer;
    start = new Date().getTime();
    run = function() {
      var step;
      step = Math.min(1, (new Date().getTime() - start) / time);
      k = from + step * (to - from);
      computeAll(k);
      $("#slider").val(k);
      if (step === 1) {
        return clearInterval(timer);
      }
    };
    return timer = setInterval((function() {
      return run();
    }), 100);
  };

  setTimeout((function() {
    return animate(-0.9, 2.9, 3000);
  }), 2800);

  $("#slider").on("change", function() {
    k = parseFloat(d3.select("#slider").property("value"));
    return computeAll(k);
  });

  d3.selectAll("#sparse1").on("click", function() {
    k = 0;
    computeAll(k);
    $("#slider").val(k);
    return $("#slider").focus();
  });

}).call(this);
