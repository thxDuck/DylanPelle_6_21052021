// ########################################
//			Imports / Global var access
// ########################################

import View from "../classes/factory/View.js";
import Medias from "../classes/Medias.js";
import Photographer from "../classes/Photographers.js";
import MediaDatas from "../models/Medias.js";
import PhotographersDatas from "../models/Photographers.js";

const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let numberTotalMedia = 1;
let currentOrder = null;
let photographerId = null;
let modal = null;
let sortBy = null;
let PHOTOGRAPHER = null
let MAIN_CONTENT = document.getElementsByClassName("main")[0];
let alreadyLike = []

// ########################################
//			Init, display and order
// ########################################

/**
 * Initialize photographer page, get his ID by url parameter,
 */
const initDetails = () => {
	let urlParam = document.location.href.substring(document.location.href.indexOf('photographer='))
	let id = parseInt(urlParam.substring(urlParam.indexOf('=') + 1));
	let userDatas = PhotographersDatas.findPhotographerById(id);
	if (!!userDatas) {
		let photographer = new Photographer(userDatas.id, userDatas.name, userDatas.city, userDatas.country, userDatas.tags, userDatas.tagline, userDatas.price, userDatas.portrait);
		PHOTOGRAPHER = photographer;
		fillPhotographerProfile(photographer);
	} else {
		document.querySelector('.main').classList += " blur";
		alert("Le photographe n'existe pas, veuillez retourner sur la page d'accueil et séléctionner un photographe.");
		document.getElementsByClassName('header__logo')[0].click();
	}

	document.getElementById('galery-sort').addEventListener('change', (e) => {
		let select = document.getElementById('galery-sort');
		sortBy = select.value;
		initPhotographerMedias(photographerId);
	})

}

const fillPhotographerProfile = (photographer) => {
	let profileDescriptionContainer = document.getElementsByClassName('profile__description')[0];
	profileDescriptionContainer.innerHTML = '';
	let title = new View('title', { "options": 'h1', "datas": photographer.username });
	profileDescriptionContainer.append(title.create());

	let description = new View('description', { 'datas': photographer });
	profileDescriptionContainer.append(description.create());

	let tags = new View('tags', { "datas": photographer.tags })
	profileDescriptionContainer.appendChild(tags.create());

	let profilePicContainer = document.getElementsByClassName('profile__photo')[0];
	profilePicContainer.innerHTML = '';
	let profilePic = document.createElement('img');
	profilePic.className = 'profilePic--rounded';
	profilePic.src = "../images/Photographers_ID_Photos/" + photographer.profilePic;
	profilePic.alt = photographer.username;
	profilePicContainer.appendChild(profilePic);

	let likes = document.getElementById('nbLikes');
	let price = document.getElementById('price');
	likes.innerText = '';
	price.innerText = '';

	likes.innerText = photographer.totalLikes
	price.innerText = photographer.price + "€/jour";
	photographerId = photographer.id
	initPhotographerMedias(photographer.id);
}

const initPhotographerMedias = (photographerId) => {
	if (!!photographerId) {
		let gallery = document.getElementById('galery_list');
		gallery.innerHTML = "";

		let allMedias = getAllMediasByPhotographer(photographerId);
		if (allMedias.length > 0) {
			let order = 1;
			numberTotalMedia = 0;
			allMedias.forEach(data => {
				let media;
				if (data.image) media = new Medias(data.id, data.photographerId, data.title, data.image, data.tags, data.likes, data.date, data.price)
				if (data.video) media = new Medias(data.id, data.photographerId, data.title, data.video, data.tags, data.likes, data.date, data.price)
				let mediaCard = new View("card", { "datas": media })
				gallery.append(mediaCard.create());
				gallery.lastChild.id = order;
				order++;
				numberTotalMedia++;
			});

			addEventForLikes();
			addEventForMedia();
			document.querySelector(".action-contact").addEventListener("click", openContactModal);
		}
	} else {
		document.querySelector('.main').classList += " blur";
		alert("Aucun média troué pour ce photographe, merci d'en séléctionner un autre.");
		document.getElementsByClassName('header__logo')[0].click();
	}
}

