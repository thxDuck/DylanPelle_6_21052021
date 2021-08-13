import PhotographersDatas from "../models/Photographers.js";
import MediaDatas from "../models/Medias.js";
import Photographer from "../classes/Photographers.js";
import View from "../classes/factory/View.js";


// ######################################
//              Photographers
// ######################################


function initHome() {
	document.getElementById('allTags').innerHTML = '';
	document.getElementById('photographers-list').innerHTML = '';
	// const view = new View();
	let allPhotographers = getAllPhotographers();
	if (allPhotographers.length > 0) {
		allPhotographers.forEach(userDatas => {
			let photographer = new Photographer(userDatas.id, userDatas.name, userDatas.city, userDatas.country, userDatas.tags, userDatas.tagline, userDatas.price, userDatas.portrait);
			if (!!photographer) {
				let card = new View('card', { "datas": photographer });
				document.getElementById('photographers-list').append(card.create());
			}
		});

		let tagList = PhotographersDatas.getAllTags();
		let allTags = new View('tags', { "options": "action", "datas": tagList })
		document.getElementById('allTags').append(allTags.create())
		addEventForTags();

	}
}



function addEventForTags() {
	let allTags = document.getElementsByClassName('sortingTag');
	if (allTags.length > 0) {
		for (let i = 0; i < allTags.length; i++) {
			let tag = allTags[i];
			tag.addEventListener('click', (e) => {
				let tagName = e.currentTarget.id;
				let selectedTag = document.getElementsByClassName('tagSelected')[0];
				if (!!selectedTag && selectedTag.innerText.indexOf(tagName) > -1) {
					initHome();
				} else {

					if (!!tagName) sortPhotographerByTag(tagName);
				}

			}, false)

		}
	}
}

function sortPhotographerByTag(tagName = false) { // * tags par tags ou plusieurs tags ?
	document.getElementById('allTags').innerHTML = '';

	let allPhotographers = getAllPhotographers();
	if (allPhotographers.length > 0) {
		document.getElementById('photographers-list').innerHTML = '';
		allPhotographers.forEach(userDatas => {
			if (userDatas.tags.indexOf(tagName) > -1) {
				let photographer = new Photographer(userDatas.id, userDatas.name, userDatas.city, userDatas.country, userDatas.tags, userDatas.tagline, userDatas.price, userDatas.portrait);
				if (!!photographer) {
					let card = new View('card', { "datas": photographer });
					document.getElementById('photographers-list').append(card.create());
				}
			}
		});

		let tagList = PhotographersDatas.getAllTags();
		let allTags = new View('tags', { "options": "action", "datas": tagList })
		document.getElementById('allTags').append(allTags.create())
		let selectedTag = document.getElementById(tagName);
		selectedTag.children[0].className += ' '+ "tagSelected";
		addEventForTags();
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
}