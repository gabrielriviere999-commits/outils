window.popupPhotos360HTML =
    '<b class="titleb">Photos 360</b><hr class="titlehr">' +
    '<input type="text" id="filterPhotos360" style="width:100%;box-sizing:border-box;" placeholder="Filtrer..." onkeyup="var f=sansAccents(this.value.toLowerCase());var a=document.getElementById(\'photos360List\').getElementsByTagName(\'a\');for(var i=0;i<a.length;i++)a[i].parentNode.style.display=sansAccents(a[i].textContent.toLowerCase()).indexOf(f)>=0?\'\':\'none\';">' +
    '<div id="photos360List">' +
    '<ul>' +
    '<li><a href="?file=../photos360/grand_brule_20210430_120657_0.jpg">grand_brule_20210430_120657_0.jpg</a></li>' +
    '<li><a href="?file=../photos360/st_philippe_port_20221028_181030_0.jpg">st_philippe_port_20221028_181030_0.jpg</a></li>' +
    '<li><a href="?file=../photos360/stjoseph_ancienne_usine_20260926_135034.jpg">stjoseph_ancienne_usine_20260926_135034.jpg</a></li>' +
    '</ul>' +
    '</div>' +
    '<hr><button onclick="closePopup()">Fermer</button>';

function sansAccents(str){return str
        .replace(/[àáâãäå]/g, "a")
        .replace(/[ç]/g, "c")
        .replace(/[èéêë]/g, "e")
        .replace(/[ìíîï]/g, "i")
        .replace(/[ñ]/g, "n")
        .replace(/[òóôõö]/g, "o")
        .replace(/[ùúûü]/g, "u")
        .replace(/[ýÿ]/g, "y");
}