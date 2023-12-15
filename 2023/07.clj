(defn n-dupes [xs]
  (->> xs
       set
       (mapcat (fn [x] [x (count (filter #(= x %) xs))]))
       (apply hash-map)))

(defn full-house [[x1 x2]] (and (= 3 x1) (= 2 x2)))
(defn two-pair [[x1 x2]] (and (= 2 x1) (= 2 x2)))

(defn score [s]
  (let [cs (seq s)
        n-dupes-of-each (n-dupes cs)
        sorted-dupes (reverse (sort (vals n-dupes-of-each)))]
    (cond
      (= 5 (first sorted-dupes)) 6
      (= 4 (first sorted-dupes)) 5
      (full-house sorted-dupes)  4
      (= 3 (first sorted-dupes)) 3
      (two-pair sorted-dupes)    2
      (= 2 (first sorted-dupes)) 1
      :else                      0)))
(def ordered-vals "AKQJT987654321")
(defn card-val [c] (str/index-of ordered-vals c))
(defn is-higher-card? [c1 c2]
  (let [[v1 v2] (map card-val [c1 c2])]
    (> v1 v2)))

(defn card-vals-are-higher? [cs1 cs2]
  (let [c1 (first cs1)
        c2 (first cs2)]
    (if (not= c1 c2) (is-higher-card? c1 c2)
      (card-vals-are-higher? (rest cs1) (rest cs2)))))

(defn score-is-higher? [hands]
  (let [[s1 s2] (map score hands)]
    (if (not= s1 s2) (< s1 s2)
      (apply card-vals-are-higher? (map seq hands)))))

(defn main [lines]
  (->> lines
       (map #(str/split % #"\s"))
       (sort (fn [[h1 _1] [h2 _2]] (score-is-higher? [h1 h2])))
       (map-indexed (fn [idx [_ bid]] (* (read-string bid) (+ 1 idx))))
       (reduce + 0)))

(prn (main *input*))
