function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

    // Save current buffer state.
    buffer.save();

    // Setup translate/rotation for wall drawing.
    buffer.translate(
      x,
      y
    );
    buffer.rotate(rotation * pi_divide_180);

    // Draw walls.
    draw_walls();

    // Restore buffer state.
    buffer.restore();

    // Draw current speed.
    buffer.font = '23pt sans-serif';
    buffer.textAlign = 'left';
    buffer.textBaseline = 'top';
    buffer.fillStyle = '#fff';
    buffer.fillText(
      speed + ' m/s',
      5,
      5
    );

    canvas.clearRect(
      0,
      0,
      width,
      height
    );
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );

    animationFrame = window.requestAnimationFrame(draw);
}

function draw_walls(){
    var loop_counter = 3;
    do{
        buffer.beginPath();
        buffer.moveTo(
          0,
          0
        );
        buffer.lineTo(
          wall_splits[[0,0,2,4,][loop_counter]],
          wall_splits[[1,1,3,5,][loop_counter]]
        );
        buffer.lineTo(
          wall_splits[[2,4,6,6,][loop_counter]],
          wall_splits[[3,5,7,7,][loop_counter]]
        );
        buffer.closePath();
        buffer.fillStyle = colors[0][loop_counter];
        buffer.fill();
    }while(loop_counter--);

    buffer.beginPath();
    buffer.moveTo(
      -x,
      -x
    );
    buffer.lineTo(
      wall_splits[0],
      wall_splits[1]
    );
    buffer.lineTo(
      wall_splits[2],
      wall_splits[3]
    );
    buffer.lineTo(
      x,
      -x
    );
    buffer.closePath();
    buffer.fillStyle = colors[1][0];
    buffer.fill();

    buffer.beginPath();
    buffer.moveTo(
      -x,
      -x
    );
    buffer.lineTo(
      wall_splits[0],
      wall_splits[1]
    );
    buffer.lineTo(
      wall_splits[4],
      wall_splits[5]
    );
    buffer.lineTo(
      -x,
      x
    );
    buffer.closePath();
    buffer.fillStyle = colors[1][1];
    buffer.fill();

    buffer.beginPath();
    buffer.moveTo(
      x,
      -x
    );
    buffer.lineTo(
      wall_splits[2],
      wall_splits[3]
    );
    buffer.lineTo(
      wall_splits[6],
      wall_splits[7]
    );
    buffer.lineTo(
      x,
      x
    );
    buffer.closePath();
    buffer.fillStyle = colors[1][2];
    buffer.fill();

    buffer.beginPath();
    buffer.moveTo(
      -x,
      x
    );
    buffer.lineTo(
      wall_splits[4],
      wall_splits[5]
    );
    buffer.lineTo(
      wall_splits[6],
      wall_splits[7]
    );
    buffer.lineTo(
      x,
      x
    );
    buffer.closePath();
    buffer.fillStyle = colors[1][3];
    buffer.fill();
}

function logic(){
    if(key_left){
        rotation -= speed / 10 + 1;
    }
    if(key_right){
        rotation += speed / 10 + 1;
    }

    if(key_speedminus
      && speed > 0){
        speed -= 1;
    }
    if(key_speedplus){
        speed += 1;
    }

    var do_split = 0;

    // Move wall split location.
    var loop_counter = 3;
    do{
        wall_splits[loop_counter * 2] += wall_splits[loop_counter * 2] >= 0
          ? speed
          : -speed;
        wall_splits[loop_counter * 2 + 1] += wall_splits[loop_counter * 2 + 1] >= 0
          ? speed
          : -speed;

        // Check if wall split reached edge of screen.
        if(wall_splits[loop_counter * 2] < -x
          || wall_splits[loop_counter * 2] > x){
            // Reset wall splits.
            wall_splits[loop_counter * 2] = [
              -2,
              -2,
              2,
              -2,
              -2,
              2,
              2,
              2,
            ][loop_counter * 2];
            wall_splits[loop_counter * 2 + 1] = [
              -2,
              -2,
              2,
              -2,
              -2,
              2,
              2,
              2,
            ][loop_counter * 2 + 1];

            do_split = 1;
        }
    }while(loop_counter--);

    if(do_split){
        colors[1] = colors[0];
        colors[0] = [
          random_hex(),
          random_hex(),
          random_hex(),
          random_hex(),
        ];
    }
}

