/*
	CSS bubbles by Jon Thornton (http://www.jonthornton.com)
*/

const Bubbles = class {
	constructor(config = {}) {
		this.incrementColorIndex = this.incrementColorIndex.bind(this);
		this.measureMouseMove = this.measureMouseMove.bind(this);
		this.drawCircle = this.drawCircle.bind(this);
		this.start = this.start.bind(this);
		// this.stop = this.stop.bind(this);

		const defaults = {
			interval: 100,
			size: .5,
			colors: ['black', 'white'],
			maxBubbles: 30
		}

		this.config = Object.assign(defaults, config);
		this.colorIndex = 0;
		this.bubbles = [];
		this.bubbleCount = 0;

		document.body.addEventListener('click', this.incrementColorIndex);
		this.start();
	}

	incrementColorIndex() {
		this.colorIndex = (this.colorIndex+1) % this.config.colors.length;
	}

	start() {
		window.addEventListener('pointermove', this.measureMouseMove);

		const samplerFunc = () => {
			this.readyToSample = true;
		}

		samplerFunc.bind(this);
		this.timer = setInterval(samplerFunc, this.config.interval);
	}

	// stop() {
	// 	document.body.removeEventListener('pointermove', this.measureMouseMove);
	// 	clearTimeout(this.timer);
	// }

	measureMouseMove(e) {
		if (!this.readyToSample) {
			return;
		}

		this.readyToSample = false;

		if (this.lastX && this.lastY) {
			const size = Math.sqrt(Math.pow(this.lastX - e.clientX, 2) + Math.pow(this.lastY - e.clientY, 2));

			if (size > this.config.size) {
				this.drawCircle(this.config.size * size, e.pageX, e.pageY);
			}
		}

		this.lastX = e.clientX;
		this.lastY = e.clientY;
	}

	drawCircle(size, x, y) {
		const index = this.bubbleCount % this.config.maxBubbles;
		if (index == 0) {
			this.incrementColorIndex();
		}

		if (this.bubbles[index]) {
			this.bubbles[index].remove();
		}

		const newBubble = document.createElement('div');

		newBubble.classList.add('bubble');
		newBubble.style.top = this.pixelfy(y);
		newBubble.style.left = this.pixelfy(x);
		newBubble.style.borderRadius = this.pixelfy(size);
		newBubble.style.background = this.config.colors[this.colorIndex];
		newBubble.style.height = this.pixelfy(size);
		newBubble.style.width = this.pixelfy(size);
		newBubble.style.marginLeft = this.pixelfy(size/2 * -1);
		newBubble.style.marginTop = this.pixelfy(size/2 * -1);

		this.bubbles[index] = newBubble;
		document.body.append(newBubble);

		this.bubbleCount++;
	}

	pixelfy(someNumber) {
		return Math.round(someNumber) + 'px';
	}
};

