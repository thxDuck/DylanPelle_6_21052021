import * as Home from "./controller/home.js" ;

let tagList = Home.getTagList();
console.log('tagList => ', tagList);

let photographer = Home.getPhotographer(930);
console.log('photographer => ', photographer);

// console.log(Home.home.getPhotographer(980))

// let dydy = new Photographer(930, 'Dydy', 'La chap', 'France', ["games", "nature"], "Day by day", 8000, "usere.jpg");



