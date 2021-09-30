import View from "../classes/factory/View.js";
import Medias from "../classes/Medias.js";
import Photographer from "../classes/Photographers.js";
import MediaDatas from "../models/Medias.js";
import PhotographersDatas from "../models/Photographers.js";


// ######################################
//              Details
// ######################################






// ########################################
//				Global access
// ########################################


const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let totalMedia = 1;
let currentOrder = null;
let photographerId = null;
let modal = null;
let sortBy = null;
let PHOTOGRAPHER = null



// ########################################
//			Init, display and order
// ########################################

/**
 * Init page for the photographer, with id of photographer passed in param
 */
function initDetails() {
	let urlParam = document.location.href.substring(document.location.href.indexOf('photographer='))
	let id = parseInt(urlParam.substring(urlParam.indexOf('=') + 1));
	let userDatas = PhotographersDatas.findPhotographerById(id);
	if (!!userDatas) {
		let photographer = new Photographer(userDatas.id, userDatas.name, userDatas.city, userDatas.country, userDatas.tags, userDatas.tagline, userDatas.price, userDatas.portrait);
		PHOTOGRAPHER = photographer;
		fillPhotographerProfile(photographer);
	} else {
		document.querySelector('.main').classList += " blur";
		alert("Le photographe n'existe pas, veuillez retourner sur la page d'accueil et séléctionner un photographe.")
		document.location.href = "http://127.0.0.1:5501/";

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
	profilePic.alt = "Profile picture of " + photographer.username;
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
				if (media.title == "Adventure Door, India") console.log('MEDIA => ', media);
				let mediaCard = new View("card", { "datas": media })
				gallery.append(mediaCard.create());
				gallery.lastChild.id = order;
				order++;
				totalMedia++;
			});

			addEventForLikes();
			addEventForMedia();
			document.querySelector(".action-contact").addEventListener("click", openContactModal);

			// TODO 1 : Ajouter une action au click du like !

		}
	} else {
		// error photographerId
	}
}

function getAllMediasByPhotographer(id) {
	let allMedias = MediaDatas.findMediasByPhotographer(id);
	if (!!sortBy) {
		switch (sortBy) {
			case "popularity":
				console.log('POPU');
				allMedias.sort((a, b) => {
					let nbLikesA = a.likes, nbLikesB = b.likes;
					if (nbLikesA < nbLikesB)
						return 1
					if (nbLikesA > nbLikesB)
						return -1
					return 0;
				});
				break;

			case "date":
				console.log('DATE');
				allMedias.sort((a, b) => {
					let dateA = new Date(a.date), dateB = new Date(b.date);
					if (dateA < dateB)
						return -1
					if (dateA > dateB)
						return 1
					return 0;
				});
				break;

			case "name":
				console.log('NAME');
				allMedias.sort((a, b) => {
					let nameA = a.title, nameB = b.title;
					if (nameA < nameB)
						return -1
					if (nameA > nameB)
						return 1
					return 0;
				});
				break;



			default:
				break;
		}
	}
	return allMedias;
}

// ########################################
//				Modals
// ########################################




// ########################################
//				LightBox
// ########################################


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


