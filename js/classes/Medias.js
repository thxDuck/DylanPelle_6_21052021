
import MediaDatas from "../models/Medias.js";



export default class Media {
	constructor(id, photographerId, title, image, tags, likes, date, price) {
		this.id = id;
		this.photographerId = photographerId;
		this.title = title;
		this.image = image;
		this.tags = tags;
		this.likes = likes;
		this.date = new Date(date);
		this.price = price;
	}






}