const getAllMediasByPhotographer = (id = undefined) => {
	if (!!id) {
		let allMedias = MediaDatas.findMediasByPhotographer(id);
		if (!!sortBy) {
			switch (sortBy) {
			case "popularity":
				allMedias.sort((a, b) => {
					let nbLikesA = a.likes, nbLikesB = b.likes;
					if (nbLikesA < nbLikesB) return 1
					if (nbLikesA > nbLikesB) return -1
					return 0;
				});
				break;

			case "date":
				allMedias.sort((a, b) => {
					let dateA = new Date(a.date), dateB = new Date(b.date);
					if (dateA < dateB) return -1
					if (dateA > dateB) return 1
					return 0;
				});
				break;

			case "name":
				allMedias.sort((a, b) => {
					let nameA = a.title, nameB = b.title;
					if (nameA < nameB) return -1
					if (nameA > nameB) return 1
					return 0;
				});
				break;
			default:
				break;
			}
		}
		return allMedias;
	} else {
		document.querySelector('.main').classList += " blur";
		alert("Une erreur est survenue, merci de réessayer plus tard.");
		document.getElementsByClassName('header__logo')[0].click();
	}
}






// ########################################
//				LightBox
// ########################################

const setTabIndex = (element = false) => {
	let tabToRemove = document.querySelectorAll('.tab-control');
	if (tabToRemove.length > 0) {
		for (let i = 0; i < tabToRemove.length; i++) {
			tabToRemove[i].removeAttribute('tabindex');
		}
	}

	if (!!element) {
		let tabToSet = document.querySelectorAll('.tab-' + element);
		for (let i = 0; i < tabToSet.length; i++) {
			let order = tabToSet[i].attributes["data-order"].value
			tabToSet[i].setAttribute("tabindex", order);
		}
	}

};

const openLightbox = (e) => {
	e.preventDefault();

	setTabIndex('lightbox');

	MAIN_CONTENT.classList.add("hidden");
	MAIN_CONTENT.setAttribute("aria-hidden", "true");
	MAIN_CONTENT.setAttribute("tabindex", "-1");
	setTimeout(() => {
		let conctactModal = document.getElementsByClassName('modal-contact')[0];
		conctactModal.setAttribute("tabindex", "-1");
		conctactModal.classList.add("hidden");
		conctactModal.classList.add("disabdisableOnPage");
		conctactModal.setAttribute("aria-hidden", "true");
	}, 200);

	document.getElementsByClassName('complementary__infos')[0].className += ' hidden';

	modal = document.getElementsByClassName('modal-lightbox')[0];
	modal.className = modal.className.replace("hidden", "");
	modal.setAttribute("aria-hidden", "false");
	modal.setAttribute("aria-modal", "true");

	document.getElementsByClassName('lightbox')[0].addEventListener('click', stopPropagation);
	document.getElementsByClassName('lightbox__action--close ')[0].addEventListener('click', closeLightbox);
	modal.addEventListener('click', closeLightbox);

	let prevAction = document.getElementById("prev");
	let nextAction = document.getElementById("next");
	prevAction.addEventListener('click', fillLightBoxWithMedia)
	nextAction.addEventListener('click', fillLightBoxWithMedia)
	// window.addEventListener("keydown", arrowNavigation);

	let order = !isNaN(parseInt(e.target.parentElement.parentElement.id)) ? parseInt(e.target.parentElement.parentElement.id) : parseInt(e.target.parentElement.id);
	currentOrder = order;
	fillLightBoxWithMedia(e);
}

const closeLightbox = (e) => {
	if (modal === null) return
	let conctactModal = document.getElementsByClassName('modal-contact')[0];
	conctactModal.removeAttribute("tabindex");
	setTabIndex()
	e.preventDefault();
	currentOrder = null;
	MAIN_CONTENT.classList.remove("hidden")
	MAIN_CONTENT.setAttribute("aria-hidden", "false");
	MAIN_CONTENT.removeAttribute("tabindex");
	document.getElementsByClassName('modal-contact')[0].classList.add("disabdisableOnPage");
	document.getElementsByClassName('modal-lightbox')[0].className += ' hidden';
	document.getElementsByClassName('complementary__infos')[0].className = "complementary__infos"

	document.getElementsByClassName('lightbox__action--close ')[0].removeEventListener('click', closeLightbox);
	document.getElementsByClassName('lightbox')[0].removeEventListener('click', stopPropagation);
	let prevAction = document.getElementById("prev");
	let nextAction = document.getElementById("next");
	prevAction.removeEventListener('click', fillLightBoxWithMedia)
	nextAction.removeEventListener('click', fillLightBoxWithMedia)

	modal.setAttribute("aria-hidden", "true");
	modal.setAttribute("aria-modal", "false");
	modal.removeEventListener('click', closeLightbox);
	modal = null;
}

