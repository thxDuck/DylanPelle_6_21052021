
export default class Media {
	constructor(id, photographerId, title, image, tags, likes, date, price, description = false) {
		this.id = id;
		this.photographerId = photographerId;
		this.title = title;
		this.file = image;
		this.tags = tags;
		this.likes = likes;
		this.date = new Date(date);
		this.price = price;
		this.url = this.getUrl();
		this.format = this.getFormat();
		this.descrition = !!description ? description : this.getDescription();
	}

	static create() {
		switch (this.format) {
			case "video":
				return createVideo();

			case "picture":
				return createImg();

			default:
				break;
		}

	}

	getUrl() {
		return "../public/images/photographers/" + this.photographerId + "/" + this.file;
	}

	getFormat() {
		const imgFormat = ["jpg", "jpeg", "gif", "png", "svg", "tiff"];
		const videoFormat = ["mp4", "avi", "mwv", "mkv", "h264", "flv"];
		let name = this.file;
		let extension = name.substring(name.lastIndexOf('.') + 1);
		if (imgFormat.indexOf(extension) > -1) return "picture";
		if (videoFormat.indexOf(extension) > -1) return "video";
		return false;
	}


	/**
	 * Auto generate descrition if media doesn't contains description field
	 * return a string like "Vidéo named ${name} on theme of ${list of tags}."
	 */
	getDescription() {
		let tagList = this.tags;
		let type = "";
		let description = this.format + " named " + this.title + " on the theme of";
		for (let i = 0; i < tagList.length; i++) {
			const tag = tagList[i];
			description += (i === 0 ? " " : ', ') + tag + (i === tagList.length - 1 ? "." : '');

		}
		return description;
	}

}




