import PhotographersDatas from "../models/Photographers.js";
import MediaDatas from "../models/Medias.js";
import Photographer from "../classes/Photographers.js";
import View from "../classes/factory/View.js";


// ######################################
//              Details
// ######################################

function initDetails() {
	let urlParam = document.location.href.substring(document.location.href.indexOf('photographer='))
	let PhotographerId = urlParam.substring(urlParam.indexOf('=') + 1);
	console.log('PhotographerId ', PhotographerId);
}





function getAllMediasByPhotographer(id) {
	return MediaDatas.findMediasByPhotographer(id);
}


export {
	initDetails,
}