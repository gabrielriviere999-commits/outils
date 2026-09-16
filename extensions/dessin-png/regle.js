/* REGLE VIRTUELLE */
var regle = document.getElementById("regle");
var regleBody = document.getElementById("regleBody");
var regleRotation = document.getElementById("regleRotation");
var regleLengthHandle = document.getElementById("regleLengthHandle");
var regleClose = document.getElementById("regleClose");
var regleCenterButton = document.getElementById("regleCenterButton");
var regleDrawButton = document.getElementById("regleDrawButton");
var regleSquareButton = document.getElementById("regleSquareButton");
var regleCircleButton = document.getElementById("regleCircleButton");
var regleLeftArrowButton = document.getElementById("regleLeftArrowButton");
var regleRightArrowButton = document.getElementById("regleRightArrowButton");
var regleDoubleArrowButton = document.getElementById("regleDoubleArrowButton");
// Si les boutons n'existent pas encore dans le HTML, on les crée automatiquement.
if(!regleCenterButton){
    regleCenterButton = document.createElement("button");
    regleCenterButton.id = "regleCenterButton";
    regleCenterButton.type = "button";
    regleCenterButton.title = "Marquer le centre de la règle";
    regleCenterButton.textContent = "✚";
    regleCenterButton.setAttribute(
        "aria-label",
        "Marquer le centre de la règle"
    );
    regle.appendChild(regleCenterButton);
}
if(!regleDrawButton){
    regleDrawButton = document.createElement("button");
    regleDrawButton.id = "regleDrawButton";
    regleDrawButton.type = "button";
    regleDrawButton.title = "Tracer une ligne avec la règle";
    regleDrawButton.textContent = "✏";
    regleDrawButton.setAttribute("aria-label", "Tracer une ligne avec la règle");
    regle.appendChild(regleDrawButton);
}
if(!regleSquareButton){
    regleSquareButton = document.createElement("button");
    regleSquareButton.id = "regleSquareButton";
    regleSquareButton.type = "button";
    regleSquareButton.title = "Tracer un carré avec la règle";
    regleSquareButton.textContent = "□";
    regleSquareButton.setAttribute(
        "aria-label",
        "Tracer un carré avec la règle"
    );
    regle.appendChild(regleSquareButton);
}
if(!regleCircleButton){
    regleCircleButton = document.createElement("button");
    regleCircleButton.id = "regleCircleButton";
    regleCircleButton.type = "button";
    regleCircleButton.title = "Tracer un cercle avec le diamètre de la règle";
    regleCircleButton.textContent = "○";
    regleCircleButton.setAttribute("aria-label", "Tracer un cercle avec le diamètre de la règle");
    regle.appendChild(regleCircleButton);
}
if(!regleLeftArrowButton){
    regleLeftArrowButton = document.createElement("button");
    regleLeftArrowButton.id = "regleLeftArrowButton";
    regleLeftArrowButton.type = "button";
    regleLeftArrowButton.title = "Tracer une ligne avec une flèche à gauche";
    regleLeftArrowButton.textContent = "←";
    regleLeftArrowButton.setAttribute(
        "aria-label",
        "Tracer une ligne avec une flèche à gauche"
    );
    regle.appendChild(regleLeftArrowButton);
}
if(!regleRightArrowButton){
    regleRightArrowButton = document.createElement("button");
    regleRightArrowButton.id = "regleRightArrowButton";
    regleRightArrowButton.type = "button";
    regleRightArrowButton.title = "Tracer une ligne avec une flèche à droite";
    regleRightArrowButton.textContent = "→";
    regleRightArrowButton.setAttribute(
        "aria-label",
        "Tracer une ligne avec une flèche à droite"
    );
    regle.appendChild(regleRightArrowButton);
}
if(!regleDoubleArrowButton){
    regleDoubleArrowButton = document.createElement("button");
    regleDoubleArrowButton.id = "regleDoubleArrowButton";
    regleDoubleArrowButton.type = "button";
    regleDoubleArrowButton.title = "Tracer une ligne avec des flèches aux deux extrémités";
    regleDoubleArrowButton.textContent = "↔";
    regleDoubleArrowButton.setAttribute(
        "aria-label",
        "Tracer une ligne avec des flèches aux deux extrémités"
    );
    regle.appendChild(regleDoubleArrowButton);
}
var regleInfo = document.getElementById("regleInfo");
var regleAngleInput = document.getElementById("regleAngleInput");
var rulerCheckbox = document.getElementById("rulerCheckbox");
var regleVisible = false;
var regleX = 70;
var regleY = 70;
var regleAngle = 0;
var regleAction = 0;
var reglePointerId = null;
var regleStartPointerX = 0;
var regleStartPointerY = 0;
var regleStartX = 0;
var regleStartY = 0;
var regleCenterX = 0;
var regleCenterY = 0;
var regleStartAngle = 0;
var regleStartPointerAngle = 0;
var regleLength = 500;
var regleStartLength = 500;
function normalizeRulerAngle(a){
    while(a < 0) a += 360;
    while(a >= 360) a -= 360;
    return a;
}
function updateRulerInfo(){
    var angle = normalizeRulerAngle(regleAngle);
    regleInfo.innerHTML = angle.toFixed(1) + "°";
    if(document.activeElement !== regleAngleInput){
        regleAngleInput.value = angle.toFixed(1);
    }
}
function renderRuler(){
    regle.style.width = Math.round(regleLength) + "px";
    regle.style.left = Math.round(regleX) + "px";
    regle.style.top = Math.round(regleY) + "px";
    regle.style.transform = "rotate(" + regleAngle + "deg)";
    updateRulerInfo();
}
function showRuler(){
    regleVisible = true;
    regle.className = "visible";
    rulerCheckbox.checked = true;
    renderRuler();
}
function hideRuler(){
    regleVisible = false;
    regle.className = "";
    rulerCheckbox.checked = false;
    regleAction = 0;
    reglePointerId = null;
}
function toggleRuler(){
    if(regleVisible) hideRuler();
    else showRuler();
}
rulerCheckbox.onchange = function(){
    if(this.checked) showRuler();
    else hideRuler();
};
regleAngleInput.addEventListener("change", function(){
    var a = parseFloat(this.value);
    if(isNaN(a)) a = 0;
    regleAngle = a;
    renderRuler();
});
regleAngleInput.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        e.preventDefault();
        this.blur();
    }
});
function rulerPointerAngle(clientX, clientY){
    return Math.atan2(clientY - regleCenterY, clientX - regleCenterX);
}
function getRulerScreenCenter(){
    var r = regle.getBoundingClientRect();
    var cx = (r.left + r.right) / 2;
    var cy = (r.top + r.bottom) / 2;
    // Le pivot/axe de tracé est 4 px sous le centre géométrique de la règle (30 px au lieu de 26 px).
    var offset = 4;
    var rad = regleAngle * Math.PI / 180;
    return {
        x: cx - Math.sin(rad) * offset,
        y: cy + Math.cos(rad) * offset
    };
}
function rulerStartMove(e){
    if(e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    regleAction = 1;
    reglePointerId = e.pointerId;
    regleStartPointerX = e.clientX;
    regleStartPointerY = e.clientY;
    regleStartX = regleX;
    regleStartY = regleY;
    if(regleBody.setPointerCapture && e.pointerId !== undefined){
        try{
            regleBody.setPointerCapture(e.pointerId);
        }catch(err){}
    }
}
function rulerStartRotation(e){
    if(e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    var c = getRulerScreenCenter();
    regleCenterX = c.x;
    regleCenterY = c.y;
    regleStartAngle = regleAngle * Math.PI / 180;
    regleStartPointerAngle = rulerPointerAngle(e.clientX,e.clientY);
    regleAction = 2;
    reglePointerId = e.pointerId;
    if(regleRotation.setPointerCapture &&
       e.pointerId !== undefined){
        try{
            regleRotation.setPointerCapture(e.pointerId);
        }catch(err){}
    }
}
function rulerStartLength(e){
    if(e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    regleAction = 3;
    reglePointerId = e.pointerId;
    regleStartLength = regleLength;
    // Position initiale de la poignée
    regleStartPointerX = e.clientX;
    regleStartPointerY = e.clientY;
    if(regleLengthHandle.setPointerCapture &&
       e.pointerId !== undefined){
        try{
            regleLengthHandle.setPointerCapture(e.pointerId);
        }catch(err){}
    }
}
function rulerMove(e){
    if(!regleAction) return;
    if(
        reglePointerId !== null &&
        e.pointerId !== undefined &&
        e.pointerId !== reglePointerId
    ) return;
    e.preventDefault();
    e.stopPropagation();
    if(regleAction === 1){
        regleX = regleStartX + (e.clientX - regleStartPointerX);
        regleY = regleStartY + (e.clientY - regleStartPointerY);
    }else if(regleAction === 2){
        var a = rulerPointerAngle(e.clientX, e.clientY);
        regleAngle = (regleStartAngle + (a - regleStartPointerAngle)) * 180 / Math.PI;
    }else if(regleAction === 3){
        var rad = regleAngle * Math.PI / 180;
        var axisX = Math.cos(rad);
        var axisY = Math.sin(rad);
        // Déplacement de la poignée depuis sa position de départ
        var dx = e.clientX - regleStartPointerX;
        var dy = e.clientY - regleStartPointerY;
        // Projection sur l'axe de la règle
        var projection = dx * axisX + dy * axisY;
        // La longueur augmente des deux côtés
        var newLength = regleStartLength + projection * 2;
        newLength = Math.max(80, Math.min(1200, newLength));
        var lengthChange = newLength - regleLength;
        regleLength = newLength;
        regleX -= lengthChange / 2;
    }
    renderRuler();
}
function rulerEnd(e){
    if(!regleAction) return;
    if(
        reglePointerId !== null && e.pointerId !== undefined && e.pointerId !== reglePointerId
    ) return;
    e.preventDefault();
    e.stopPropagation();
    regleAction = 0;
    reglePointerId = null;
    try{
        if(
            regleBody.releasePointerCapture &&
            e.pointerId !== undefined
        ){
            regleBody.releasePointerCapture(e.pointerId);
        }
        if(
            regleRotation.releasePointerCapture &&
            e.pointerId !== undefined
        ){
            regleRotation.releasePointerCapture(e.pointerId);
        }
        if(
            regleLengthHandle.releasePointerCapture &&
            e.pointerId !== undefined
        ){
            regleLengthHandle.releasePointerCapture(e.pointerId);
        }
    }catch(err){}
}
function getRulerLineOnCanvas(){
    var rect = canvas.getBoundingClientRect();
    var center = getRulerScreenCenter();
    // regleLength est la vraie longueur de la règle. Il ne faut surtout pas utiliser getBoundingClientRect().width ici, car cette largeur change lorsque la règle tourne.
    var halfLength = regleLength / 2;
    var rad = regleAngle * Math.PI / 180;
    var sx1 = center.x - Math.cos(rad) * halfLength;
    var sy1 = center.y - Math.sin(rad) * halfLength;
    var sx2 = center.x + Math.cos(rad) * halfLength;
    var sy2 = center.y + Math.sin(rad) * halfLength;
    return {
        x1:(sx1 - rect.left) * canvas.width / rect.width,
        y1:(sy1 - rect.top) * canvas.height / rect.height,
        x2:(sx2 - rect.left) * canvas.width / rect.width,
        y2:(sy2 - rect.top) * canvas.height / rect.height
    };
}
function clipRulerLineToCanvas(line){
    var x1 = line.x1;
    var y1 = line.y1;
    var x2 = line.x2;
    var y2 = line.y2;
    var dx = x2-x1;
    var dy = y2-y1;
    var t0 = 0;
    var t1 = 1;
    var p = [-dx, dx, -dy, dy];
    var q = [x1, canvas.width-x1, y1, canvas.height-y1];
    var i, r;
    for(i=0;i<4;i++){
        if(p[i] === 0){
            if(q[i] < 0)
                return null;
        }else{
            r = q[i]/p[i];
            if(p[i] < 0){
                if(r > t1)
                    return null;
                if(r > t0)
                    t0 = r;
            }else{
                if(r < t0)
                    return null;
                if(r < t1)
                    t1 = r;
            }
        }
    }
    return {
        x1:x1+t0*dx,
        y1:y1+t0*dy,
        x2:x1+t1*dx,
        y2:y1+t1*dy
    };
}
/* MARQUER LE CENTRE */
function drawRulerCenter(){
    if(!regleVisible)
        return;
    var rect = canvas.getBoundingClientRect();
    var center = getRulerScreenCenter();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    var cx = (center.x - rect.left) * scaleX;
    var cy = (center.y - rect.top) * scaleY;
    saveState();
    if(eraserMode)
        ctx.globalCompositeOperation = "destination-out";
    else
        ctx.globalCompositeOperation = "source-over";
    var size = Math.max(4, parseInt(sizeInput.value,10) * 2);
    drawStyledPixelLine(cx - size, cy, cx + size, cy);
    drawStyledPixelLine(cx, cy - size, cx, cy + size);
}
/* LIGNE */
function drawRulerLine(){
    if(!regleVisible)
        return;
    var line = clipRulerLineToCanvas(getRulerLineOnCanvas());
    if(!line)
        return;
    saveState();
    if(eraserMode)
        ctx.globalCompositeOperation = "destination-out";
    else
        ctx.globalCompositeOperation = "source-over";
    drawStyledPixelLine(line.x1, line.y1, line.x2, line.y2);
}
/* CARRE */
function drawRulerSquare(){
    if(!regleVisible)
        return;
    var rect = canvas.getBoundingClientRect();
    var center = getRulerScreenCenter();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    var cx = (center.x - rect.left) * scaleX;
    var cy = (center.y - rect.top) * scaleY;
    // La longueur de la règle est en pixels écran. On la convertit en pixels canvas.
    var sideX = regleLength * scaleX;
    var sideY = regleLength * scaleY;
    // Pour garder un vrai carré, on prend une échelle moyenne.
    var side = (sideX + sideY) / 2;
    var half = side / 2;
    var rad = regleAngle * Math.PI / 180;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    /* Les 4 coins du carré */
    var x1 = cx + (-half * cos + half * sin);
    var y1 = cy + (-half * sin - half * cos);
    var x2 = cx + ( half * cos + half * sin);
    var y2 = cy + ( half * sin - half * cos);
    var x3 = cx + ( half * cos - half * sin);
    var y3 = cy + ( half * sin + half * cos);
    var x4 = cx + (-half * cos - half * sin);
    var y4 = cy + (-half * sin + half * cos);
    saveState();
    if(eraserMode)
        ctx.globalCompositeOperation = "destination-out";
    else
        ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = ctx.strokeStyle;
    drawStyledPixelLine(x1, y1, x2, y2);
    drawStyledPixelLine(x2, y2, x3, y3);
    drawStyledPixelLine(x3, y3, x4, y4);
    drawStyledPixelLine(x4, y4, x1, y1);
}
/* CERCLE */
function getRulerCircleOnCanvas(){
    var rect = canvas.getBoundingClientRect();
    var center = getRulerScreenCenter();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    return {
        x:(center.x - rect.left) * scaleX,
        y:(center.y - rect.top) * scaleY,
        radius: (regleLength / 2) * ((scaleX + scaleY) / 2)
    };
}
function drawRulerCircle(){
    if(!regleVisible)
        return;
    var circle = getRulerCircleOnCanvas();
    saveState();
    if(eraserMode)
        ctx.globalCompositeOperation = "destination-out";
    else
        ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = ctx.strokeStyle;
    drawPixelCircle(circle.x, circle.y, circle.radius);
}
/* FLECHES */
function drawRulerArrowBase(x1,y1,x2,y2,doubleArrow,leftArrow){
    var dx = x2-x1;
    var dy = y2-y1;
    var len = Math.sqrt(dx*dx + dy*dy);
    if(len < 1){
        return;
    }
    var ux = dx/len;
    var uy = dy/len;
    var headLen = Math.max(4, Math.round(parseInt(sizeInput.value,10) * 4));
    var headWidth = headLen*0.5;
    var px = -uy;
    var py = ux;
    function drawHead(px0,py0,dir){
        var bx = px0-ux*headLen*dir;
        var by = py0-uy*headLen*dir;
        var aX = bx+px*headWidth;
        var aY = by+py*headWidth;
        var bX = bx-px*headWidth;
        var bY = by-py*headWidth;
        drawStyledPixelLine(px0,py0,aX,aY);
        drawStyledPixelLine(aX,aY,bX,bY);
        drawStyledPixelLine(bX,bY,px0,py0);
        return {x:bx,y:by};
    }
    var leftBase;
    var rightBase;
    if(leftArrow){
        leftBase = drawHead(x1,y1,-1);
        if(doubleArrow){
            rightBase = drawHead(x2,y2,1);
            drawStyledPixelLine(leftBase.x,leftBase.y, rightBase.x,rightBase.y);
        }else{
            drawStyledPixelLine(leftBase.x,leftBase.y,x2,y2);
        }
    }else{
        rightBase = drawHead(x2,y2,1);
        drawStyledPixelLine(x1,y1,rightBase.x,rightBase.y);
    }
}
function drawRulerArrowLeft(){
    if(!regleVisible)
        return;
    var line = clipRulerLineToCanvas(getRulerLineOnCanvas());
    if(!line)
        return;
    saveState();
    if(eraserMode)
        ctx.globalCompositeOperation = "destination-out";
    else
        ctx.globalCompositeOperation = "source-over";
    drawRulerArrowBase(line.x1,line.y1, line.x2,line.y2, false, true);
}
function drawRulerArrowRight(){
    if(!regleVisible)
        return;
    var line = clipRulerLineToCanvas(getRulerLineOnCanvas());
    if(!line)
        return;
    saveState();
    if(eraserMode)
        ctx.globalCompositeOperation = "destination-out";
    else
        ctx.globalCompositeOperation = "source-over";
    drawRulerArrowBase(line.x1,line.y1, line.x2,line.y2, false, false);
}
function drawRulerDoubleArrow(){
    if(!regleVisible)
        return;
    var line = clipRulerLineToCanvas(getRulerLineOnCanvas());
    if(!line)
        return;
    saveState();
    if(eraserMode)
        ctx.globalCompositeOperation = "destination-out";
    else
        ctx.globalCompositeOperation = "source-over";
    drawRulerArrowBase(line.x1,line.y1, line.x2,line.y2, true, true);
}
/* ÉVÉNEMENTS */
regleBody.addEventListener("pointerdown", rulerStartMove, false);
regleRotation.addEventListener("pointerdown", rulerStartRotation, false);
regleLengthHandle.addEventListener("pointerdown", rulerStartLength, false);
regleBody.addEventListener("pointermove", rulerMove, false);
regleRotation.addEventListener("pointermove", rulerMove, false);
regleLengthHandle.addEventListener("pointermove", rulerMove, false);
regleBody.addEventListener("pointerup", rulerEnd, false);
regleRotation.addEventListener("pointerup", rulerEnd, false);
regleLengthHandle.addEventListener("pointerup", rulerEnd, false);
regleBody.addEventListener( "pointercancel", rulerEnd, false);
regleRotation.addEventListener("pointercancel", rulerEnd, false);
regleLengthHandle.addEventListener("pointercancel", rulerEnd, false);
/* Fonction générique boutons d'action */
function setupRulerActionButton(button, action){
    var pointerActivated = false;
    button.addEventListener("pointerdown", function(e){
        e.preventDefault();
        e.stopPropagation();
        pointerActivated = true;
        action();
        if(button.setPointerCapture && e.pointerId !== undefined){
            try{
                button.setPointerCapture(e.pointerId);
            }catch(err){}
        }
    }, false);
    button.addEventListener("pointerup", function(e){
        e.preventDefault();
        e.stopPropagation();
        if(button.releasePointerCapture && e.pointerId !== undefined){
            try{
                button.releasePointerCapture(e.pointerId);
            }catch(err){}
        }
    }, false);
    button.addEventListener("pointercancel", function(e){
        e.preventDefault();
        e.stopPropagation();
    }, false);
    button.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        if(pointerActivated){
            pointerActivated = false;
            return;
        }
        action();
    }, false);
}
/* BOUTON TRACER */
setupRulerActionButton(regleCenterButton, drawRulerCenter);
setupRulerActionButton(regleDrawButton, drawRulerLine);
setupRulerActionButton(regleSquareButton, drawRulerSquare);
setupRulerActionButton(regleCircleButton, drawRulerCircle);
setupRulerActionButton(regleLeftArrowButton, drawRulerArrowLeft);
setupRulerActionButton(regleRightArrowButton, drawRulerArrowRight);
setupRulerActionButton(regleDoubleArrowButton, drawRulerDoubleArrow);
/* FERMETURE */
function closeRulerButton(e){
    e.preventDefault();
    e.stopPropagation();
    hideRuler();
    return false;
}
regleClose.addEventListener("pointerdown", closeRulerButton, false);
regleClose.addEventListener("click", closeRulerButton, false);
/* COMPATIBILITÉ TACTILE */
if(!window.PointerEvent){
    regleBody.ontouchstart =
        function(e){
            if(!e.touches ||
               !e.touches.length)
                return;
            var t = e.touches[0];
            rulerStartMove({
                pointerType:"touch",
                button:0,
                pointerId:1,
                clientX:t.clientX,
                clientY:t.clientY,
                preventDefault:function(){
                    e.preventDefault();
                },
                stopPropagation:function(){
                    e.stopPropagation();
                }
            });
        };
    regleBody.ontouchmove =
        function(e){
            if(!e.touches ||
               !e.touches.length)
                return;
            var t = e.touches[0];
            rulerMove({
                pointerId:1,
                clientX:t.clientX,
                clientY:t.clientY,
                preventDefault:function(){
                    e.preventDefault();
                },
                stopPropagation:function(){
                    e.stopPropagation();
                }
            });
        };
    regleBody.ontouchend =
        function(e){
            rulerEnd({
                pointerId:1,
                preventDefault:function(){
                    e.preventDefault();
                },
                stopPropagation:function(){
                    e.stopPropagation();
                }
            });
        };
    regleRotation.ontouchstart =
        function(e){
            if(!e.touches ||
               !e.touches.length)
                return;
            var t = e.touches[0];
            rulerStartRotation({
                pointerType:"touch",
                button:0,
                pointerId:1,
                clientX:t.clientX,
                clientY:t.clientY,
                preventDefault:function(){
                    e.preventDefault();
                },
                stopPropagation:function(){
                    e.stopPropagation();
                }
            });
        };
    regleRotation.ontouchmove =
        function(e){
            if(!e.touches ||
               !e.touches.length)
                return;
            var t = e.touches[0];
            rulerMove({
                pointerId:1,
                clientX:t.clientX,
                clientY:t.clientY,
                preventDefault:function(){
                    e.preventDefault();
                },
                stopPropagation:function(){
                    e.stopPropagation();
                }
            });
        };
    regleRotation.ontouchend =
        function(e){
            rulerEnd({
                pointerId:1,
                preventDefault:function(){
                    e.preventDefault();
                },
                stopPropagation:function(){
                    e.stopPropagation();
                }
            });
        };
}
