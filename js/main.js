import * as Home from "./controller/home.js" ;
import * as Details from "./controller/details.js" ;

if (document.location.href.indexOf('index.html') !== -1) {
	Home.initHome()
} else if (document.location.href.indexOf('hotographer_details.html') !== -1) {
	Details.initDetails();
}
