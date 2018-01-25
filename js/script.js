
var Module = (function () {
	var inputDiv = global.dom(".text-input");
	inputDiv.focus()
	var smileys = [{
		searchStr: "&lt;3",
		charCount: function () {
			return this.searchStr.length;
		},
		imgUrl: "/img/Heart_Emoji_Icon_42x42.png"
	}, {
		searchStr: ":)",
		charCount: function () {
			return this.searchStr.length;
		},
		imgUrl: "/img/Smiling_Face_Emoji_Icon_42x42.png"
	}]
	/**
   * Function to get the positions of the smile characters
   * @param {String} searchStr
   *    String to search for
	 * @param {String} str
   *    String in which to search
   *    
   **/
	var getIndicesOf = function (searchStr, str) {
		var searchStrLen = searchStr.length;
		if (searchStrLen == 0) {
			return [];
		}
		var startIndex = 0, index, indices = [];
		while ((index = str.indexOf(searchStr, startIndex)) > -1) {
			indices.push(index);
			startIndex = index + searchStrLen;
		}
		return indices;
	}
	/**
   * Function to create smile image and append to respective positions
   * @param {String} src
   *    Emoji Url
	 * @param {HTMLElement} appendTo
   *    HTML DOM Element
	 * @param {HTMLElement} className
   *    Class name of the HTML DOM Element
   *
   **/
	var createSmileImg = function (src, appendTo, className) {
		var img = document.createElement('img');
		img.src = src
		img.className = className ? className : "rich-smiley"
		var parentGuest = appendTo;
		var childGuest = img;
		if (parentGuest.nextSibling) {
			parentGuest.parentNode.insertBefore(childGuest, parentGuest.nextSibling);
		}
		else {
			parentGuest.parentNode.appendChild(childGuest);
		}
		return img
	}
	/**
   * Function to create input span and append to respective positions
   * @param {String} text
   *    Text to insert into the span
	 * @param {HTMLElement} appendTo
   *    HTML DOM Element
	 * @param {HTMLElement} className
   *    Class name of the HTML DOM Element
   *
   **/
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
		if (parentGuest.nextSibling) {
			parentGuest.parentNode.insertBefore(childGuest, parentGuest.nextSibling);
		}
		else {
			parentGuest.parentNode.appendChild(childGuest);
		}
		return span
	}
	var createSmileDynamic = function (span, spanStr, smileyObj) {
		let indices = getIndicesOf(smileyObj.searchStr, spanStr);
		let spanText = spanStr.slice(0, indices);
		let restChar = spanStr.slice((indices[0] + smileyObj.charCount()), spanStr.length)
		span.innerHTML = spanText
		let img = createSmileImg(smileyObj.imgUrl, span)
		if (restChar && restChar.length > 0) {
			createDynamicSpan(restChar, img)
		}
		if (!img.nextElementSibling) {
			let span = createTextSpan("&nbsp;", inputDiv)
			setCaret(span, 0)
		} else {
			setCaret(img.nextElementSibling, 0)
		}
	}
	/**
   * Function to place the caret or cursor in the position after creating a dom
	 * @param {HTMLElement} element
   *    HTML DOM Element in which we want to put the caret
	 * @param {Number} index
   *    Index of the cursor
   *
   **/
	var setCaret = function (element, index) {
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
	/** Event handler which will trigger the function **/
	var handleInputOnKeyPress = function (e) {
		if (e.keyCode == 13) {
			let div = document.createElement("div");
			div.className = "history-node";
			div.innerHTML = inputDiv.innerHTML;
			div.children[div.children.length - 1].innerHTML = new Date()
			global.dom(".history-wrapper").appendChild(div)
			div.scrollIntoView();
			inputDiv.innerHTML = "";
			return
		}
		let initialSpan = global.domAll("#textInput span");
		if (initialSpan[0] == null) {
			let text = inputDiv.innerHTML;
			inputDiv.innerHTML = "";
			let textSpan = createTextSpan(text, inputDiv)
			if (e.target.children[0].innerHTML.length > 0) {
				setCaret(global.dom("#textInput span"), 0)
			} else {
				global.dom("#textInput span").innerHTML = "&nbsp;"
				global.dom("#textInput span").focus()
			}
		}
		else {
			let span = global.domAll("#textInput span")
			for (var i = 0; i < span.length; i++) {
				let spanStr = span[i].innerHTML
				for (var j = 0; j < smileys.length; j++) {
					if (spanStr.indexOf(smileys[j].searchStr) > -1) {
						createSmileDynamic(span[i], spanStr, smileys[j])
					}
				}
			}
		}
	};

	inputDiv.addEventListener("keyup", handleInputOnKeyPress)

	var myObject = {
		smileys: smileys,
	};

	return myObject;

})();