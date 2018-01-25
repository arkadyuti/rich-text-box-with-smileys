// console.log(global.dom(".text-input")[0].innerHtml);
var Module = (function () {
	var inputDiv = global.dom(".text-input");
	var smileys = {
		heart: {
			searchStr: ";",
			charCount: function () {
				return this.searchStr.length;
			},
			imgUrl: "/img/Heart_Emoji_Icon_42x42.png"
		},
		smile: {
			searchStr: ":",
			charCount: function () {
				return this.searchStr.length;
			},
			imgUrl: "/img/Smiling_Face_Emoji_Icon_42x42.png"
		}
	}

	var getIndicesOf = function (searchStr, str, caseSensitive) {
		var searchStrLen = searchStr.length;
		if (searchStrLen == 0) {
			return [];
		}
		var startIndex = 0, index, indices = [];
		if (!caseSensitive) {
			str = str.toLowerCase();
			searchStr = searchStr.toLowerCase();
		}
		while ((index = str.indexOf(searchStr, startIndex)) > -1) {
			indices.push(index);
			startIndex = index + searchStrLen;
		}
		return indices;
	}
	var createSmileImg = function (src, appendTo, className) {
		// var appendTo = global.dom("#textInput")
		var img = document.createElement('img');
		img.src = src
		img.className = "rich-smiley"
		var parentGuest = appendTo;
		var childGuest = img;
		// childGuest.id = "two";
		if (parentGuest.nextSibling) {
			parentGuest.parentNode.insertBefore(childGuest, parentGuest.nextSibling);
		}
		else {
			parentGuest.parentNode.appendChild(childGuest);
		}
		return img
	}
	var createTextSpan = function (text, appendTo, className) {
		var span = document.createElement('span');
		span.innerHTML = text;
		span.contentEditable = "true"
		span.tabIndex = "0";
		span.className = "split-text"
		appendTo.appendChild(span)
		return span
	}
	var createDynamicSpan = function (text, appendTo, className) {
		var span = document.createElement('span');
		span.innerHTML = text;
		span.tabIndex = "0"
		span.className = "split-text"
		var parentGuest = appendTo;
		var childGuest = span;
		// childGuest.id = "two";
		if (parentGuest.nextSibling) {
			parentGuest.parentNode.insertBefore(childGuest, parentGuest.nextSibling);
		}
		else {
			parentGuest.parentNode.appendChild(childGuest);
		}
		return span
	}
	function setCaret(element, index) {
		console.log(index)
		var el = element ? element : inputDiv;
		var range = document.createRange();
		var sel = window.getSelection();
		var index = index ? index : 1;
		range.setStart(el, index);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		el.focus();
	}
	function getCaretPosition(editableDiv) {
		var caretPos = 0,
			sel, range;
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.rangeCount) {
				range = sel.getRangeAt(0);
				if (range.commonAncestorContainer.parentNode == editableDiv) {
					caretPos = range.endOffset;
				}
			}
		} else if (document.selection && document.selection.createRange) {
			range = document.selection.createRange();
			if (range.parentElement() == editableDiv) {
				var tempEl = document.createElement("span");
				editableDiv.insertBefore(tempEl, editableDiv.firstChild);
				var tempRange = range.duplicate();
				tempRange.moveToElementText(tempEl);
				tempRange.setEndPoint("EndToEnd", range);
				caretPos = tempRange.text.length;
			}
		}
		return caretPos;
	}
	var createSmileDynamic = function (span, spanStr) {
		let indices = getIndicesOf(smileys.smile.searchStr, spanStr);
		let spanText = spanStr.slice(0, indices);
		let restChar = spanStr.slice((indices[0] + 1), spanStr.length)
		span.innerHTML = spanText
		let img = createSmileImg(smileys.smile.imgUrl, span)

		if (restChar && restChar.length > 0) {
			createDynamicSpan(restChar, img)
		}

		if (!img.nextElementSibling) {
			let test = createTextSpan("&nbsp;", inputDiv)
			// console.log(test)
			// global.domAll(".split-text")[1].focus()
			setCaret(test, 0)
		} else {
			// debugger
			setCaret(img.nextElementSibling, 0)
		}
	}
	var handleInputOnKeyPress = function (e) {
		console.log(getCaretPosition(inputDiv))
		if (global.dom("#textInput span") == null) {
			let text = inputDiv.innerHTML;
			inputDiv.innerHTML = "";
			createTextSpan(text, inputDiv)
			setCaret(global.dom("#textInput span"))
			// debugger
			// console.log(getIndicesOf(smileys.heart.searchStr, fullStr, false));
			// console.log(getIndicesOf(smileys.smile.searchStr, fullStr, false));
		} else {
			let span = global.domAll("#textInput span")
			for (var i = 0; i < span.length; i++) {
				let spanStr = span[i].innerHTML
				if (spanStr.indexOf(smileys.smile.searchStr) > -1) {
					createSmileDynamic(span[i], spanStr)
				}
			}
		}
	};

	inputDiv.addEventListener("keyup", handleInputOnKeyPress)

	var myObject = {
		someMethod: function () {
			console.log("someMethod")
		},
		smileys: smileys,
		createSmileImg: createSmileImg,
		createTextSpan: createTextSpan,
	};

	return myObject;

})();

// Module.someMethod()