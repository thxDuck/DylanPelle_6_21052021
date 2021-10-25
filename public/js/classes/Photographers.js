
import PhotographersDatas from "../models/Photographers.js";
import MediaDatas from "../models/Medias.js";


export default class Photographer {
	constructor(id, username, city, country, tags, slogan, price, profilePic) {
		this.id = id;
		this.username = username;
		this.city = city;
		this.country = country;
		this.tags = tags;
		this.slogan = slogan;
		this.price = price;
		this.profilePic = profilePic;
		this.totalLikes = this.getTotalLikes(this.id);
	}

	getlocalisation() {
		let local = this.city + ', ' + this.country;
		return local;
	}

	getTotalLikes() {
		let likes = MediaDatas.aggregatesLikesByPhotographerId(this.id);
		if (typeof likes === "number") {
			return likes;
		} else {
			console.log('Likes undefined');
			return 0;
		}
	}

	static returnClass() {
		return "Photographer";
	}


}