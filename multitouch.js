function addMultiTouch(selector){
    var els = document.querySelectorAll(selector);

    for(var i=0; i<els.length; i++){
        var el = els[i];

        var action = el.getAttribute("data-action");
        if(action){
            el._action = window[action];
        }

        el.onpointerdown = function(e){
            this._touchTriggered = (e.pointerType === "touch");
        };

        el.onpointerup = function(e){
            if(this._touchTriggered){

                var tag = this.tagName.toLowerCase();

                // Cas spécial : summary → toggle manuel
                if(tag === "summary"){
                    var d = this.parentNode;
                    d.open = !d.open;
                    return;
                }

                // Cas spécial : input → focus manuel + action
                if(tag === "input"){
                    this.focus(); // ouvre le clavier et place le curseur
                    if(this._action){
                        this._action();
                    }
                    return;
                }

                // Cas normal → action tactile
                if(this._action){
                    this._action();
                }
            }
        };

        el.onclick = function(e){
            if(this._touchTriggered){

                // Cas spécial : input → NE PAS bloquer le click natif
                if(this.tagName.toLowerCase() === "input"){
                    return; // laisser le focus/clavier
                }

                // tactile → ignorer le click natif pour les boutons
                return false;
            }

            // souris → comportement normal
            if(this._action){
                this._action();
            }
        };
    }
}
