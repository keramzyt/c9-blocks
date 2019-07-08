const attributes = {
	heading: {
		type: "string",
		source: "text",
		default: "Heading Content Here"
	},
	subheading: {
		type: "string",
		source: "text",
		default: "Subheading Content Here"
	},
	wrapper: {
		type: "array",
		source: "query",
		selector: ".section-heading",
		query: {
			class: {
				type: "string",
				source: "attribute",
				attribute: "class"
			}
		}
	},
	level: {
		type: "int",
		default: 1
	},
	type: {
		type: "string",
		default: "display-"
	},
	backgroundColor: {
		type: "string",
		default: ""
	},
	textColor: {
		type: "string",
		default: ""
	},
	textAlign: {
		type: "string",
		default: "left"
	},
	weight: {
		type: "string",
		default: "normal"
	}
};

export default attributes;