function random_hex(){
    var choices = '0123456789abcdef';
    return '#'
      + choices.charAt(Math.floor(Math.random() * 16))
      + choices.charAt(Math.floor(Math.random() * 16))
      + choices.charAt(Math.floor(Math.random() * 16));
}

function reset(){
    if(!confirm('Reset settings?')){
        return;
    }

    document.getElementById('audio-volume').value = 1;
    document.getElementById('key-slowdown').value = 'S';
    document.getElementById('key-speedup').value = 'W';
    document.getElementById('movement-keys').value = 'AD';
    document.getElementById('ms-per-frame').value = 30;

    save();
}

function resize(){
    if(mode <= 0){
        return;
    }

    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;
    y = height / 2;

    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;
    x = width / 2;
}

function save(){
    // Save audio-volume setting.
    if(document.getElementById('audio-volume').value == 1){
        window.localStorage.removeItem('Tubes-2D3D.htm-audio-volume');

    }else{
        settings['audio-volume'] = parseFloat(document.getElementById('audio-volume').value);
        window.localStorage.setItem(
          'Tubes-2D3D.htm-audio-volume',
          settings['audio-volume']
        );
    }

    // Save key-slowdown setting.
    if(document.getElementById('key-slowdown').value == 'S'){
        window.localStorage.removeItem('Tubes-2D3D.htm-key-slowdown');

    }else{
        settings['key-slowdown'] = document.getElementById('key-slowdown').value;
        window.localStorage.setItem(
          'Tubes-2D3D.htm-key-slowdown',
          settings['key-slowdown']
        );
    }

    // Save key-speedup setting.
    if(document.getElementById('key-speedup').value == 'W'){
        window.localStorage.removeItem('Tubes-2D3D.htm-key-speedup');

    }else{
        settings['key-speedup'] = document.getElementById('key-speedup').value;
        window.localStorage.setItem(
          'Tubes-2D3D.htm-key-speedup',
          settings['key-speedup']
        );
    }

    // Save movement-keys setting.
    if(document.getElementById('movement-keys').value == 'AD'){
        window.localStorage.removeItem('Tubes-2D3D.htm-movement-keys');

    }else{
        settings['movement-keys'] = document.getElementById('movement-keys').value;
        window.localStorage.setItem(
          'Tubes-2D3D.htm-movement-keys',
          settings['movement-keys']
        );
    }

    // Save ms-per-frame setting.
    if(document.getElementById('ms-per-frame').value == 30
      || isNaN(document.getElementById('ms-per-frame').value)
      || document.getElementById('ms-per-frame').value < 1){
        window.localStorage.removeItem('Tubes-2D3D.htm-ms-per-frame');
        document.getElementById('ms-per-frame').value = 30;

    }else{
        settings['ms-per-frame'] = parseInt(document.getElementById('ms-per-frame').value);
        window.localStorage.setItem(
          'Tubes-2D3D.htm-ms-per-frame',
          settings['ms-per-frame']
        );
    }
}

