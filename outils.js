/* --- Copier textarea ---*/
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

/* --- Glisser-déposer ---*/
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

/* --- Bouton importer fichier vers textarea ---*/
function importTextareaFile(buttonId, fileInputId, textareaId) {
    var btn = document.getElementById(buttonId);
    var file = document.getElementById(fileInputId);
    var area = document.getElementById(textareaId);
    // Si un des éléments n'existe pas → on ignore proprement
    if (!btn || !file || !area) return;
    // Bouton → ouvre le sélecteur de fichier
    btn.onclick = function () {
        file.click();
    };
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
importTextareaFile("importTextareaFileinput", "textareaFileinput", "input");
importTextareaFile("importTextareaFileoutput", "textareaFileoutput", "output");
importTextareaFile("importTextareaFileimportBox", "textareaFileimportBox", "importBox");
importTextareaFile("importTextareaFileview", "textareaFileview", "view");
importTextareaFile("importTextareaFiletext", "textareaFiletext", "text");
importTextareaFile("importTextareaFiletextA", "textareaFiletextA", "textA");
importTextareaFile("importTextareaFiletextB", "textareaFiletextB", "textB");
