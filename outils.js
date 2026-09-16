/* Copier textarea */
function copyTextarea(id, btn) {
    var code = document.getElementById(id);
    var temp = document.createElement("textarea");
    temp.value = code.value;
    document.body.appendChild(temp);
    temp.select();
    try { document.execCommand("copy"); } catch (err) {}
    document.body.removeChild(temp);
    btn.focus();
}
var mapTextarea = {
    copyinput: 'input',
    copyoutput: 'output',
    copyCustomPlus: 'importCustomPlusText',
    copyFancyCustomPlus: 'importFancyCustomPlusText',
    copyjson: 'json',
    copyview: 'view',
    copyasciiTextArea: 'asciiTextArea',
    copyhtmlCode: 'htmlCode'
};
Object.keys(mapTextarea).forEach(function(btnId) {
    var el = document.getElementById(btnId);
    if (!el) return; // ignore proprement si absent
    el.onclick = function(e) {
        copyTextarea(mapTextarea[btnId], e.target);
    };
});
/* Glisser-déposer textarea */
function setupDragDrop(textareaId) {
    var area = document.getElementById(textareaId);
    if (!area) return; // ignore proprement si absent
    area.addEventListener("dragover", function(e) {
        if (e.dataTransfer.types &&
            (e.dataTransfer.types.indexOf("Files") !== -1 ||
             e.dataTransfer.types.indexOf("application/x-moz-file") !== -1)) {
            e.preventDefault();
        }
    });
    area.addEventListener("drop", function(e) {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            e.preventDefault();
            var f = e.dataTransfer.files[0];
            var reader = new FileReader();
            reader.onload = function(ev) {
                area.value = ev.target.result;
            };
            reader.readAsText(f);
            return;
        }
    });
}
setupDragDrop("input");
setupDragDrop("output");
setupDragDrop("text");
setupDragDrop("textA");
setupDragDrop("textB");
setupDragDrop("view");
setupDragDrop("textInput");
setupDragDrop("importBox");
/* Sélecteur de fichiers importer textarea */
function importTextareaFile(fileInputId, textareaId) {
    var file = document.getElementById(fileInputId);
    var area = document.getElementById(textareaId);
    // Si un des éléments n'existe pas → on ignore proprement
    if (!file || !area) return;
    // Input fichier → lit le fichier et le met dans le textarea
    file.addEventListener("change", function () {
        var f = this.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function (e) {
            area.value = e.target.result;
        };
        reader.readAsText(f);
    });
}
importTextareaFile("textareaFileinput", "input");
importTextareaFile("textareaFileoutput", "output");
importTextareaFile("textareaFileimportBox", "importBox");
importTextareaFile("textareaFileview", "view");
importTextareaFile("textareaFiletext", "text");
importTextareaFile("textareaFiletextA", "textA");
importTextareaFile("textareaFiletextB", "textB");
/* Ctrl + V image / Base64 depuis le presse-papiers */
var pasteZones = [
    { pastezone: "pastefileinput", fileinput: "fileinput" },
    { pastezone: "pastedrawingFile", fileinput: "drawingFile" },
    { pastezone: "pasteimageFile", fileinput: "imageFile" },
    { pastezone: "pasteimgLoader", fileinput: "imgLoader" }
];
pasteZones.forEach(function (item) {
    var pastezone = document.getElementById(item.pastezone);
    var fileinput = document.getElementById(item.fileinput);
    if (!pastezone || !fileinput) return;
    pastezone.onpaste = function (e) {
        var clipboard = e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData);
        var items = clipboard.items || [];
        var file = null;
        for (var i = 0; i < items.length; i++) {
            if (items[i].kind === "file" && items[i].type.indexOf("image/") === 0) {
                file = items[i].getAsFile();
                break;
            }
        }
        if (!file) return;
        var dt = new DataTransfer();
        dt.items.add(file);
        fileinput.files = dt.files;
        fileinput.dispatchEvent(new Event("change", { bubbles: true }));
        if (typeof loadFile === "function") {
            loadFile(file);
        }
    };
    pastezone.onblur = function () {
        var text = pastezone.value;
        pastezone.value = "";
        if (!text) return;
        text = text.replace(/^\s+|\s+$/g, "");
        try {
            var mimeType = null;
            var base64 = text;
            // Avec préfixe data:image/...;base64,
            var match = text.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s);
            if (match) {
                mimeType = match[1];
                base64 = match[2];
            }
            // Supprime d'éventuels espaces ou retours à la ligne
            base64 = base64.replace(/\s/g, "");
            var byteCharacters = atob(base64);
            // Si aucun MIME n'a été fourni, on détecte le format grâce à la signature du fichier.
            if (!mimeType) {
                var b0 = byteCharacters.charCodeAt(0);
                var b1 = byteCharacters.charCodeAt(1);
                var b2 = byteCharacters.charCodeAt(2);
                var b3 = byteCharacters.charCodeAt(3);
                // PNG
                if (b0 === 0x89 && b1 === 0x50 && b2 === 0x4E && b3 === 0x47) {
                    mimeType = "image/png";
                }
                // JPEG
                else if (b0 === 0xFF && b1 === 0xD8 && b2 === 0xFF) {
                    mimeType = "image/jpeg";
                }
                // GIF
                else if (
                    byteCharacters.substr(0, 6) === "GIF87a" ||
                    byteCharacters.substr(0, 6) === "GIF89a"
                ) {
                    mimeType = "image/gif";
                }
                // WebP : RIFF....WEBP
                else if (
                    byteCharacters.substr(0, 4) === "RIFF" &&
                    byteCharacters.substr(8, 4) === "WEBP"
                ) {
                    mimeType = "image/webp";
                }
                // BMP
                else if (b0 === 0x42 && b1 === 0x4D) {
                    mimeType = "image/bmp";
                }
                // SVG éventuellement encodé en Base64
                else {
                    var start = byteCharacters.substr(0, 200).replace(/^\s+/, "");
                    if (
                        start.indexOf("<svg") === 0 ||
                        start.indexOf("<?xml") === 0
                    ) {
                        mimeType = "image/svg+xml";
                    }
                }
            }
            if (!mimeType) {
                console.error("Format d'image Base64 inconnu");
                return;
            }
            var byteArrays = [];
            for (var offset = 0; offset < byteCharacters.length; offset += 1024) {
                var slice = byteCharacters.slice(offset, offset + 1024);
                var byteNumbers = new Array(slice.length);
                for (var j = 0; j < slice.length; j++) {
                    byteNumbers[j] = slice.charCodeAt(j);
                }
                byteArrays.push(new Uint8Array(byteNumbers));
            }
            var blob = new Blob(byteArrays, { type: mimeType });
            var extension;
            if (mimeType === "image/jpeg") {
                extension = "jpg";
            } else if (mimeType === "image/svg+xml") {
                extension = "svg";
            } else {
                extension = mimeType.split("/")[1].split("+")[0];
            }
            var file = new File([blob], "clipboard-image." + extension, { type: mimeType });
            var dt = new DataTransfer();
            dt.items.add(file);
            fileinput.files = dt.files;
            fileinput.dispatchEvent(new Event("change", { bubbles: true }));
            if (typeof loadFile === "function") {
                loadFile(file);
            }
        } catch (err) {
            console.error("Erreur conversion Base64 :", err);
        }
    };
});
/* Date et heure téléchargement */
function getTimestampName(prefix, ext){
    var d = new Date();
    var YYYY = d.getFullYear();
    var MM = String(d.getMonth()+1).padStart(2, "0");
    var DD = String(d.getDate()).padStart(2, "0");
    var hh = String(d.getHours()).padStart(2, "0");
    var mm = String(d.getMinutes()).padStart(2, "0");
    var ss = String(d.getSeconds()).padStart(2, "0");
    return prefix + "_" + YYYY + MM + DD + "_" + hh + mm + ss + "." + ext;
}
/* Boutons - et + sliders */
var sliders = {
    zoomRange: ["applyZoomRange", 1],
    imgScale: ["zoomImage", 5],
    zoomInput: ["applyZoom", 20],
    sizeInput: ["sizeInput", 1],
    dottedGapInput: ["dottedGapValue", 1],
    polygonSidesInput: ["polygonSidesInput", 1],
    starBranchesInput: ["starBranchesInput", 1]
};
var sliderLabels = {
    sizeInput: "sizeLabel",
    dottedGapInput: "dottedGapLabel",
    polygonSidesInput: "polygonSidesLabel",
    starBranchesInput: "starBranchesLabel"
};
function changeSlider(id, amount) {
    var slider = document.getElementById(id);
    if (!slider) return;
    var value = parseInt(slider.value, 10);
    var min = parseInt(slider.min, 10);
    var max = parseInt(slider.max, 10);
    value += amount;
    if (value < min) value = min;
    if (value > max) value = max;
    slider.value = value;
    if (sliderLabels[id]) {
        document.getElementById(sliderLabels[id]).textContent = value;
    }
    if (sliders[id] && typeof window[sliders[id][0]] === "function") {
        window[sliders[id][0]](value);
    }
}
// Activation souris / tactile
var sliderEvent = ("PointerEvent" in window) ? "pointerup" : "click";
document.addEventListener(sliderEvent, function(e) {
    var action = e.target.getAttribute("data-action");
    if (!action) return;
    handleSliderAction(action);
});
// Activation clavier (Entrée / Espace)
document.addEventListener("keydown", function(e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var el = document.activeElement;
    if (!el) return;
    var action = el.getAttribute("data-action");
    if (!action) return;
    handleSliderAction(action);
});
// Fonction commune
function handleSliderAction(action) {
    var parts = action.match(/^(.*)(Minus|Plus)$/);
    if (!parts) return;
    var id = parts[1];
    if (!sliders[id]) return;
    var amount = parts[2] === "Minus"
        ? -sliders[id][1]
        : sliders[id][1];
    changeSlider(id, amount);
}
/* BOUTONS DE SCROLL */
var scrollButtons = document.querySelectorAll(".scroll-btn");
for (var i = 0; i < scrollButtons.length; i++) {
    (function (btn) {
        var dir = btn.getAttribute("data-dir");
        var targetId = btn.getAttribute("data-target");
        var target = document.getElementById(targetId);
        if (!target) {
            return;
        }
        var scrolling = false;
        function scroll() {
            var speed = 15;
            if (dir === "up") {
                target.scrollTop -= speed;
            }
            else if (dir === "down") {
                target.scrollTop += speed;
            }
            else if (dir === "left") {
                target.scrollLeft -= speed;
            }
            else if (dir === "right") {
                target.scrollLeft += speed;
            }
        }
        function startScroll(e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            scrolling = true;
        }
        function stopScroll(e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            scrolling = false;
        }
        // SOURIS
        btn.addEventListener("mousedown", startScroll, false);
        btn.addEventListener("mouseup", stopScroll, false);
        btn.addEventListener("mouseleave", stopScroll, false);
        // TACTILE
        btn.addEventListener("touchstart", startScroll, false);
        btn.addEventListener("touchend", stopScroll, false);
        btn.addEventListener("touchcancel", stopScroll, false);
        // CLAVIER
        btn.addEventListener("keydown", function (e) {
            var key = e.key || e.keyCode;
            if (key === " " || key === "Enter") {
                e.preventDefault();
                scrolling = true;
            }
        }, false);
        btn.addEventListener("keyup", function (e) {
            var key = e.key || e.keyCode;
            if (key === " " || key === "Enter") {
                e.preventDefault();
                scrolling = false;
            }
        }, false);
        // CLIC / BOUTON A 3DS
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            scroll();
        }, false);
        // SCROLL CONTINU
        setInterval(function () {
            if (scrolling) {
                scroll();
            }
        }, 50);
    })(scrollButtons[i]);
}
