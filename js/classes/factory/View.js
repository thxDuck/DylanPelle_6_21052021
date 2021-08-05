
export default class View {
	constructor(type, options) {
		this.type = type;
		this.options = options;
	}

	/**
	 *
	 * @param {String} type Type of element you want (card, tag, media)
	 * @param {String} model Model if you need, to precise whitch type of datas (photographer, media...)
	 * @param {*} datas all datas for creating the element
	 * @returns HTML element
	 */
	createView(type, model, datas) {
		switch (type) {
		case "card":
			switch (model) {
			case "photographer":
				return View.createPhotographerCard(datas);
			default:
				break;
			}
			break;
		case 'tags':
			return View.createTagList(datas)
		default:
			// TODO : create an error element
			break;
		}
	}

	static createPhotographerCard(photographer) {
		let container = this.createElementWithAttributes('div', 'thmb-photographer');
		let linkAttribute = [
			{
				"name": "class",
				"value": "thmb-photographer__thumbnail",
			},
			{
				"name": "href",
				"value": ("/pages/photographer_details.html?photographer="+ photographer.id),
			},

		]
		let photographerThumbnail = this.createElementWithAttributes('a', linkAttribute);
		let imgAttributes = [
			{
				"name": "class",
				"value": "profilePic--rounded",
			},
			{
				"name": "src",
				"value": "/public/images/Photographers_ID_Photos/"+ photographer.profilePic,
			},
			{
				"name": "alt",
				"value": ("Profile picture of " + photographer.username)
			}
		]
		let img = this.createElementWithAttributes('img', imgAttributes);
		let cardTitle = this.createElementWithText('h2', photographer.username);

		photographerThumbnail.appendChild(img);
		photographerThumbnail.appendChild(cardTitle);

		let photographerInfosContainer = this.createElementWithAttributes('div', 'thmb-photographer__infos');
		let localisation = this.createElementWithAttributes('p', 'localisation', photographer.getlocalisation());
		let slogan = this.createElementWithAttributes('blockquote', 'slogan', photographer.slogan);
		let price = this.createElementWithAttributes('p', 'price', (photographer.price + "€/jour"));
		photographerInfosContainer.appendChild(localisation)
		photographerInfosContainer.appendChild(slogan)
		photographerInfosContainer.appendChild(price)

		container.appendChild(photographerThumbnail);
		container.appendChild(photographerInfosContainer);

		let tagList = this.createTagList(photographer.tags);
		container.appendChild(tagList);


		return container;
	}

	static createTagList(tags) {
		if (!!tags && tags.length > 0) {
			let container = this.createElementWithAttributes('div', 'thmb-photographer__tags');
			tags.forEach(tag => {
				let tagName = '#' + tag;
				let a = document.createElement('a');
				let span = this.createElementWithAttributes('span', 'tag', tagName);
				a.appendChild(span);
				container.appendChild(a)
			});
			return container;
		} else {
			return false;
		}

	}





	static createElementWithText(type, text) {
		let el = document.createElement(type);
		el.textContent = text;
		return el;
	}

	/**
	 * Create element with all attributes you need
	 * If attribute is a string, attribute is by default a class name
	 * if Attribute is an array of object contains each one a .name for name of attributes and .value for value of the attribute.
	 * attrs = [
			{
				"name": "",
				"value": "",
			}
		]
	 *
	 * @param {String} el Html element tag name
	 * @param {Array} attributes Array of object [{ "name", "name of attribute", "value":"value of attribute" },{}...]
	 * @returns Html element with attributes passend in params
	 */
	static createElementWithAttributes(el, attributes, text = false) {
		let element = document.createElement(el);
		if (typeof attributes === "string") {
			element.className = attributes;
			element;
		} else {
			for (let i = 0; i < attributes.length; i++) {
				let attr = attributes[i];
				if (attr.name === "class") {
					element.className = attr.value;
				} else {
					element[attr.name] = attr.value;
				}
			}
		}

		if (!!text) {
			element.textContent = text;
		}
		return element;

	}




}