function displayMediaInLightbox(photographerId, idMedia) {
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

	displayMediaInLightbox(photographerId, idMedia);

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




// ########################################
//				Contact modal
// ########################################



const openContactModal = (e) => {
	e.preventDefault();

	document.getElementsByClassName('complementary__infos')[0].className += ' hidden';
	modal = document.getElementsByClassName('modal-contact')[0];
	modal.className = modal.className.replace("hidden", "");
	modal.setAttribute("aria-hidden", "false");
	modal.setAttribute("aria-modal", "true");
	document.querySelector('#aria-name-modal').innerText = "Contact me " + PHOTOGRAPHER.username + "."
	modal.addEventListener('click', closeContactModal);
	document.querySelector('.close').addEventListener('click', closeContactModal);
	let contact = document.getElementsByClassName('contact')[0]
	contact.addEventListener('click', stopPropagation);

	fillDataContact();

}


function closeContactModal(e) {
	if (modal === null) return
	e.preventDefault();

	document.getElementsByClassName('complementary__infos')[0].className = "complementary__infos"
	document.getElementsByClassName('modal-contact')[0].className += ' hidden';

	modal.setAttribute("aria-hidden", "true");
	modal.setAttribute("aria-modal", "false");

	modal.removeEventListener('click', closeContactModal);
	document.getElementById('close').removeEventListener('click', closeContactModal);
	let lightbox = document.getElementsByClassName('lightbox')[0]
	lightbox.removeEventListener('click', stopPropagation);

	modal = null;
}


const fillDataContact = (e) => {
	document.getElementById('titleContact').innerHTML = PHOTOGRAPHER.username;
	document.querySelector('.btn-send-msg').addEventListener('click', sendMsgToPhotographer)

}
function removeErrors() {
	let glowError = document.querySelectorAll('.glow-error');
	let invalidArias = document.querySelectorAll('[aria-invalid ="true"]')
	let errorsMessages = document.querySelectorAll('.error');
	for (let i = 0; i < glowError.length; i++) {
		glowError[i].classList = ""
	}
	for (let i = 0; i < errorsMessages.length; i++) {
		errorsMessages[i].innerHTML = "";
	}
	for (let i = 0; i < invalidArias.length; i++) {
		invalidArias[i].setAttribute('aria-invalid', false)
	}

}
const sendMsgToPhotographer = (e) => {
	e.preventDefault();
	removeErrors();
	let datas = getMessageFromModal();
	if (datas.hasErrors) {
		for (let i = 0; i < Object.keys(datas.errors).length; i++) {
			const elName = Object.keys(datas.errors)[i];
			let inputElement = document.getElementById(elName);
			let msg = datas.errors[elName];
			inputElement.classList = elName + ' glow-error';
			document.querySelector('.' + elName + '-error').innerHTML = msg
			inputElement.setAttribute("aria-invalid", true)
		}
	} else {
		console.log('User send datas to ', PHOTOGRAPHER.username, ' :');
		for (let i = 0; i < Object.keys(datas.datas).length; i++) {
			const elName = Object.keys(datas.datas)[i];
			console.log('His ', elName, ' : ', datas.datas[elName]);
		}
	}


}
function controlEmail(email) {
	if (email || email.length >= 7) {
		if (EMAIL_REGEXP.test(email)) {
			return { success: true };
		} else {
			return { success: false, msg: "Veuillez rentrer une adresse email valide." };
		}
	} else {
		return { success: false, msg: "Une adresse e-mail contiens au moins 7 caractères." };
	}



}

function getMessageFromModal() {
	let errors = {};
	let hasErrors = false;
	let datas = {
		"first-name": null,
		"last-name": null,
		"email": null,
		"message": null
	};

	for (let i = 0; i < Object.keys(datas).length; i++) {
		let elementName = Object.keys(datas)[i];
		let inputElement = document.getElementById(elementName)
		let value = inputElement.value;
		if (!!value && typeof value === "string") {
			if (value.length >= 2 && value.length < 500) {
				if (elementName === "email") {
					let emailValid = controlEmail(value);
					if (!emailValid.success) {
						errors[elementName] = emailValid.msg;
						hasErrors = true;
					}
				}
				datas[elementName] = value;
			} else {
				errors[elementName] = value.length < 2 ? "Merci de saisir au moins 2 caracrètes." : "Vous avez atteint la limite de caractère autorisé (500 cacatères maximum);";
				hasErrors = true;
			}
		} else {
			errors[elementName] = "Cette information est obligatoire.";
			hasErrors = true;
		}
	}
	return { datas: datas, hasErrors: hasErrors, errors: errors }

}
// ########################################
//				Utilities
// ########################################


const arrowNavigation = (e) => {
	if (!!!modal) return;
	if (e.key === "ArrowRight") {
		fillLightBoxWithMedia('next');
	} else if (e.key === "ArrowLeft") {
		fillLightBoxWithMedia('prev');
	}
}

function addEventForMedia() {
	let allMedias = document.getElementsByClassName('galery__item__photo');
	for (let i = 0; i < allMedias.length; i++) {
		allMedias[i].addEventListener("click", openLightbox);
	}
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

const stopPropagation = function (e) {
	e.stopPropagation();
}

window.addEventListener("keydown", (e) => {
	if (e.key === "Escape" || e.key === "Esc") {
		if (!!modal) {
			if (modal.className.indexOf("modal-lightbox") > -1) closeLightbox(e);
			if (!!modal && modal.className.indexOf("modal-contact") > -1) closeContactModal(e);
		}


	}
});

export {
	initDetails,
};