/**
 * Display media in the lightbox
 * @param {Ids} photographerId Needed to select media in db, REQUIRED beacause some medias have same id
 * @param {Id} idMedia Needed to display media in the lightbox
 */
const displayMediaInLightbox = (photographerId, idMedia) => {
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
		}

		lightboxMedia.append(mediaElement);

		lightboxMedia.setAttribute('aria-haspopup', 'lightbox-dialog')
		lightboxMedia.setAttribute('aria-control', 'lightbox-dialog')
		let lightboxTitle = document.getElementsByClassName('lightbox__media--title')[0];
		lightboxTitle.innerHTML = mediaInfos.title;
		setTimeout(() => {
			document.querySelector('.lightbox').setAttribute("tabindex", "0");
		}, 500)
	} else {
		return;
	}
}

const fillLightBoxWithMedia = (e) => {
	let type;
	let order = currentOrder;
	if (!!e.key) {
		if (e.key === "ArrowRight") {
			type = "next";
		} else if (e.key === "ArrowLeft") {
			type = "prev";
		}
	} else {
		e.preventDefault();
		if (!!e) {
			if (!!e.target) {
				type = e.target.id;
			} else {
				type = e;
			}
		}
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

	if (order <= 0 || order > numberTotalMedia) {
		return false;
	}
	currentOrder = order;
	order = parseInt(order)
	if (!document.getElementById(order)) return;
	let idMedia = parseInt((document.getElementById(order).children[0].id).replace("mediaId-", ""));
	if (!!!idMedia) return
	let urlParam = document.location.href.substring(document.location.href.indexOf('photographer='))
	let photographerId = parseInt(urlParam.substring(urlParam.indexOf('=') + 1));

	displayMediaInLightbox(photographerId, idMedia);

	let prevAction = document.getElementById("prev");
	let nextAction = document.getElementById("next");
	let prevMediaOrder = document.getElementById(order - 1);
	let nextMediaOrder = document.getElementById(order + 1);

	if (!!!prevMediaOrder) {
		prevAction.classList.add('actionDisabled')
	} else {
		if (prevAction.classList.value.indexOf("actionDisabled") >-1) prevAction.classList.remove("actionDisabled");
	}
	if (!!!nextMediaOrder) {
		nextAction.classList.add('actionDisabled')
	} else {
		if (nextAction.classList.value.indexOf("actionDisabled") >-1) nextAction.classList.remove("actionDisabled");
	}

	setTimeout(() => {
		document.querySelector('.lightbox__media').focus();
	}, 100);
}





// ########################################
//				Contact modal
// ########################################


const openContactModal = (e) => {
	e.preventDefault();

	MAIN_CONTENT.classList.add("hidden");
	MAIN_CONTENT.setAttribute("aria-hidden", "true");
	MAIN_CONTENT.setAttribute("tabindex", "-1");
	let lightboxModal = document.getElementsByClassName('modal-lightbox')[0];
	lightboxModal.setAttribute("aria-hidden", "true");
	lightboxModal.classList.add("hidden");
	document.getElementsByClassName('complementary__infos')[0].className += ' hidden';

	modal = document.getElementsByClassName('modal-contact')[0];
	modal.className = modal.className.replace("hidden", "");
	modal.setAttribute("aria-hidden", "false");
	modal.setAttribute("aria-modal", "true");
	modal.addEventListener('click', closeContactModal);

	document.querySelector('#aria-name-modal').innerText = "Contact me " + PHOTOGRAPHER.username + "."
	document.querySelector('.modal-contact .close').addEventListener('click', closeContactModal);

	let contact = document.getElementsByClassName('contact')[0]
	contact.addEventListener('click', stopPropagation);

	fillDataContact();
}

const closeContactModal = (e) => {
	if (modal === null) return

	MAIN_CONTENT.classList.remove("hidden")
	MAIN_CONTENT.setAttribute("aria-hidden", "false");
	MAIN_CONTENT.removeAttribute("tabindex");
	document.getElementsByClassName('complementary__infos')[0].className = "complementary__infos"
	document.getElementsByClassName('modal-contact')[0].className += ' hidden';

	modal.setAttribute("aria-hidden", "true");
	modal.setAttribute("aria-modal", "false");
	modal.removeEventListener('click', closeContactModal);
	modal = null;

	let lightbox = document.getElementsByClassName('lightbox')[0]
	lightbox.removeEventListener('click', stopPropagation);
	document.getElementById('close').removeEventListener('click', closeContactModal);

	document.getElementsByClassName('action-contact')[0].focus();
}

/**
 * Remove errors message in form
 */
const removeErrors = () => {
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

/**
 * Display error if there has, or display datas to send to photgrapher.
 * @param {Event} e Function call on sumbit contact form
 *
 * @returns Json datas
 */
const sendMsgToPhotographer = (e) => {
	e.preventDefault();
	removeErrors();
	let resultCheck = getAndValidMessageFromModal();
	if (resultCheck.hasErrors) {
		for (let i = 0; i < Object.keys(resultCheck.errors).length; i++) {
			const elName = Object.keys(resultCheck.errors)[i];
			let inputElement = document.getElementById(elName);
			let msg = resultCheck.errors[elName];
			inputElement.classList = elName + ' glow-error';
			document.querySelector('.' + elName + '-error').innerHTML = msg
			inputElement.setAttribute("aria-invalid", true)
		}
		document.querySelector('#alert-success')[0].classList.add("hidden");
		document.querySelector('[aria-invalid="true"]').focus();
	} else {
		console.log('User send datas to ', PHOTOGRAPHER.username, ' :');

		// SEND_TO_BACK => resultCheck.datas

		for (let i = 0; i < Object.keys(resultCheck.datas).length; i++) {
			const elName = Object.keys(resultCheck.datas)[i];
			console.log('  - His ', elName, ' : ', resultCheck.datas[elName]);
		}

		document.querySelector('#alert-success').classList.remove("hidden");
		setTimeout(() => {
			document.getElementsByClassName('close-contact')[0].click(e);
		}, 3000);
	}
}

const controlEmail = (email) => {
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

/**
 * 	Get all datas from contact-form modal and check if is valid
 *
 * @returns JSON with Validate datas capture by user AND throw errors messages if some input is'nt valid
 */
const getAndValidMessageFromModal = () => {
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
				errors[elementName] = value.length < 2 ? "Merci de saisir au moins 2 caractères." : "Vous avez atteint la limite de caractères autorisé (500 cacatères maximum);";
				hasErrors = true;
			}
		} else {
			errors[elementName] = "Merci de saisir votre "+ traductElementsForms(elementName) +".";
			hasErrors = true;
		}
	}
	return { datas: datas, hasErrors: hasErrors, errors: errors }
}

