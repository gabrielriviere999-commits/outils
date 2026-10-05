from pathlib import Path
from urllib.parse import quote

# ============================================================
# CONFIGURATION
# ============================================================

# Chemin du dossier contenant tes photos 360
DOSSIER = Path(r"../../photos360")

# Chemin du fichier JavaScript qui sera généré
FICHIER_SORTIE = Path("photos360.js")


# ============================================================
# GÉNÉRATION
# ============================================================

# Vérification du dossier
if not DOSSIER.exists():
    print(f"ERREUR : le dossier n'existe pas : {DOSSIER}")
    input("Appuie sur Entrée pour fermer...")
    exit()

if not DOSSIER.is_dir():
    print(f"ERREUR : le chemin indiqué n'est pas un dossier : {DOSSIER}")
    input("Appuie sur Entrée pour fermer...")
    exit()


# Récupération des fichiers uniquement
fichiers = sorted(
    [f for f in DOSSIER.iterdir() if f.is_file()],
    key=lambda f: f.name.lower()
)


# Début du JavaScript
lignes = []

lignes.append("window.popupPhotos360HTML =")
lignes.append(
    "    '<b class=\"titleb\">Photos 360</b><hr class=\"titlehr\">' +"
)

lignes.append(
    "    '<input type=\"text\" id=\"filterPhotos360\" "
    "style=\"width:100%;box-sizing:border-box;\" "
    "placeholder=\"Filtrer...\" "
    "onkeyup=\"var f=sansAccents(this.value.toLowerCase());"
    "var a=document.getElementById(\\'photos360List\\').getElementsByTagName(\\'a\\');"
    "for(var i=0;i<a.length;i++)"
    "a[i].parentNode.style.display="
    "sansAccents(a[i].textContent.toLowerCase()).indexOf(f)>=0?\\'\\':\\'none\\';\">' +"
)

lignes.append("    '<div id=\"photos360List\">' +")
lignes.append("    '<ul>' +")


# Ajout des fichiers
for fichier in fichiers:
    nom = fichier.name

    # Encodage pour une URL :
    # espace -> %20
    # accents et caractères spéciaux -> encodés correctement
    nom_url = quote(nom, safe="")

    lignes.append(
        f"    '<li><a href=\"?file=../photos360/{nom_url}\">{nom}</a></li>' +"
    )


# Fin du JavaScript
lignes.append("    '</ul>' +")
lignes.append("    '</div>' +")
lignes.append("    '<hr><button onclick=\"closePopup()\">Fermer</button>';")

lignes.append("")

# Fonction sansAccents
lignes.append("function sansAccents(str){return str")
lignes.append('        .replace(/[àáâãäå]/g, "a")')
lignes.append('        .replace(/[ç]/g, "c")')
lignes.append('        .replace(/[èéêë]/g, "e")')
lignes.append('        .replace(/[ìíîï]/g, "i")')
lignes.append('        .replace(/[ñ]/g, "n")')
lignes.append('        .replace(/[òóôõö]/g, "o")')
lignes.append('        .replace(/[ùúûü]/g, "u")')
lignes.append('        .replace(/[ýÿ]/g, "y");')
lignes.append("}")


# Écriture du fichier
FICHIER_SORTIE.write_text(
    "\n".join(lignes),
    encoding="utf-8"
)


# ============================================================
# INFORMATIONS
# ============================================================

print("=" * 60)
print("GÉNÉRATION TERMINÉE")
print("=" * 60)
print(f"Dossier analysé : {DOSSIER}")
print(f"Nombre de fichiers trouvés : {len(fichiers)}")
print(f"Fichier généré : {FICHIER_SORTIE.resolve()}")
print("=" * 60)

for fichier in fichiers:
    print(f"  - {fichier.name}")

input("\nAppuie sur Entrée pour fermer...")
