/**
 * Saison, moment et rendez-vous du jour, calculés dans le navigateur (heure de Paris)
 * et posés sur <html> avant l'affichage : data-saison, data-moment, data-evt.
 * Tout le reste du site (CSS, scène de l'accueil, espace abonné) lit ces attributs.
 */
import { saisons, site } from '../data/site';

const reglages = JSON.stringify({ ...saisons, lancement: site.lancementISO });

/** Script à placer tel quel dans le <head> (is:inline) */
export const scriptSaison = `(function(){
var R=${reglages};var h=document.documentElement;
function paris(){var d=new Date();try{return new Date(d.toLocaleString('en-US',{timeZone:'Europe/Paris'}));}catch(e){return d;}}
var d=paris(),md=('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2),hr=d.getHours();
function entre(a,b){return a<=b?(md>=a&&md<=b):(md>=a||md<=b);}
var D=R.debuts,s=md>=D.hiver||md<D.printemps?'hiver':md<D.ete?'printemps':md<D.automne?'ete':'automne';
var m=(hr>=R.soir.debut||hr<R.soir.fin)?'nuit':'jour';
var lance=d>=new Date(R.lancement);
var e=(lance&&d.getDay()===6&&hr>=9&&hr<12)?'samedi':entre(R.noel.du,R.noel.au)?'noel':entre(R.rentree.du,R.rentree.au)?'rentree':'aucun';
if(R.forcer)s=R.forcer;
try{var q=new URLSearchParams(location.search);s=q.get('saison')||s;m=q.get('moment')||m;e=q.get('evt')||e;}catch(x){}
if(!R.actives){h.dataset.saisons='off';return;}
h.dataset.saison=s;h.dataset.moment=m;h.dataset.evt=e;
window.clemiSaison={saison:s,moment:m,evt:e,lance:lance,lancement:R.lancement,paris:paris};
var ic=s==='hiver'?(e==='noel'?'favicon-noel.svg':'favicon-hiver.svg'):null;
if(ic){document.addEventListener('DOMContentLoaded',function(){var l=document.querySelector('link[rel=icon]');if(l)l.href=l.href.replace(/favicon[^/]*\\.svg$/,ic);});}
})();`;
