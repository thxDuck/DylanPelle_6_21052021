
export default class Media {
	constructor(id, photographerId, title, image, tags, likes, date, price) {
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





}