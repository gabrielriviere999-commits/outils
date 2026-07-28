function popupScrollUp(){
    var t = document.querySelector('.popup-content');
    if(t) t.scrollTop -= 50;
}
function popupScrollDown(){
    var t = document.querySelector('.popup-content');
    if(t) t.scrollTop += 50;
}
var popupOrigin = null;
var popupJustOpened = false;
function openPopup(container) {
    popupOrigin = container;

    popupJustOpened = true;
    setTimeout(function(){ popupJustOpened = false; }, 150);

    var d = document.createElement('div');
    d.className = "popup-overlay";

    d.onmousedown = function(e){
        e = e || window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    };

    d.onclick = function(e){
        e = e || window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();

        if (popupJustOpened) return; 

        if (e.target === d) closePopup();
    };

    var p = document.createElement('div');
    p.className = "popup-window";
    p.setAttribute("tabindex", "-1");

    var t = document.createElement('div');
    t.className = "popup-content";

    while (container.firstChild) {
        t.appendChild(container.firstChild);
    }

    var up = document.createElement('button');
    up.textContent = 'Monter';
    up.className = 'popup-scroll-up';
    up.setAttribute("data-action", "popupScrollUp");
    up.onclick = popupScrollUp;

    var down = document.createElement('button');
    down.textContent = 'Descendre';
    down.className = 'popup-scroll-down';
    down.setAttribute("data-action", "popupScrollDown");
    down.onclick = popupScrollDown;

    var b = document.createElement('button');
    b.textContent = 'Fermer';
    b.className = "popup-close";
    b.setAttribute("data-action", "closePopup");
    b.onclick = closePopup;
    
    var btns = document.createElement('div');
    btns.className = "popup-buttons";

    btns.appendChild(up);
    btns.appendChild(down);
    btns.appendChild(b);

    p.appendChild(t);
    p.appendChild(btns);
    d.appendChild(p);
    document.body.appendChild(d);

    setTimeout(function(){p.focus();},0);
    addMultiTouch(".popup-close, .popup-scroll-up, .popup-scroll-down");
}
function openPopupMini(container) {
    popupOrigin = container;

    popupJustOpened = true;
    setTimeout(function(){ popupJustOpened = false; }, 150);

    var d = document.createElement('div');
    d.className = "popup-overlay";

    d.onclick = function(e){
        if (popupJustOpened) return;
        if (e.target === d) closePopup();
    };

    var p = document.createElement('div');
    p.className = "popup-window-mini";
    p.setAttribute("tabindex", "-1");

    var t = document.createElement('div');
    t.className = "popup-content-mini";

    while (container.firstChild) {
        t.appendChild(container.firstChild);
    }

    p.appendChild(t);
    d.appendChild(p);
    document.body.appendChild(d);

    setTimeout(function(){ p.focus(); }, 0);
}
function openPopupMenu(container) {
    popupOrigin = container;

    popupJustOpened = true;
    setTimeout(function(){ popupJustOpened = false; }, 150);

    var d = document.createElement('div');
    d.className = "popup-overlay";

    d.onclick = function(e){
        if (popupJustOpened) return;
        if (e.target === d) closePopup();
    };

    var p = document.createElement('div');
    p.className = "popup-window-menu";
    p.setAttribute("tabindex", "-1");

    var t = document.createElement('div');
    t.className = "popup-content-menu";

    while (container.firstChild) {
        t.appendChild(container.firstChild);
    }

    p.appendChild(t);
    d.appendChild(p);
    document.body.appendChild(d);

    setTimeout(function(){ p.focus(); }, 0);
}
function closePopup() {
    var d = document.querySelector('.popup-overlay');
    if (!d) return;
    var popupContent = d.querySelector('.popup-content,.popup-content-mini,.popup-content-menu');
    d.style.opacity = "0";
    // Remettre les enfants dans leur conteneur d'origine
    while (popupContent.firstChild) {
        popupOrigin.appendChild(popupContent.firstChild);
    }
    popupOrigin = null;
    setTimeout(function(){
        if (d.parentNode) {
            d.parentNode.removeChild(d);
        }
    }, 100);
}
document.onkeydown = function(e){
    e = e || window.event;
    if (e.key === "Escape" || e.keyCode === 27) {
        var d = document.querySelector('.popup-overlay');
        if (d) closePopup();
    }
};

function openMenuPopup() {
  var container = document.getElementById("popupMenuContent");
  container.innerHTML = window.popupMenuHTML;
  openPopupMenu(container);
}
window.popupMenuHTML =
    '<ul>' +
    '<li><a href="search.html">Rechercher</a></li>' +
    '<li><a href="arbo.html">Arborescence</a></li>' +
    '<li><a href="https://github.com/gabrielriviere999-commits/outils">Dépôt GitHub outils</a></li>' +
    '<li><a href="https://codeload.github.com/gabrielriviere999-commits/outils/zip/refs/heads/main" download>Télécharger dépot outils</a></li>' +
    '</ul>';

function openSearchPopup() {
    var container = document.getElementById("popupSearchContent");

    // Récupérer les éléments AVANT le déplacement
    var input   = container.querySelector('#search');
    var count   = container.querySelector('#count');
    var results = container.querySelector('#results');

    openPopupMenu(container);

    // Restauration
    var lastQuery   = sessionStorage.getItem("lastQuery");
    var lastResults = sessionStorage.getItem("lastResults");
    var lastCount   = sessionStorage.getItem("lastCount");

    if (lastQuery !== null)   input.value = lastQuery;
    if (lastResults !== null) results.innerHTML = lastResults;
    if (lastCount !== null)   count.textContent =
        lastCount > 0 ? lastCount + " résultat(s)" : "Aucun résultat";
}

function doSearch() {
  var q = document.getElementById("search").value.toLowerCase();
  var out = "<ul>";
  var found = 0;
  for (var i=0; i<docs.length; i++) {
    if (docs[i].content.toLowerCase().indexOf(q) !== -1) {
      out += "<li>"
          + "<a href='" + docs[i].url + "' target='_self'>" + docs[i].title + "</a>"
          + " <a href='" + docs[i].url + "' download>[↓]</a>"
          + "</li>";
      found++;
    }
  }
  out += "</ul>";
  // Affichage du compteur
  document.getElementById("count").textContent =
      found > 0 ? found + " résultat(s)" : "Aucun résultat";
  // Affichage des résultats
  document.getElementById("results").innerHTML =
      found > 0 ? out : "";
  // Sauvegarde
  sessionStorage.setItem("lastQuery", q);
  sessionStorage.setItem("lastResults", out);
  sessionStorage.setItem("lastCount", found);
}
