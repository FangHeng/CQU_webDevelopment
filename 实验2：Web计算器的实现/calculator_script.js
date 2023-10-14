"use strict";

class Calculator {
	constructor() {
		// 初始化元素
		this.input = document.getElementById('input'); // 输入/输出框
		this.number = document.querySelectorAll('.numbers div'); // 数字按钮
		this.operator = document.querySelectorAll('.operators div'); // 运算符按钮
		this.result = document.getElementById('result'); // 等于按钮
		this.clear = document.getElementById('clear'); // 清除按钮
		this.resultDisplayed = false; // 标志，记录输出是否显示

		// 绑定事件
		this.bindNumberEvents();
		this.bindOperatorEvents();
		this.bindResultEvent();
		this.bindClearEvent();
		this.bindKeyboardInputEvent();
	}

	// 绑定数字按钮事件
	bindNumberEvents() {
		for (let i = 0; i < this.number.length; i++) {
			this.number[i].addEventListener("click", (e) => this.handleNumberClick(e));
		}
	}

	// 绑定运算符按钮事件
	bindOperatorEvents() {
		for (let i = 0; i < this.operator.length; i++) {
			this.operator[i].addEventListener("click", (e) => this.handleOperatorClick(e));
		}
	}

	// 绑定等号按钮事件
	bindResultEvent() {
		this.result.addEventListener("click", () => this.calculateResult());
	}

	// 绑定清除按钮事件
	bindClearEvent() {
		this.clear.addEventListener("click", () => this.handleClear());
	}

	// 绑定键盘输入事件
	bindKeyboardInputEvent() {
		document.addEventListener("keydown", (event) => this.handleKeyboardInput(event));
	}

	// 处理数字按钮点击
	handleNumberClick(e) {
		let currentString = this.input.innerHTML;
		let lastChar = currentString[currentString.length - 1];
		if (!this.resultDisplayed) {
			this.input.innerHTML += e.target.innerHTML;
		} else if (this.resultDisplayed && ["+", "-", "×", "÷"].includes(lastChar)) {
			this.resultDisplayed = false;
			this.input.innerHTML += e.target.innerHTML;
		} else {
			this.resultDisplayed = false;
			this.input.innerHTML = "";
			this.input.innerHTML += e.target.innerHTML;
		}
	}

	// 处理运算符按钮点击
	handleOperatorClick(e) {
		let currentString = this.input.innerHTML;
		let lastChar = currentString[currentString.length - 1];
		if (["+", "-", "×", "÷"].includes(lastChar)) {
			let newString = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
			this.input.innerHTML = newString;
		} else if (currentString.length === 0) {
			console.log("enter a number first");
		} else {
			this.input.innerHTML += e.target.innerHTML;
		}
	}

	// 计算结果
	calculateResult() {
		let inputString = this.input.innerHTML;
		let numbers = inputString.split(/\+|\-|\×|\÷/g);
		let operators = inputString.replace(/[0-9]|\./g, "").split("");

		let divide = operators.indexOf("÷");
		while (divide != -1) {
			numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
			operators.splice(divide, 1);
			divide = operators.indexOf("÷");
		}

		let multiply = operators.indexOf("×");
		while (multiply != -1) {
			numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
			operators.splice(multiply, 1);
			multiply = operators.indexOf("×");
		}

		let subtract = operators.indexOf("-");
		while (subtract != -1) {
			numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
			operators.splice(subtract, 1);
			subtract = operators.indexOf("-");
		}

		let add = operators.indexOf("+");
		while (add != -1) {
			numbers.splice(add, 2, parseFloat(numbers[add]) + parseFloat(numbers[add + 1]));
			operators.splice(add, 1);
			add = operators.indexOf("+");
		}

		if (numbers[0] % 1 !== 0) {
			let decimalPart = numbers[0].toString().split('.')[1];
			if (decimalPart && decimalPart.length > 11) {
				numbers[0] = parseFloat(numbers[0].toFixed(11));
			}
		}

		this.input.innerHTML = numbers[0];
		this.resultDisplayed = true;
	}

	// 清除输入
	handleClear() {
		this.input.innerHTML = "";
	}

	// 处理键盘输入
	handleKeyboardInput(event) {
		let keyPressed = event.key;
		let lastChar = this.input.innerHTML[this.input.innerHTML.length - 1];

		if (!isNaN(keyPressed) || keyPressed === ".") {
			if (!this.resultDisplayed) {
				this.input.innerHTML += keyPressed;
			} else if (this.resultDisplayed && ["+", "-", "×", "÷"].includes(lastChar)) {
				this.resultDisplayed = false;
				this.input.innerHTML += keyPressed;
			} else {
				this.resultDisplayed = false;
				this.input.innerHTML = "";
				this.input.innerHTML += keyPressed;
			}
		} else if (["+", "-", "*", "/"].includes(keyPressed)) {
			let symbol = keyPressed === "*" ? "×" : keyPressed === "/" ? "÷" : keyPressed;
			if (["+", "-", "×", "÷"].includes(lastChar)) {
				let newString = this.input.innerHTML.substring(0, this.input.innerHTML.length - 1) + symbol;
				this.input.innerHTML = newString;
			} else if (this.input.innerHTML.length === 0) {
				console.log("enter a number first");
			} else {
				this.input.innerHTML += symbol;
			}
		} else if (keyPressed === "Backspace") {
			this.input.innerHTML = this.input.innerHTML.slice(0, -1);
		} else if (keyPressed === "Escape") {
			this.input.innerHTML = "";
		} else if (keyPressed === "Enter") {
			this.result.click();
		}
	}
}

let calculator = new Calculator();
