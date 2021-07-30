import PhotographersDatas from "../models/Photographers.js";
import MediaDatas from "../models/Medias.js";
// import Photographer from "./classes/Photographers.js";


// ######################################
//              Photographers
// ######################################



function getAllPhotographers() {
    return PhotographersDatas.findAllPhotographers();
};

function getPhotographer(id) {
    return PhotographersDatas.findPhotographerById(id);
};

function getAllMediasByPhotographer(id) {
    return MediaDatas.findMediasByPhotographer(id);
};


function getTagList() {
    const photographerList = PhotographersDatas.findAllPhotographers();
    if (photographerList.length > 0) {
        let tagList = [];
        photographerList.forEach(photographer => {
            photographer.tags.forEach(tag => {
                if (tagList.indexOf(tag) === -1) {
                    tagList.push(tag);
                }
            });
        });
        return tagList;
    } else {
        return false;
    }
};




export { getTagList, getAllMediasByPhotographer, getAllPhotographers, getPhotographer }