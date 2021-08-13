import * as Home from "./controller/home.js" ;
import * as Details from "./controller/details.js" ;

if (document.getElementsByTagName('title')[0].innerHTML.indexOf('Home') !== -1) {
	Home.initHome()
} else if (document.getElementsByTagName('title')[0].innerHTML.indexOf('Détail') !== -1) {
	Details.initDetails();
}
