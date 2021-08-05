import PhotographersDatas from "../models/Photographers.js";
import MediaDatas from "../models/Medias.js";
import Photographer from "../classes/Photographers.js";
import View from "../classes/factory/View.js";


// ######################################
//              Photographers
// ######################################


function initHome() {
	const view = new View();
	let allPhotographers = getAllPhotographers();
	if (allPhotographers.length > 0) {
		allPhotographers.forEach(userDatas => {
			let photographer = new Photographer(userDatas.id, userDatas.name, userDatas.city, userDatas.country, userDatas.tags, userDatas.tagline, userDatas.price, userDatas.portrait);
			if (!!photographer) {

				let card = view.createView('card', "photographer", photographer);
				document.getElementById('photographers-list').appendChild(card);
			}
		});

		let tagList = PhotographersDatas.getAllTags();
		let allTags = view.createView('tags', false, tagList)
		document.getElementById('allTags').appendChild(allTags)
	}
}



function getAllPhotographers() {
	return PhotographersDatas.findAllPhotographers();
}

function getPhotographer(id) {
	return PhotographersDatas.findPhotographerById(id);
}

function getAllMediasByPhotographer(id) {
	return MediaDatas.findMediasByPhotographer(id);
}


export {
	initHome,
// 	getTagList,
// 	getAllMediasByPhotographer,
// 	getAllPhotographers,
// 	getPhotographer
}