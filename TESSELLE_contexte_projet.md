# TESSELLE — Document de contexte et de passation

**Objet :** historique complet de la recherche de concept, enseignements, spécification du prototype TESSELLE 2.1 et documentation du moteur, pour poursuite du développement en IDE.
**Date :** juillet 2026 · **Statut :** prototype validé, prêt pour perfectionnement et production.

---

## 1. Le projet en une page

Recherche d'un jeu de puzzle mobile/web grand public : compris en quelques secondes, jouable d'un doigt en portrait, sessions de 20 s à 3 min, jouable en regardant une série, déterministe (zéro hasard), graphiquement minimaliste, réalisable en solo assisté par IA, monétisable proprement (pubs récompensées, no-ads, cosmétiques — jamais de progression bloquée ni de fausses statistiques), et suffisamment fertile pour des centaines de niveaux.

**Référence d'expérience :** Amaze GO! — non pour sa mécanique (taper des flèches dont la trajectoire est libre pour vider le plateau), mais pour sa boucle : compréhension immédiate → action → gratification → niveau suivant sans friction. Interdits : clone/reskin d'Amaze GO!, mécaniques de retrait/libération/tri/démêlage, originalité purement thématique, décors et personnages, méta-jeu lourd.

**Résultat de la recherche :** TESSELLE — remplir des formes en traçant des pièces d'un seul trait — décliné en deux moteurs (remplissage libre pour le flow, solution unique pour la logique pure), avec une couche « game feel » complète (score, combos, fièvre, étoiles).

---

## 2. Le parcours : 7 prototypes, 7 verdicts

Chaque concept a été prototypé en HTML/canvas autonome et testé par le porteur du projet. Les verdicts successifs ont servi de triangulation.

| # | Concept | Verbe central | Verdict du test | Enseignement |
|---|---|---|---|---|
| 1 | **STRATES** | Dater — reconstituer l'ordre chronologique d'une pile de pièces (ce qui est dessus est arrivé après) | « Sensation étrange, trop enfantin, pas la dopamine d'Amaze GO ; le niveau dur frustre » | La déduction contemplative ne suffit pas ; la difficulté par lisibilité fatigue l'œil, pas l'esprit |
| 2 | **ANCRE** | Ancrer — épingler K pièces avant des rafales de vent déterministes pour former un motif | « Difficile à comprendre au premier abord ; pas envie d'enchaîner » | Le verdict différé (tout se joue au bouton « lancer ») casse la boucle ; il faut une récompense par action |
| 3 | **SONAR** | Sonder — localiser une cible cachée avec un budget de mesures de distance | « Trop de hasard ressenti, trop proche du démineur » | L'information cachée = sensation de hasard, même si la déduction est réelle. Interdit structurel |
| 4 | **TÉMOIN** | Prouver — innocenter des suspects par faits et témoignages en cascade (témoignage fiable seulement une fois son auteur blanchi) | « Trop de règles, impossible de jouer sans comprendre ; impression de chance » | Critère décisif révélé : **on doit pouvoir jouer avant de comprendre**. Tout coût cognitif d'entrée est fatal |
| 5 | **TESSELLE v1** | Paver — remplir une forme avec des dominos, solution unique, cascade de coups forcés | « Du potentiel, le plus sympa, mais perfectible » | Premier concept validé. Le geste + la fréquence d'action fonctionnent |
| 6 | **LUCIOLE** | Décharger — libérer des nœuds pleins dans le bon ordre sur un graphe (codé par le porteur) | « Compliqué à comprendre pour pas grand-chose ; manque d'addictif ; mais du potentiel » | + découverte au banc d'essai : la règle « comptes exacts » est quasi confluente (un joueur aléatoire ne peut presque pas échouer) → aucune vraie décision. Concept mécaniquement creux tel que spécifié |
| 7 | **TESSELLE 2.0 → 2.1** | Tracer — pièces-serpents de 2-4 cases, tailles mélangées, score/combo/fièvre | En cours de test — direction confirmée | Voir §4 |

**Concepts écartés sans prototype** (test anti-copie ou défauts structurels) : APLOMB (mobiles à équilibrer — trope éducatif, « devoir de maths »), ÉCLIPSE (masquage — résoluble par balayage), CADASTRE (partition de grille — trop proche de Shikaku/Fillomino), ATELIER (assemblage ordonné — miroir du retrait, « Amaze GO inversé »), DÉBORD (inondation par seuils — brute-forcible), plus les 5 pistes du brief initial (PRIORITY, CONSENSUS, PHASE, COMPRESS, EXCEPTION — toutes trop cérébrales ou trop proches de jeux existants).

---

