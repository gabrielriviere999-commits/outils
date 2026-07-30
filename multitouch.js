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

                // Cas spécial : summary → toggle manuel
                if(this.tagName.toLowerCase() === "summary"){
                    var d = this.parentNode;
                    d.open = !d.open;
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
                // tactile → ignorer le click natif
                return false;
            }

            // souris → comportement normal
            if(this._action){
                this._action();
            }
        };
    }
}
