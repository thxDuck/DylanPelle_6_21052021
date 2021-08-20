import View from "../classes/factory/View.js";
import Medias from "../classes/Medias.js";
import Photographer from "../classes/Photographers.js";
import MediaDatas from "../models/Medias.js";
import PhotographersDatas from "../models/Photographers.js";


// ######################################
//              Details
// ######################################



let totalMedia = 1;
let currentOrder = null;
let photographerId = null;
let modal = null;
let sortBy = null;



function initDetails() {
	let urlParam = document.location.href.substring(document.location.href.indexOf('photographer='))
	let id = parseInt(urlParam.substring(urlParam.indexOf('=') + 1));
	let userDatas = PhotographersDatas.findPhotographerById(id);
	if (!!userDatas) {
		let photographer = new Photographer(userDatas.id, userDatas.name, userDatas.city, userDatas.country, userDatas.tags, userDatas.tagline, userDatas.price, userDatas.portrait);
		fillPhotographerProfile(photographer);
	}


document.getElementById('sort-media').addEventListener('change', (e) => {
	let select = document.getElementById('sort-media')
	console.log('select => ', select.value);
	sortBy = select.value;
	console.log('sortBy => ', sortBy);
	initPhotographerMedias(photographerId)
})

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
	profilePic.src = "../public/images/Photographers_ID_Photos/" + photographer.profilePic;
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
	photographerId = photographer.id
	initPhotographerMedias(photographer.id);
}

function initPhotographerMedias(photographerId) {
	if (!!photographerId) {

		let gallery = document.getElementById('galery_list');
		gallery.innerHTML = "";
		let allMedias = getAllMediasByPhotographer(photographerId);
		if (allMedias.length > 0) {
			let order = 1;
			totalMedia = 0;
			allMedias.forEach(data => {
				let media;
				if (data.image) media = new Medias(data.id, data.photographerId, data.title, data.image, data.tags, data.likes, data.date, data.price)
				if (data.video) media = new Medias(data.id, data.photographerId, data.title, data.video, data.tags, data.likes, data.date, data.price)
				let mediaCard = new View("card", { "datas": media })
				gallery.append(mediaCard.create());
				gallery.lastChild.id = order;
				order++;
				totalMedia++;
			});

			addEventForLikes();
			addEventForMedia();

			// TODO 1 : Ajouter une action au click du like !

		}
	} else {
		// error photographerId
	}
}




function addEventForMedia() {
	let allMedias = document.getElementsByClassName('galery__item__photo');
	for (let i = 0; i < allMedias.length; i++) {
		allMedias[i].addEventListener("click", openLightbox);
	}
}





let fillLightBoxWithMedia = function (e) {
	let type;
	let order = currentOrder;
	console.log('Last media id => ', totalMedia);
	if (!!e) {
		if (!!e.target) {
			type = e.target.id;
		} else {
			type = e;
		}
		switch (type) {
			case "next":
				order = order + 1;
				break;
			case "prev":
				order = order - 1;
				break;
			default:
				break;
		}
	}

	if (order <= 0 || order > totalMedia) {
		console.log('END REACH => ');
		order
		return false;
	}
	currentOrder = order;
	console.log('print order  => ', order);
	order = parseInt(order)
	if (!document.getElementById(order)) return;
	let idMedia = parseInt(document.getElementById(order).children[0].id);
	if (!!!idMedia) return
	let urlParam = document.location.href.substring(document.location.href.indexOf('photographer='))
	let photographerId = parseInt(urlParam.substring(urlParam.indexOf('=') + 1));

	displayMedia(photographerId, idMedia);

	let prevAction = document.getElementsByClassName("prev")[0];
	let nextAction = document.getElementsByClassName("next")[0];
	let prevMediaOrder = document.getElementById(order - 1);
	let nextMediaOrder = document.getElementById(order + 1);


	if (!!!prevMediaOrder) {
		prevAction.classList = "fas fa-chevron-left prev actionDisabled";
	} else {
		prevAction.classList = "fas fa-chevron-left prev";
	}
	if (!!!nextMediaOrder) {
		nextAction.classList = "fas fa-chevron-right next actionDisabled";
	} else {
		nextAction.classList = "fas fa-chevron-right next";
	}

}

const openLightbox = (e) => {
	e.preventDefault();
	let order = parseInt(e.target.parentElement.parentElement.id)

	document.getElementsByClassName('complementary__infos')[0].className += ' hidden';
	modal = document.getElementsByClassName('modal-lightbox')[0];
	modal.className = modal.className.replace("hidden", "");
	modal.setAttribute("aria-hidden", "false");
	modal.setAttribute("aria-modal", "true");

	modal.addEventListener('click', closeLightbox);
	document.getElementById('close').addEventListener('click', closeLightbox);
	let lightbox = document.getElementsByClassName('lightbox')[0]
	lightbox.addEventListener('click', stopPropagation);


	let prevAction = document.getElementsByClassName("prev")[0];
	let nextAction = document.getElementsByClassName("next")[0];

	prevAction.addEventListener('click', fillLightBoxWithMedia)
	nextAction.addEventListener('click', fillLightBoxWithMedia)
	window.addEventListener("keydown", arrowNavigation);

	currentOrder = order;
	fillLightBoxWithMedia();

}

