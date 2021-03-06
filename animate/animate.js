function Animate(dom, properties, duration, easing, callback) {
    this.dom = dom;
    this.properties = properties;
    this.style = {};
    this.duration = duration;
    if (arguments.length === 4 && typeof easing === 'function') {
        this.callback = easing;
        this.easing = 'swing';
    } else {
        this.easing = easing || 'swing';
        this.callback = callback || null;
    }
    this.startTime = +new Date();
    for(var i in this.properties) {
        if (isNaN(Number(this.properties[i]))) {
            this.properties[i] = Number(this.properties[i].replace('px', ''));
        }
        this.style[i] = parseFloat(document.defaultView.getComputedStyle(this.dom)[i]);
    }

    this.start();
}

Animate.interval = 16;
Animate.easing = {
    swing: function(t, b, c, d ) {
        return b + (c - b) * (function(p) {
            return 0.5 - Math.cos( p * Math.PI ) / 2;
        })(t / d);
    },
    linear: function(t, b, c, d) {
        return b + (c - b) * t / d;
    },
    easeInQuad: function(t, b, c, d) {
        return b + (c - b) * Math.pow((t / d), 2);
    },
    easeInElastic: function(t, b, c, d) {
        return b + (c - b) * (function(x) {
            return x === 0 ? 0 : x === 1 ? 1 :
            -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * (2 * Math.PI) / 3);
        })(t / d);
    },
    easeOutBounce: function(t,b,c,d) {
        return b + (c - b) * (function(x) {
            var n1 = 7.5625,
            d1 = 2.75;
            if ( x < 1/d1 ) {
                return n1*x*x;
            } else if ( x < 2/d1 ) {
                return n1*(x-=(1.5/d1))*x + .75;
            } else if ( x < 2.5/d1 ) {
                return n1*(x-=(2.25/d1))*x + .9375;
            } else {
                return n1*(x-=(2.625/d1))*x + .984375;
            }
        })(t / d)
    }
};

Animate.prototype = {
    start: function() {
        var self = this;
        this.timeId = setInterval(function() {
            self.step();
        }, Animate.interval);
    },
    step: function() {
        var curTime = +new Date();
        var deltaTime = curTime - this.startTime;
        if (deltaTime <= this.duration)  {
            var obj = {};
            for(var i in this.properties) {
                obj[i] = Animate.easing[this.easing](deltaTime, this.style[i], this.properties[i], this.duration);
            }
            this.update(obj);
        } else {
            clearInterval(this.timeId);
            this.fix();
            this.callback && this.callback();
        }
    },
    update: function(obj) {
        for(var i in this.properties) {
            this.dom.style[i] = obj[i];
        }
    },
    fix: function() {
        for(var i in this.properties) {
            this.dom.style[i] = this.properties[i];
        }
    }
};