## 3. L'enseignement central du projet

**Amaze GO! n'est pas un jeu de déduction — c'est un jeu de flow avec une planification optionnelle.** Le brief initial sur-pondérait « déclic intellectuel / Sherlock / Turing Machine » ; les verdicts réels ont systématiquement éliminé les concepts cérébraux et gardé celui à la plus haute fréquence d'actions récompensées. La cible réelle :

1. **Affordance zéro-règle** : la règle est lisible dans la forme même de l'objet (une flèche demande d'être tapée ; une case qui brille demande d'être tracée). Aucun tutoriel textuel.
2. **10-30 micro-actions par niveau**, chacune avec feedback kinesthésique immédiat (son, mouvement, secousse).
3. **Du mouvement et des départs** : des choses qui claquent, s'illuminent, s'envolent. La victoire est cinétique, pas un écran de texte.
4. **Le plateau est sa propre barre de progression.**
5. **La réflexion monte en grade doucement** et n'est jamais un péage d'entrée.
6. **Fail-soft** : l'échec enseigne (feedback localisé) et ne coince jamais (retrait de pièce possible).

Principe de boucle retenu (« cascade ») : à chaque instant il existe une action évidente ou trouvable ; la faire transforme visiblement l'état ; la transformation fait naître l'action suivante.

---

## 4. TESSELLE 2.1 — Spécification du prototype actuel

**Fichier :** `tesselle21_demo.html` (autonome, vanilla JS + canvas, aucune dépendance, sons WebAudio générés).

### Règle joueur (une phrase)
Tracez des pièces d'un seul trait (2 à 4 cases) pour remplir toute la forme.

### Trois modes
- **Aventure** — 12 niveaux crescendo : tailles {2} → {2,3} → {2,3,4}, formes de 10 à ~50 cases. Remplissage **libre** : tout pavage est valide.
- **Infini** — manches générées à la volée, taille croissante (plafond 52 cases), graine variable. Preuve de contenu illimité.
- **Expert** — 5 niveaux à **solution unique** (moteur à cascade forcée, taille de pièce fixe par niveau). Assistance = fantôme en pointillés de la pièce forcée (immédiat sur la 1ʳᵉ pièce, puis après 3,5 s d'inactivité).

### Fautes (modes libres) — coûtent 1 cœur sur 3
- **Case orpheline** : la pièce isole une case (incouvrable). Détection instantanée.
- **Zone coincée** : la pièce rend une petite zone résiduelle (≤ 16 cases) impossible à paver. Détection exacte, ~0,2 ms.
- Message d'erreur flottant sur le plateau (« case orpheline » / « zone coincée ») : l'échec enseigne.
- **Soupape** : toucher une pièce posée la retire (casse la série, −5 pts/case). Jamais de blocage définitif.

### Faute (mode Expert)
- Pièce hors de l'unique solution → cœur perdu, même si elle « semblait » possible.

### Couche adrénaline
- **Score** : cases × 10 × multiplicateur.
- **Multiplicateur ×2 → ×8** : chaque pose dans les 3,2 s de la précédente incrémente la chaîne.
- **Barre de combo** visible qui se vide en 3,2 s — c'est l'organe de tension.
- **Mode fièvre** à ×4+ : bordure incandescente, notes à l'octave supérieure.
- **3 étoiles** par niveau : terminé / propre (0 erreur, 0 retrait) / série ≥ 60 % des pièces.

### Game feel implémenté
Geste serpent avec aperçu semi-transparent et retour arrière (revenir sur ses pas dépile) ; annulation gratuite si le tracé est incomplet ; note montante par case tracée ; claquement + micro-secousse d'écran + onde de choc par pose ; « ×N » flottant ; à la victoire, propagation de lumière de pièce en pièce (BFS d'adjacence depuis la dernière posée, gamme ascendante) puis **envol** de toutes les pièces hors écran en tournoyant (héritage esthétique de LUCIOLE).

### Palette / DA
Fond encre `#14171F`, panneaux `#1C2129`/`#232936`, cases `#2A3140`, pièces cyclant `#E3A94C #5B9BD1 #54BFAE #D46A6A #9B7EDE`, accents or `#E3A94C`/`#F2D16B`, erreur `#D45A5A`. Tout est dessiné par code : zéro asset.

---

## 5. Documentation du moteur