function closeLightbox(e) {
	if (modal === null) return
	e.preventDefault();
	currentOrder = null;

	document.getElementsByClassName('modal-lightbox')[0].className += ' hidden';
	document.getElementsByClassName('complementary__infos')[0].className = "complementary__infos"

	modal.setAttribute("aria-hidden", "true");
	modal.setAttribute("aria-modal", "false");

	modal.removeEventListener('click', closeLightbox);
	document.getElementById('close').removeEventListener('click', closeLightbox);
	let lightbox = document.getElementsByClassName('lightbox')[0]
	lightbox.removeEventListener('click', stopPropagation);

	let prevAction = document.getElementsByClassName("prev")[0];
	let nextAction = document.getElementsByClassName("next")[0];
	prevAction.removeEventListener('click', fillLightBoxWithMedia)
	nextAction.removeEventListener('click', fillLightBoxWithMedia)

	modal = null;

	window.removeEventListener("keydown", arrowNavigation)

}

function addEventForLikes() {
	let allLikes = document.getElementsByClassName('mediaLike');
	const totalLikeElement = document.getElementById('nbLikes');
	let nblikes = parseInt(totalLikeElement.innerText);

	// TODO ! Un seul like par personnes ! :D

	if (allLikes.length > 0 && typeof nblikes === "number") {
		for (let i = 0; i < allLikes.length; i++) {
			let like = allLikes[i];
			like.addEventListener('click', (e) => {
				let nbLikeOfMediaElement = document.getElementById('like-' + like.id)
				let mediaLikes = parseInt(nbLikeOfMediaElement.innerText);
				let total = parseInt(totalLikeElement.innerText);

				nbLikeOfMediaElement.innerText = mediaLikes + 1;
				totalLikeElement.innerText = total + 1;

				let totalLikeAdnValue = document.getElementsByClassName('complementary__infos--popularity')[0];
				totalLikeAdnValue.classList += " pop";
				setTimeout(() => {
					totalLikeAdnValue.classList = "complementary__infos--popularity";
				}, 300);
			}, false)

		}
	}
}


// TODO 2 : Pour le sorting, Il faut récupérer la liste dans l'ordre de tous les ids de media, ensuite on peut trouver le media précédant et le suivant !


function getAllMediasByPhotographer(id) {
	let allMedias = MediaDatas.findMediasByPhotographer(id);
	if (!!sortBy) {

		/*
.sort((a, b) => { // SORT BY CREATED DATE
				let nameA = a.name, nameB = b.name;
				if (nameA < nameB) //sort string ascending
					return -1
				if (nameA > nameB)
					return 1
				return 0 //default return value (no sorting)
			});

		 */

		switch (sortBy) {
			case "popularity":
				console.log('POPU');
				allMedias.sort((a, b) => {
					let nbLikesA = a.likes, nbLikesB = b.likes;
					if (nbLikesA < nbLikesB) //sort string ascending
					return 1
					if (nbLikesA > nbLikesB)
					return -1
					return 0 //default return value (no sorting)
				});
				break;
				
				case "date":
				console.log('DATE');
				allMedias.sort((a, b) => {
					let dateA = new Date(a.date), dateB = new Date(b.date);
					if (dateA < dateB) //sort string ascending
					return -1
					if (dateA > dateB)
					return 1
					return 0 //default return value (no sorting)
				});
				break;
				
				case "name":
				console.log('NAME');
				allMedias.sort((a, b) => { // SORT BY CREATED DATE
					let nameA = a.title, nameB = b.title;
					if (nameA < nameB) //sort string ascending
						return -1
					if (nameA > nameB)
						return 1
					return 0 //default return value (no sorting)
				});
				break;



			default:
				break;
		}
	}
	return allMedias;


}

function displayMedia(photographerId, idMedia) {
	let media;
	let mediaInfos = MediaDatas.findMediaById(photographerId, idMedia)
	if (mediaInfos.image) media = new Medias(mediaInfos.id, mediaInfos.photographerId, mediaInfos.title, mediaInfos.image, mediaInfos.tags, mediaInfos.likes, mediaInfos.date, mediaInfos.price)
	if (mediaInfos.video) media = new Medias(mediaInfos.id, mediaInfos.photographerId, mediaInfos.title, mediaInfos.video, mediaInfos.tags, mediaInfos.likes, mediaInfos.date, mediaInfos.price)

	if (!!media) {

		let mediaSource = new View('source', {
			"datas": media
		});

		let lightboxMedia = document.getElementsByClassName('lightbox__media')[0];
		lightboxMedia.innerHTML = "";
		let mediaElement = mediaSource.create()
		// console.log('media.format => ', media.format);
		if (media.format === "video") {
			mediaElement.setAttribute("controls", "true")
			console.log('wait => ', mediaElement);
		}
		lightboxMedia.append(mediaElement);
		let lightboxTitle = document.getElementsByClassName('lightbox__media--title')[0];
		lightboxTitle.innerHTML = mediaInfos.title;


	} else {
		return;
	}
}



window.addEventListener("keydown", (e) => {
	if (e.key === "Escape" || e.key === "Esc") closeLightbox(e);
});


const arrowNavigation = (e) => {
	if (!!!modal) return;
	if (e.key === "ArrowRight") {
		fillLightBoxWithMedia('next');
	} else if (e.key === "ArrowLeft") {
		fillLightBoxWithMedia('prev');
	}
}

const stopPropagation = function (e) {
	e.stopPropagation();
}



export {
	initDetails,
};
