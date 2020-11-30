// E&E Experiment 2 - Stefano Taillefert, Andrea Brites Marto

// Shuffle everything
shuffleArray(words);
words.forEach((el) => {
	shuffleArray(el.camelCase);
	shuffleArray(el.kebabCase);
});

var mode = Math.floor(Math.random() * 2); //0 = camelCase, 1 = kebab-case
var page = -1; // -1 = start page, 0-4 = first case, 5 = switch case, 6-10 = second case
var startTime;

//Personal data
var name = "";
var programmer = false;
var notes;

//Results
var scores = [];
var times = [];

/**
 * Perform an in-place Durstenfeld shuffle.
 * @param {*} array the array to shuffle
 */
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; --i) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

/**
 * Exports the results data to a JSON file.
 * @param {*} jsonData
 */
function exportResults() {
	let jsonData = {
		name,
		programmer,
		scores,
		times,
		notes,
		dateTime: new Date().toLocaleString()
	};
	let dataStr = JSON.stringify(jsonData);
	let dataUri = "data:application/json;charset=utf-8," + 
		encodeURIComponent(dataStr);

	let exportFileDefaultName = "data_" + jsonData.name + ".json";

	let linkElement = document.createElement("a");
	linkElement.setAttribute("href", dataUri);
	linkElement.setAttribute("download", exportFileDefaultName);
	linkElement.click();

	//Release reload lock
	window.onbeforeunload = null;
}

/**
 * Checks and saves score and time, then advance to next page.
 * @param {*} el the source element with the target word
 */
function checkWord(el) {
	let solution =
		mode == 0
			? words[page % words.length].camelCaseSolution
			: words[page % words.length].kebabCaseSolution;

	if (el.innerHTML == solution) {
		scores.push(1);
	} else {
		scores.push(0);
	}

	times.push((performance.now() - startTime).toFixed(2));

	++page;
	renderPage();
}

/**
 * Prevents exiting the test if data isn't saved.
 */
window.onbeforeunload = function() {
	return "You haven't finished the test or saved your data yet.";
};

/**
 * Handles passage to next page and words rendering.
 */
function renderPage() {
	if (page == -1) {
		//First page
		name = document.querySelector("#nameField").value.trim();
		programmer = document.querySelector("#programmerField").checked;
		notes = document.querySelector("#notesField").value.trim();
		 

		if (name.length == 0) {
			alert("Please insert a name.");
			return;
		}

		document.querySelector("#nextPageBtn").classList.add("hide");
		++page;
		renderPage();
	} else if (page == words.length) {
		//Last page of first case
		mode = (mode + 1) % 2;
		++page;
		renderPage();
	} else if (page == 2 * words.length + 1) {
		//Last page of second case (true end)
		document.querySelector("#box").classList.add("hide");
		document.querySelector("#word").innerHTML = "Congratulations, " + 
			name + "!";
		
		document.querySelector("#content").innerHTML =
			`<div class="spaced15">The test is finished.</div>
			Your scores: ` + scores.join(', ') + `<br>
			Times: ` + times.join(', ') + `<br>
			<button class="btn mTop15" onclick="exportResults()">Export</button>`;
	} else {
		//All other pages
		startTime = performance.now();
		document.querySelector("#word").innerHTML = "Find " + 
			words[page % words.length].word;
		document.querySelector("#content").innerHTML = "";

		//Select case array based on what we're testing (mode)
		let arr =
			mode == 0
				? words[page % words.length].camelCaseList
				: words[page % words.length].kebabCaseList;

		let words0 = document.querySelector("#words0");
		let words1 = document.querySelector("#words1");
		let words2 = document.querySelector("#words2");

		words0.innerHTML = '<div class="words" onclick="checkWord(this)">' + arr[0] + '</div>';
		words0.innerHTML += '<div class="words" onclick="checkWord(this)">' + arr[1] + '</div>';

		words1.innerHTML = '<div class="words" onclick="checkWord(this)">' + arr[2] + '</div>';

		words2.innerHTML = '<div class="words" onclick="checkWord(this)">' + arr[3] + '</div>';
		words2.innerHTML += '<div class="words" onclick="checkWord(this)">' + arr[4] + '</div>';

	}
}
