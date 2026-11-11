/* Visionneuse de Clémi Raconte, reprise telle quelle du site actuel. */

/* Visionneuse Clémi Raconte : affiche un PDF page par page, sans bouton de téléchargement.
   Usage : <div class="vz" data-docs='[{"titre":"L&#39;histoire","src":"assets/pdf/....pdf","texte":"id-du-texte"}]'></div>
   Si le document a un « texte » (id d'un <script type="application/json"> qui contient les paragraphes),
   il s'ouvre en liseuse sur téléphone : le texte en grand, page par page. */
(function(){
  if(!window.pdfjsLib){return;}
  pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}
  function telephone(){return window.innerWidth<820;}
  function monter(box){
    var docs=JSON.parse(box.getAttribute('data-docs')||'[]');if(!docs.length)return;
    var barre=el('div','vz-barre'),choix=el('div','vz-docs'),cmd=el('div','vz-cmd');
    docs.forEach(function(d,i){var b=el('button',null,d.titre);b.type='button';b.setAttribute('aria-pressed',i===0);b.onclick=function(){ouvrir(i);};choix.appendChild(b);});
    var prec=el('button',null,'&#8249;'),suiv=el('button',null,'&#8250;'),num=el('span','vz-num','…'),
        moins=el('button','vz-zoom','&minus;'),plus=el('button','vz-zoom','+'),plein=el('button',null,'&#x26F6;');
    prec.setAttribute('aria-label','Page précédente');suiv.setAttribute('aria-label','Page suivante');
    moins.setAttribute('aria-label','Réduire');plus.setAttribute('aria-label','Agrandir');plein.setAttribute('aria-label','Plein écran');
    [prec,num,suiv,moins,plus,plein].forEach(function(x){if(x.tagName==='BUTTON')x.type='button';cmd.appendChild(x);});
    barre.appendChild(choix);barre.appendChild(cmd);
    var scene=el('div','vz-scene'),toile=el('canvas'),attente=el('div','vz-attente','Ouverture de la visionneuse…');
    var lis=el('div','vz-lis'),lisTexte=el('div','vz-lis-texte');lis.appendChild(lisTexte);
    scene.appendChild(toile);scene.appendChild(lis);scene.appendChild(attente);
    var mode=el('button','vz-mode');mode.type='button';
    var pied=el('div','vz-pied','<b>Visionneuse Clémi Raconte</b><span>'+(box.getAttribute('data-pied')||'Lecture en ligne, page par page.')+'</span>');
    pied.insertBefore(mode,pied.children[1]);
    box.innerHTML='';box.appendChild(barre);box.appendChild(scene);box.appendChild(pied);
    var pdf=null,page=1,zoom=1,courant=-1,tache=null;
    /* ----- liseuse ----- */
    var liseuse=false,lp=1,lpTotal=1,taille=1,repere=0;
    function texteDe(i){var d=docs[i],s=d&&d.texte&&document.getElementById(d.texte);if(!s)return null;try{return JSON.parse(s.textContent);}catch(e){return null;}}
    function remplir(i){
      var t=texteDe(i);if(!t)return false;
      var h='<div class="vz-lis-titre"><p class="vz-lis-marque">Clémi Raconte</p><h3>'+(t.titre||'')+'</h3>'+(t.age?'<p class="vz-lis-age">'+t.age+'</p>':'')+'</div>';
      t.paragraphes.forEach(function(p){h+=p==='•••'?'<p class="vz-lis-orn" aria-hidden="true">• • •</p>':'<p>'+p.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</p>';});
      h+='<div class="vz-lis-bout">';(t.morale||[]).forEach(function(p,k){h+='<p class="vz-lis-morale'+(k===0?' prem':'')+'">'+p+'</p>';});
      h+='<p class="vz-lis-fin">Fin</p></div>';
      lisTexte.innerHTML=h;return true;
    }
    function rendreLis(){
      var plein=box.classList.contains('vz-plein')||document.fullscreenElement;
      var hauteur=plein?scene.clientHeight:Math.round(Math.min(window.innerHeight*.72,640));
      if(!plein){scene.style.height=hauteur+'px';}
      var cs=getComputedStyle(scene),pad=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight),padv=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);
      var w=Math.floor(Math.min(scene.clientWidth-pad,680)),hh=Math.floor((plein?scene.clientHeight:hauteur)-padv);
      if(w<=0||hh<=0)return;
      var gap=48;
      lis.style.width=w+'px';lis.style.height=hh+'px';
      lisTexte.style.fontSize=(telephone()?19:20)*taille+'px';
      lisTexte.style.columnWidth=w+'px';lisTexte.style.columnGap=gap+'px';lisTexte.style.height=hh+'px';
      lisTexte.style.transform='none';
      lpTotal=Math.max(1,Math.round((lisTexte.scrollWidth+gap)/(w+gap)));
      lp=Math.min(lpTotal,Math.max(1,Math.round(repere*(lpTotal-1))+1));
      lisTexte.style.transform='translateX('+(-(lp-1)*(w+gap))+'px)';
      num.textContent=lp+' / '+lpTotal;prec.disabled=lp<=1;suiv.disabled=lp>=lpTotal;
      attente.style.display='none';
    }
    function allerLis(n){lp=Math.min(lpTotal,Math.max(1,n));repere=lpTotal>1?(lp-1)/(lpTotal-1):0;rendreLis();}
    function etiquetteMode(){mode.hidden=!texteDe(courant);mode.textContent=liseuse?'Voir la page imprimable':'Lire en grand';}
    function basculer(on){
      liseuse=on;box.classList.toggle('vz-en-liseuse',on);etiquetteMode();
      moins.setAttribute('aria-label',on?'Texte plus petit':'Réduire');plus.setAttribute('aria-label',on?'Texte plus grand':'Agrandir');
      if(on){repere=0;rendreLis();}else{scene.style.height='';if(pdf){rendre();}else{charger(courant);}}
    }
    mode.onclick=function(){basculer(!liseuse);};
    /* ----- PDF ----- */
    function rendre(){
      if(liseuse){rendreLis();return;}
      if(!pdf)return;
      pdf.getPage(page).then(function(p){
        var larg=scene.clientWidth-(telephone()?20:36);if(larg<=0)return;
        var v0=p.getViewport({scale:1}),echelle=Math.max(.3,larg/v0.width)*zoom;
        if(!telephone()&&!box.classList.contains('vz-plein')&&!document.fullscreenElement){echelle=Math.min(echelle,1.35*zoom);}
        var v=p.getViewport({scale:echelle}),r=window.devicePixelRatio||1;
        toile.width=Math.floor(v.width*r);toile.height=Math.floor(v.height*r);
        toile.style.width=Math.floor(v.width)+'px';toile.style.height=Math.floor(v.height)+'px';
        if(tache){tache.cancel();}
        tache=p.render({canvasContext:toile.getContext('2d'),viewport:v,transform:r!==1?[r,0,0,r,0,0]:null});
        tache.promise.then(function(){attente.style.display='none';},function(){});
        if(!box.classList.contains('vz-plein')&&!document.fullscreenElement){scene.style.height=Math.min(v.height+(telephone()?20:36),window.innerHeight*.8)+'px';}else{scene.style.height='';}
        num.textContent=page+' / '+pdf.numPages;prec.disabled=page<=1;suiv.disabled=page>=pdf.numPages;scene.scrollTop=0;
      });
    }
    function charger(i){
      pdf=null;attente.style.display='flex';attente.textContent='Ouverture de la visionneuse…';
      pdfjsLib.getDocument({url:docs[i].src}).promise.then(function(d){if(i!==courant)return;pdf=d;rendre();},function(){attente.textContent='Le document n\'a pas pu s\'ouvrir. Réessayez dans un instant.';});
    }
    function ouvrir(i){
      if(i===courant)return;courant=i;page=1;
      choix.querySelectorAll('button').forEach(function(b,j){b.setAttribute('aria-pressed',j===i);});
      var aTexte=remplir(i);
      if(aTexte&&telephone()){pdf=null;basculer(true);}
      else{liseuse=false;box.classList.remove('vz-en-liseuse');etiquetteMode();charger(i);}
    }
    prec.onclick=function(){if(liseuse){allerLis(lp-1);return;}if(page>1){page--;rendre();}};
    suiv.onclick=function(){if(liseuse){allerLis(lp+1);return;}if(pdf&&page<pdf.numPages){page++;rendre();}};
    moins.onclick=function(){if(liseuse){taille=Math.max(.8,taille-.1);rendreLis();return;}zoom=Math.max(.6,zoom-.2);rendre();};
    plus.onclick=function(){if(liseuse){taille=Math.min(1.6,taille+.1);rendreLis();return;}zoom=Math.min(2.4,zoom+.2);rendre();};
    plein.onclick=function(){
      if(document.fullscreenElement){document.exitFullscreen();return;}
      if(box.classList.contains('vz-plein')){box.classList.remove('vz-plein');document.body.style.overflow='';rendre();return;}
      if(box.requestFullscreen){box.requestFullscreen().then(function(){setTimeout(rendre,120);},function(){box.classList.add('vz-plein');document.body.style.overflow='hidden';rendre();});}
      else{box.classList.add('vz-plein');document.body.style.overflow='hidden';rendre();}
    };
    document.addEventListener('fullscreenchange',function(){scene.style.height='';setTimeout(rendre,120);});
    box.tabIndex=0;
    box.addEventListener('keydown',function(e){if(e.key==='ArrowRight')suiv.onclick();if(e.key==='ArrowLeft')prec.onclick();if(e.key==='Escape'&&box.classList.contains('vz-plein'))plein.onclick();});
    scene.addEventListener('contextmenu',function(e){e.preventDefault();});
    /* la page se floute dès que la fenêtre n'est plus au premier plan (capture, autre application) */
    function flou(on){scene.classList.toggle('vz-flou',on);}
    window.addEventListener('blur',function(){flou(true);});window.addEventListener('focus',function(){flou(false);});
    document.addEventListener('visibilitychange',function(){flou(document.hidden);});
    scene.addEventListener('dragstart',function(e){e.preventDefault();});
    /* glisser pour tourner la page ; en liseuse, toucher le bord gauche ou droit marche aussi */
    var x0=null,y0=0;scene.addEventListener('touchstart',function(e){x0=e.touches.length===1?e.touches[0].clientX:null;y0=x0===null?0:e.touches[0].clientY;},{passive:true});
    scene.addEventListener('touchend',function(e){if(x0===null||(!liseuse&&zoom!==1))return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){dx<0?suiv.onclick():prec.onclick();}x0=null;});
    lis.addEventListener('click',function(e){var r=lis.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;if(x>.7)suiv.onclick();else if(x<.3)prec.onclick();});
    var t=null;function plusTard(){clearTimeout(t);t=setTimeout(rendre,150);}
    window.addEventListener('resize',plusTard);
    /* l'adaptation cachée (7-9) se dessine quand on l'affiche */
    if('ResizeObserver' in window){var lw=0;new ResizeObserver(function(){var w=box.clientWidth;if(w&&w!==lw){lw=w;plusTard();}}).observe(box);}
    box.vzOuvrir=ouvrir;
    /* on ne charge le PDF que lorsque la visionneuse arrive à l'écran */
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();ouvrir(0);}},{rootMargin:'200px'});io.observe(box);}else{ouvrir(0);}
  }
  window.vzMonter=monter;
  document.querySelectorAll('.vz[data-docs]').forEach(monter);
})();
