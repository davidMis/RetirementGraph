// Generated by CoffeeScript 1.9.0

/* Model */
var canvas, canvas_x, canvas_y, ctx, draw_graph, draw_income, height, income, mouseMoveStream, onCanvasMouseMoveStream, origin, ret, width;

ret = function(p, y, r, inflation) {
  var total, totals, year;
  year = 0;
  total = 0;
  totals = [];
  while (year < y) {
    year = year + 1;
    total = total + p;
    total = total * (1 + r) * (1 - inflation);
    totals = totals.concat(total);
  }
  return _.map(totals, function(t) {
    return Math.round(t);
  });
};

income = function(p, r) {
  return (p * r) / 12;
};


/* View */

canvas = document.getElementById("canvas_container");

ctx = canvas.getContext('2d');

origin = {
  x: 20,
  y: 400
};

width = 350;

height = 350;

draw_income = function(x, y, val) {
  var currency;
  ctx.font = "14px sans-serif";
  return ctx.fillText("Monthly Retirement Income: $" + (Math.round(val).toLocaleString(currency = "USD")), x, y);
};

draw_graph = function(vals, mx) {
  var closest_index, currency, p, points, x_scale, y_scale, _i, _len;
  ctx.clearRect(0, 0, 800, 500);
  y_scale = height / _.max(vals);
  x_scale = width / vals.length;
  points = _.map(vals, function(v, i) {
    return {
      x: i * x_scale,
      y: v * y_scale
    };
  });
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  for (_i = 0, _len = points.length; _i < _len; _i++) {
    p = points[_i];
    ctx.lineTo(origin.x + p.x, origin.y - p.y);
  }
  ctx.stroke();
  closest_index = _.reduce(_.map(points, function(p) {
    return [Math.abs(origin.x + p.x - mx), p.x];
  }), function(a, b) {
    if (a[0] < b[0]) {
      return a;
    } else {
      return b;
    }
  })[1] / x_scale;
  ctx.beginPath();
  ctx.arc(origin.x + points[closest_index].x, origin.y - points[closest_index].y, 5, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.font = "14px sans-serif";
  ctx.fillText("year: " + (closest_index + 1) + ", saved: $" + (vals[closest_index].toLocaleString(currency = "USD")), origin.x + closest_index * x_scale + 10, (origin.y - vals[closest_index] * y_scale) + 10);
  return draw_income(400, 300, income(vals[closest_index], 0.04));
};


/* Update */

canvas_x = $("#canvas_container").offset().left;

canvas_y = $("#canvas_container").offset().top;

mouseMoveStream = $(document).asEventStream("mousemove");

onCanvasMouseMoveStream = mouseMoveStream.filter(function(event) {
  var _ref, _ref1;
  return (canvas_x < (_ref = event.pageX) && _ref < canvas_x + 800) && (canvas_y < (_ref1 = event.pageY) && _ref1 < canvas_y + 500);
}).map(function(event) {
  return {
    x: event.pageX - canvas_x,
    y: event.pageY - canvas_y
  };
});

onCanvasMouseMoveStream.onValue(function(v) {
  return draw_graph(ret(5500, 40, 0.07, 0.02), v.x);
});