
import PhotographersDatas from "../models/Photographers.js";


export default class Photographer {
    constructor(id, username, city, country, tags, tagline, price, profilePic) {
        this.id = id;
        this.username = username;
        this.city = city;
        this.country = country;
        this.tags = tags;
        this.tagline = tagline;
        this.price = price;
        this.profilePic = profilePic;
        this.totalLikes = this.getTotalLikes(this.id);
    }
    getTotalLikes(id) {
        if (PhotographersDatas.findPhotographer(id)) {
            console.log('enter find total likes');
            let result = PhotographersDatas.aggregatesLikesByPhotographerId(this.id);
            if (result.success) {
                return result.totalLikes;
            } else {
                return result.msg;
            }

        } else {
            return "Auteur introuvable"
        }

    }


}