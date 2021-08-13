import PhotographersDatas from "../models/Photographers.js";
import MediaDatas from "../models/Medias.js";
import Photographer from "../classes/Photographers.js";
import Medias from "../classes/Medias.js";
import View from "../classes/factory/View.js";


// ######################################
//              Details
// ######################################

function initDetails() {
	let urlParam = document.location.href.substring(document.location.href.indexOf('photographer='))
	let id = parseInt(urlParam.substring(urlParam.indexOf('=') + 1));
	let userDatas = PhotographersDatas.findPhotographerById(id);
	if (!!userDatas) {
		let photographer = new Photographer(userDatas.id, userDatas.name, userDatas.city, userDatas.country, userDatas.tags, userDatas.tagline, userDatas.price, userDatas.portrait);
		fillPhotographerProfile(photographer);
	}

}


function fillPhotographerProfile(photographer) {
	let profileDescriptionContainer = document.getElementsByClassName('profile__description')[0];
	profileDescriptionContainer.innerHTML = '';
	let title = new View('title', {
		 "options": 'h1', "datas": photographer.username
	});

	profileDescriptionContainer.append(title.create());

	let description = new View('description', { 'datas': photographer });
	profileDescriptionContainer.append(description.create());

	let tags = new View('tags', { "datas": photographer.tags })
	profileDescriptionContainer.appendChild(tags.create());

	let profilePicContainer = document.getElementsByClassName('profile__photo')[0];
	profilePicContainer.innerHTML = '';
	let profilePic = document.createElement('img');
	profilePic.className = 'profilePic--rounded';
	profilePic.src = "../public/images/Photographers_ID_Photos/"+ photographer.profilePic;
	profilePicContainer.appendChild(profilePic);

	let contactBtn = document.getElementsByClassName('action-contact')[0];
	contactBtn.addEventListener('click', (e) => {
		console.log('CONTACT  => ', photographer.username);
		// TODO : Contact function
	}, false);

	let likes = document.getElementById('nbLikes');
	let price = document.getElementById('price');
	likes.innerText = '';
	price.innerText = '';

	likes.innerText = photographer.totalLikes
	price.innerText = photographer.price + "€/jour";

	initPhotographerMedias(photographer.id);
}

function initPhotographerMedias(photographerId) {
	if (!!photographerId) {
		let gallery = document.getElementById('galery_list');
		let allMedias = getAllMediasByPhotographer(photographerId);
		if (allMedias.length > 0) {
			allMedias.forEach(data => {
				let media;
				if (data.image) media = new Medias(data.id, data.photographerId, data.title, data.image, data.tags, data.likes, data.date, data.price)
				if (data.video) media = new Medias(data.id, data.photographerId, data.title, data.video, data.tags, data.likes, data.date, data.price)
				let mediaCard = new View("card", { "datas": media })
				gallery.append(mediaCard.create());

			});

			// TODO 1 : Ajouter une action au click du like !

		}
	} else {
		// error photographerId
	}
}

// TODO 2 : Pour le sorting, Il faut récupérer la liste dans l'ordre de tous les ids de media, ensuite on peut trouver le media précédant et le suivant !


function getAllMediasByPhotographer(id) {
	return MediaDatas.findMediasByPhotographer(id);
}


export {
	initDetails,
}