### 5.1 Représentation
- Cellule = clé `"c,r"`. Région = `Set` de clés. Pièce = tableau de clés (ensemble, ordre indifférent : `setKey = cells.sort().join("|")`).
- Une pièce est valide si ses cases forment un **chemin** (traçable d'un trait) — toutes les tailles 2-4 utilisées sont des chemins par construction.

### 5.2 Primitives
- `pathsCovering(c, free, k)` : tous les ensembles de k cases libres formant un chemin et contenant c. Implémentation : DFS de chemins dans la boule de Manhattan de rayon k−1 autour de c, déduplication par `setKey`. (k=2 : simple liste des voisins.)
- `makesOrphan(piece, free)` : vrai si la pose isole une case libre (ne vérifie que les voisines de la pièce — O(taille de pièce)).
- `components(free)` : composantes connexes (BFS).
- `canTileSmall(cells, sizes)` : pavage exact par DFS (case triée la plus petite d'abord, élagage orphelin, garde-fou 6000 nœuds avec bénéfice du doute). Réservé aux composantes ≤ 16 cases.

### 5.3 Moteur Expert (solution unique, cascade forcée)
- **Définition** : une case est *forcée* s'il n'existe qu'un seul chemin de k cases libres la couvrant.
- **Théorème utilisé** (esquisse) : si une case n'a qu'un placement possible, toute solution complète doit l'utiliser ; par induction, une région résoluble par cascade de cases forcées admet un **pavage unique**. La cascade est aussi une garantie « zéro devinette » : à tout instant, au moins une pièce est certaine.
- `solveForcedK(cells, k)` : boucle { trouver une case forcée, poser, recommencer } ; échec si aucune case forcée ou case incouvrable. Retourne les pièces (= la solution) et les *fronts* (nombre de cases forcées disponibles à chaque étape — **métrique de difficulté** : front moyen petit = points d'entrée rares = plus dur à repérer).
- **Génération guidée** : partir d'un chemin aléatoire ; ajouter des chemins adjacents à la région un par un, en ne gardant que les ajouts qui préservent `solveForcedK` ; filtrer par `maxAvgFront`. Graines déterministes (`mulberry32`), boucle de tentatives, repli sans contrainte de front.
- Validé au banc d'essai : 600 parcours simulés (joueurs ne posant que des pièces forcées dans un ordre aléatoire) → 100 % de complétion, jamais de blocage, toutes les pièces dessinables d'un trait.

### 5.4 Moteur libre (tailles mélangées)
- **Découverte clé (empirique)** : le mélange des tailles **détruit la déduction forcée** — au-delà de ~16 cases, plus aucune cascade n'existe (une case peut presque toujours être couverte par un 2 *ou* un 3). D'où la bifurcation : le mode libre ne cherche pas une solution unique, il valide **tout** pavage.
- **Génération** : région = union de chemins aléatoires des tailles permises → **complétable par construction** (les chemins générateurs sont un pavage témoin). Génération instantanée, taille arbitraire → contenu illimité.
- **Validation en jeu** (par pose, ~0,2 ms mesuré) : refus si orphelin, ou si une composante résiduelle ≤ 16 cases est prouvée impavable. Les blocages profonds dans de grandes composantes (rares — ex. la croix de 5 cases est indétectable localement) sont couverts par le **retrait de pièce** : le jeu ne peut jamais coincer.
- **Compétence mesurée** : un joueur aléatoire commet 36-59 % de poses fautives (simulé) → marteler ne gagne pas ; la lecture des poches et des couloirs est le vrai skill.

### 5.5 Découverte LUCIOLE (à connaître si l'idée revient)
Sur un graphe où chaque nœud doit recevoir un nombre *exact* d'impulsions avant d'être libéré, le système est quasi confluent (parenté avec le théorème abélien des tas de sable) : l'ordre des choix n'a presque jamais de conséquence, un joueur aléatoire ne peut pas échouer → pas de gameplay. Une variante « conduction » (la lumière traverse les nœuds verrouillés) crée des pièges mais rend la génération quasi impossible. Concept archivé avec ses bancs d'essai.

---

## 6. Méthodologie de validation (à conserver absolument)

Chaque évolution du moteur a été validée **hors navigateur** avant d'être jouée. Protocole :

1. Extraire la logique pure du fichier HTML (tout ce qui précède la section Audio) et l'exécuter en Node.
2. **Générer tous les niveaux** avec leurs graines exactes ; vérifier tailles, contraintes, temps de génération (budget : < 2 s au total, pré-génération en tâche de fond dans le jeu).
3. **Simuler des joueurs** (50-600 parcours aléatoires par niveau) : en mode forcé, vérifier zéro blocage et cohérence pièce-forcée = pièce-solution ; en mode libre, mesurer le taux de coups bloquants et le pire temps de vérification.
4. Métriques de difficulté objectives : front moyen (Expert), taux de piège (proto LUCIOLE), taille/géométrie (libre).

Règle d'or : **ne jamais affirmer qu'un niveau est résoluble ou qu'une solution est unique — le prouver par le code.** C'est ce qui rendra crédibles les statistiques réelles (taux de réussite, percentiles) prévues au brief.

---

## 7. Feuille de route contenu (200+ niveaux / infini)

Un seul moteur, trois robinets :

1. **Leviers sans règle nouvelle** (épuiser d'abord) : taille des formes, géométrie plus tortueuse (couloirs, boucles), retrait progressif des tailles « faciles », resserrement du front moyen (Expert), retrait de l'assistance.
2. **Modificateurs auto-explicatifs** (un tous les ~30 niveaux, toujours lisibles sans texte) : cases-gemmes à capturer en pleine série (pure couche score), pièces pré-posées qui compliquent la lecture, formes jumelles à remplir en parallèle, cases comptant double en fièvre. Bannir tout modificateur exigeant une explication.
3. **Modes** : Défi du jour mondial (même graine pour tous, mode Expert — comparabilité type Wordle), Infini avec meilleur score, chapitres cosmétiques (palettes à débloquer/acheter).

**Monétisation prévue au brief** : interstitiels modérés aux ruptures naturelles, pub récompensée (= un retrait gratuit, ou conserver le Perfect après une erreur), achat suppression des pubs, packs de palettes. Refusés : énergie, solutions payantes, fausses stats.

---

## 8. Positionnement et risques (honnêteté anti-copie)

- **Voisins réels** : Dominosa (papier — mais on y déduit des frontières depuis des nombres, pas de tracé), la famille « remplir une silhouette avec des blocs donnés » (Ubongo, Block Blast, IQ Puzzler).
- **Piège identifié à ne jamais franchir** : donner un **inventaire de pièces à caser** — cela ferait basculer le jeu dans le genre block-fit ultra-saturé. L'identité de TESSELLE tient au trio : pièces **implicites** dessinées au doigt (geste serpent), validation logique par pose, langage lumineux de récompense. C'est ce trio qui est reconnaissable en 5 s de vidéo.
- **Risque n°1 (identifié dès le rapport initial, toujours ouvert)** : la monotonie — la chasse à la bonne pose peut devenir un scan oculaire. Antidotes en place : combo/fièvre (le rythme devient l'enjeu), tailles mélangées (liberté), Expert (profondeur). À surveiller au test utilisateurs.
- Aucun inédit absolu n'est garanti (l'espace des puzzles est immense et mal indexé) ; l'exigence tenue est qu'aucune description honnête du jeu ne cite un autre jeu.

---

## 9. Prochaines étapes recommandées

1. **Portage IDE** : TypeScript + structure modulaire (moteur / rendu / audio / UI), en conservant le canvas vanilla ou en passant à PixiJS/Phaser ; cible PWA puis Capacitor (Android/iOS) — conforme au choix technique du brief. Le moteur du prototype se transpose tel quel (aucune dépendance).
2. **Réglage fin** (curseurs, pas de refonte) : durée de barre de combo (3,2 s), fenêtre de série, valeurs de score, seuil de fièvre (×4), courbe de retrait de l'assistance, vitesses d'animation.
3. **Test à 10 personnes, zéro explication orale** — critères du brief : compréhension du niveau 1 en < 45 s ; médiane ≥ 12 niveaux joués spontanément ; verbalisation de raisonnements (« sinon j'isole cette case ») ; et le seul juge final : le pouce appuie-t-il sur « suivant » sans délibérer ?
4. Ensuite seulement : progression persistante, défi du jour, statistiques réelles, monétisation.

## 10. Inventaire des fichiers produits

| Fichier | Contenu |
|---|---|
| `strates_demo.html` | Proto 1 — chronologie d'empilement (12 niveaux + affaire limite) |
| `ancre_demo.html` | Proto 2 — ancres et rafales (8 niveaux, solution unique vérifiée par force brute) |
| `sonar_demo.html` | Proto 3 — triangulation à budget de sondes (8 niveaux) |
| `temoin_demo.html` | Proto 4 — déduction par témoignages (10 affaires, clôture logique validée) |
| `tesselle_demo.html` | Proto 5 — dominos, solution unique (10 niveaux) |
| `luciole.html` | Proto 6 — codé par le porteur (graphe à décharger) |
| `tesselle2_demo.html` | Proto 7 — serpents 2/3/4 par chapitres, combos, envol (12 niveaux) |
| `tesselle21_demo.html` | **Version de référence** — 3 modes, tailles mélangées, score/fièvre/étoiles/retrait |

Tous les prototypes embarquent leur générateur avec graines déterministes : un niveau donné est reproductible à l'identique, y compris après un échec.
