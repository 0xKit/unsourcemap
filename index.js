const falafel = require("falafel")
const fs = require("fs")
const sourceMap = require("source-map")
const js = fs.readFileSync("e7937655855e43850188.worker.js").toString("utf-8")
const jsmap = fs.readFileSync("e7937655855e43850188.worker.js.map").toString("utf-8")
const beautify = require("js-beautify").js

//literally gets updated 24/7 before it uses new to promise to new again wtf??
const map = new sourceMap.SourceMapConsumer(jsmap)
const deobfuscated = falafel({source: js, locations: true}, (node) => {
	var orig = null
	if (node.id) {
	orig = map.originalPositionFor({line: node.id.loc.start.line, column: node.id.loc.start.column})
	if (orig.name)
		node.id.update(orig.name)
	} else if (node.type === "Identifier") {
		orig = map.originalPositionFor({line: node.loc.start.line, column: node.loc.start.column})
		if (orig.name)
			node.update(orig.name)
	}
})
fs.writeFileSync("output.js", beautify(deobfuscated.toString()))
