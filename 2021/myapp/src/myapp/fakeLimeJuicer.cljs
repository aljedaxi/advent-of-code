(ns myapp.fakeLimeJuicer)
(def citric 9)
(def malic 6)
(def tartaric 0.2)
(def phosphoric 50)
(def water 260)
(def salt 1)

(def theirPhosphoricPercent 0.125)
(def theirActualAcid (* theirPhosphoricPercent phosphoric))
(def myPhosphoricPercent 0.85)
(def myActualAcid (* theirActualAcid myPhosphoricPercent))

(def recipe {:citric 9 :malic 6 :tartaric 0.2 :phosphoric 50 :water 260 :salt 1})

(def totalGrams (+ citric malic tartaric phosphoric water salt))

(def scale #(/ % 3.262))

(def scaledRecipe
  (map (fn [[k v]] [k (scale v)])
       recipe))

(def result myActualAcid)
