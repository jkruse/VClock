/**
 * Created by IntelliJ IDEA.
 * User: Jakob Kruse
 * Date: 28-04-12
 * Time: 12:42
 */

(function () {
    var clock, time, timer, speed, frequency;

    function initialize() {
        // Load persisted data
        setSize(window.localStorage.getItem('size') || 200);
        setSpeed(window.localStorage.getItem('speed') || 6);
        setFrequency(window.localStorage.getItem('frequency') || 10);

        // Initialize clock
        clock = document.getElementById('clock');
        time = new Date();
        timer = null;
        update();
        render();

        // Set up controls
        document.getElementById('start').addEventListener('click', start);
        document.getElementById('stop').addEventListener('click', stop);
        document.getElementById('update').addEventListener('click', update);
        document.getElementById('set-time').addEventListener('click', setTime);

        // Keyboard event handling
        window.addEventListener('keydown', onKeyDown);
    }

    function render() {
        var text = time.toLocaleTimeString();
        if (frequency === 10) {
            text = text.substr(0, 7) + '0';
        }
        if (frequency === 60) {
            text = text.substr(0, 5);
        }
        clock.innerText = text;
    }

    function clockwork() {
        // Add interval
        time.setTime(time.getTime() + 1000 * frequency);

        // Render updated clock
        render();
    }

    function start() {
        if (timer === null) {
            render();
            timer = window.setInterval(clockwork, 1000 * frequency / speed);
        }
    }

    function stop() {
        if (timer !== null) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    function update() {
        var s = getSpeed(), f = getFrequency(), restart = false;

        // Check if we need to restart the clock
        if ((s !== speed || f !== frequency) && timer !== null) {
            restart = true;
        }

        // Update values
        speed = s;
        frequency = f;
        clock.style.fontSize = getSize() + 'pt';

        // Restart or re-render clock
        if (restart) {
            stop();
            start();
        } else {
            render();
        }

        // Persist data
        window.localStorage.setItem('size', getSize());
        window.localStorage.setItem('speed', speed);
        window.localStorage.setItem('frequency', frequency);
    }

    function setTime() {
        var newTime = prompt('Set clock to (hh:mm):', '00:00'),
            hh = parseInt(newTime.substr(0, 2), 10) || 0,
            mm = parseInt(newTime.substr(3, 2), 10) || 0;
        time.setHours(hh, mm, 0);
        render();
    }

    function getSize() {
        return parseInt(document.getElementById('size').value);
    }

    function setSize(size) {
        document.getElementById('size').value = size;
    }

    function getSpeed() {
        return parseInt(document.getElementById('speed').value);
    }

    function setSpeed(speed) {
        document.getElementById('speed').value = speed;
    }

    function getFrequency() {
        return parseInt(document.querySelector('input[name="frequency"]:checked').value);
    }

    function setFrequency(frequency) {
        document.querySelector('input[name="frequency"][value="' + frequency + '"]').checked = true;
    }

    function onKeyDown(event) {
        console.log(event);
        if (event.keyCode === 32) {
            timer ? stop() : start();
        }
    }

    initialize();
}());