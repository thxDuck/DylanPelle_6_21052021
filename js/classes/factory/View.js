
export default class View {
	constructor(type, data) {
		this.type = type;
		this.options = data.options;
		this.datas = data.datas;
		this.model = this.getTypeOfDatas(this.datas.datas);

	}

	/**
	 *
	 * 	TODO : Datas + model dans option
	 *
	 * @param {String} type Type of element you want (card, tag, media)
	 * @param {String} model Model if you need, to precise whitch type of datas (photographer, media...)
	 * @param {*} datas all datas for creating the element
	 * @returns HTML element
	 */
	create() {
		let type = this.type;
		let options = this.options;
		let model = this.model;
		let datas = this.datas;
		switch (type) {
		case "card":
			if (!!model && model === "Photographer") return View.createPhotographerCard(datas);
			if (!!model && model === "Media") return View.createMediaCard(datas);
		case "description":
			if (!!model && model === "Photographer") return View.createPhotographerDescription(datas);

		case 'tags':
			if (options === 'action') return View.createTagList(datas, true)
			return View.createTagList(datas, false)

		case "title":
			return View.createTitle(options, datas)

		default:
			// TODO : create an error element
			return "<p>ERROR</p>"
			break;
		}
	}

	 getTypeOfDatas() {
		if (!!this.datas.model) return this.datas.model
		return this.datas.constructor.name;
	}


	static createTitle(type, text) {
		return this.createElementWithText(type, text)
	}

	static createMediaCard(datas) {
		this.createMediaCard(datas);
		switch (datas.format) {
		case "video":
			return this.createVideo(datas);

		case "picture":
			return this.createImg(datas);

		default:
			break;
		}
	}

	static createMediaCard(datas) {
		let container = this.createElementWithAttributes("div", [{ "name": "class", "value": "galery__item" }])
		let link = this.createElementWithAttributes("a",
			[{
				"name": "class",
				"value": "galery__item__photo",
			}, {
				"name": "href",
				"value": "#"
			}, {
				"name": "id",
				"value": datas.id
			}])
		let media;
		if (datas.format === "picture") {
			media = this.createImg(datas);
		} else if (datas.format === "video") {
			media = this.createVideo(datas);
			console.log('media => ', media);
		}
		let description = this.createMediaDescription(datas);
		link.append(media);
		container.append(link)
		container.append(description);
		return container;
	}





	static createMediaDescription(media) {
		const heartIcon = this.createElementWithAttributes("i",
			[{
				"name": "class",
				"value": "fas fa-heart",
			},
			{
				"name": "aria-label",
				"value": "likes",
			}]);
		let container = this.createElementWithAttributes("div", [
			{
				"name": "class",
				"value": "galery__item__infos",
			}
		]);

		let title = this.createElementWithAttributes("p", [
			{
				"name": "class",
				"value": "galery__item__infos--title",
			}
		], media.title);
		let likes = this.createElementWithAttributes("p", [
			{
				"name": "class",
				"value": "galery__item__infos--likes",
			}
		], media.likes);

		likes.append(heartIcon);
		container.appendChild(title)
		container.appendChild(likes)
		return container;

	}


	static createImg(media) {
		// let container = this.createElementWithAttributes("div", [{ "name": "class", "value": "galery__item" }])
		let image = View.createElementWithAttributes("img",
			[{
				"name": "src",
				"value": media.url,
			},
			{
				"name": "alt",
				"value": media.title,
			}]);
		return image;
	}

	static createVideo(media) {
		let source = View.createElementWithAttributes("source",
			[{
				"name": "src",
				"value": media.url
			},
			{
				"name": "alt",
				"value": media.title,
			},
			{
				"name": "type",
				"value": "video/mp4",
			}]);

		let video = document.createElement('video')
		video.append(source);
		return video;
	}

	static createPhotographerDescription(photographer, className) {
		let container;
		if (!!className) container = this.createElementWithAttributes('div', className);
		else container = document.createElement('div');
		let localisation = this.createElementWithAttributes('p', 'localisation', photographer.getlocalisation());
		let slogan = this.createElementWithAttributes('blockquote', 'slogan', photographer.slogan);
		container.appendChild(localisation);
		container.appendChild(slogan);
		return container;
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

		let photographerInfosContainer = this.createPhotographerDescription(photographer, 'thmb-photographer__infos');
		let price = this.createElementWithAttributes('p', 'price', (photographer.price + "€/jour"));
		photographerInfosContainer.appendChild(price);
		container.appendChild(photographerThumbnail);
		container.appendChild(photographerInfosContainer);

		let tagList = this.createTagList(photographer.tags);
		container.appendChild(tagList);


		return container;
	}

	static createTagList(tags, withAtcion = false) {
		if (!!tags && tags.length > 0) {
			let container = this.createElementWithAttributes('div', 'thmb-photographer__tags');
			tags.forEach(tag => {
				let tagName = '#' + tag;
				let a;
				if (withAtcion) {
					let attrs = [
						{
							"name": "class",
							"value": "sortingTag",
						},
						{
							"name": "id",
							"value": tagName.replace('#', ''),
						},
					];
					a = this.createElementWithAttributes('a', attrs);
				} else {
					a = document.createElement('a');
				}

				let span = this.createElementWithAttributes('span', 'tag', tagName);
				a.appendChild(span);
				container.appendChild(a);
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
					element.setAttribute(attr.name, attr.value)
				}
			}
		}

		if (!!text) {
			element.textContent = text;
		}
		return element;

	}


}