function setmode(newmode){
    window.cancelAnimationFrame(animationFrame);
    clearInterval(interval);

    mode = newmode;

    // New game mode.
    if(mode > 0){
        save();

        key_left = false;
        key_right = false;
        key_speedminus = false;
        key_speedplus = false;
        speed = 10;
        rotation = 0;

        document.getElementById('page').innerHTML = '<canvas id=canvas></canvas><canvas id=buffer style=display:none></canvas>';

        buffer = document.getElementById('buffer').getContext('2d');
        canvas = document.getElementById('canvas').getContext('2d');

        resize();

        wall_splits = [
          -2,
          -2,
          2,
          -2,
          -2,
          2,
          2,
          2,
        ];

        // Set initial tube colors.
        colors = [
          ['#f0f', '#06f', '#ff0', '#f60'],// Initial
          ['#0f0', '#f00', '#00f', '#0ff'],// First swap
        ];

        animationFrame = window.requestAnimationFrame(draw);
        interval = setInterval(
          'logic()',
          settings['ms-per-frame']
        );

    // Main menu mode.
    }else{
        buffer = 0;
        canvas = 0;

        document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><b>Tubes-2D3D.htm</b></div><hr><div class=c style=color:#f00>SEIZURE WARNING!<br>FLASHING COLORS!</div><hr><div class=c><ul><li><a onclick=setmode(1)>Make Mama Sick</a></ul></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input disabled style=border:0 value=ESC>Main Menu<br><input id=movement-keys maxlength=2 value='
          + settings['movement-keys'] + '>Move ←→<br><input id=key-slowdown maxlength=1 value='
          + settings['key-slowdown'] + '>Speed--<br><input id=key-speedup maxlength=1 value='
          + settings['key-speedup'] + '>Speed++</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
          + settings['audio-volume'] + '>Audio<br><input id=ms-per-frame value='
          + settings['ms-per-frame'] + '>ms/Frame<br><a onclick=reset()>Reset Settings</a></div></div>';
    }
}

var animationFrame = 0;
var buffer = 0;
var canvas = 0;
var colors = [];
var height = 0;
var interval = 0;
var j = 0;
var key_left = false;
var key_right = false;
var key_speedminus = false;
var key_speedplus = false;
var mode = 0;
var mx = 0;
var my = 0;
var pi_divide_180 = Math.PI / 180;
var px = 0;
var py = 0;
var rotation = 0;
var settings = {
  'audio-volume': window.localStorage.getItem('Tubes-2D3D.htm-audio-volume') === null
    ? 1
    : parseFloat(window.localStorage.getItem('Tubes-2D3D.htm-audio-volume')),
  'key-slowdown': window.localStorage.getItem('Tubes-2D3D.htm-key-slowdown') === null
    ? 'S'
    : window.localStorage.getItem('Tubes-2D3D.htm-key-slowdown'),
  'key-speedup': window.localStorage.getItem('Tubes-2D3D.htm-key-speedup') === null
    ? 'W'
    : window.localStorage.getItem('Tubes-2D3D.htm-key-speedup'),
  'movement-keys': window.localStorage.getItem('Tubes-2D3D.htm-movement-keys') === null
    ? 'AD'
    : window.localStorage.getItem('Tubes-2D3D.htm-movement-keys'),
  'ms-per-frame': window.localStorage.getItem('Tubes-2D3D.htm-ms-per-frame') === null
    ? 30
    : parseInt(window.localStorage.getItem('Tubes-2D3D.htm-ms-per-frame')),
};
var speed = 0;
var wall_splits = [];
var width = 0;
var x = 0;
var y = 0;

setmode(0);

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: return to main menu.
    if(key === 27){
        setmode(0);

    }else{
        key = String.fromCharCode(key);

        if(key === settings['movement-keys'][0]){
            key_left = true;

        }else if(key === settings['movement-keys'][1]){
            key_right = true;

        }else if(key === settings['key-slowdown']){
            key_speedminus = true;

        }else if(key === settings['key-speedup']){
            key_speedplus = true;
        }
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings['movement-keys'][0]){
        key_left = false;

    }else if(key === settings['movement-keys'][1]){
        key_right = false;

    }else if(key === settings['key-slowdown']){
        key_speedminus = false;

    }else if(key === settings['key-speedup']){
        key_speedplus = false;
    }
};

window.onresize = resize;