const fillDataContact = (e) => {
	document.getElementById('titleContact').innerHTML = PHOTOGRAPHER.username;
	document.querySelector('.btn-send-msg').addEventListener('click', sendMsgToPhotographer)
	setTimeout(() => {
		document.getElementsByClassName('close-contact')[0].focus();
	}, 200);
}

const traductElementsForms = (elementName = undefined) => {
	if (!!elementName) {
		switch (elementName) {
		case "last-name": return "nom";
		case "first-name": return "prénom";
		case "email": return "email";
		case "message": return "message";
		default:
			break;
		}
	}
}




// ########################################
//				EVENTS / UTILITIES
// ########################################


window.addEventListener("keydown", (e) => {
	if (!!modal) {
		if (e.key === "Escape" || e.key === "Esc") {
			if (modal.className.indexOf("modal-lightbox") > -1) closeLightbox(e);
			if (!!modal && modal.className.indexOf("modal-contact") > -1) closeContactModal(e);
		} else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
			fillLightBoxWithMedia(e);
		}
	}
});


const addEventForMedia = () => {
	let allMedias = document.getElementsByClassName('galery__item__photo');
	for (let i = 0; i < allMedias.length; i++) {
		allMedias[i].addEventListener("click", (e) => {
			openLightbox(e);
			setTimeout(() => {
			}, 600);

		});

	}
}

const addEventForLikes = () => {
	let allLikes = document.getElementsByClassName('mediaLike');
	const totalLikeElement = document.getElementById('nbLikes');
	let nblikes = parseInt(totalLikeElement.innerText);

	if (allLikes.length > 0 && typeof nblikes === "number") {
		for (let i = 0; i < allLikes.length; i++) {
			let like = allLikes[i];
			like.addEventListener('click', (e) => {
				if (alreadyLike.indexOf(like.id) === -1) {
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
					alreadyLike.push(like.id);

					// SEND_TO_BACK

				}
			}, false)

		}
	}
}

const stopPropagation = function(e) {
	e.stopPropagation();
}

export { initDetails };
