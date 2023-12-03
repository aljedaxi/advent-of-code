(defn greater [n1 n2] (if (> n1 n2) n1 n2))

(defn parseColorN [s]
  (let [[n color] (str/split (str/trim s) #" ")]
    (hash-map (keyword color) (read-string (str/trim n)))))

(def parseGame
  #(as-> % $$
          (str/split $$ #",") 
          (map parseColorN $$)
          (apply merge $$)))

(defn greatestForEachStoneColour [acc stones]
  (reduce
    (fn [acc [k v]]
      (assoc acc k (greater (or (acc k) 0) v)))
    acc
    stones))

(defn trace [& s]
  (prn s)
  s)

(defn getMaxes [s]
  (as-> s $
     (str/split $ #";")
     (map parseGame $)
     (reduce greatestForEachStoneColour {} $)))

(defn parse1 [s]
  (let [[gameStuff sets] (str/split s #":")
        gameId (re-find #"\d+" gameStuff)]
    (assoc
      (getMaxes sets)
      :gameId
      (read-string gameId))))

(defn withinTestParameters [stones]
  (and (<= (:green stones) 13)
       (<= (:red stones) 12)
       (<= (:blue stones) 14)))

(defn main1 [lines]
  (->> lines
       (map parse1)
       (filter withinTestParameters)
       (map #(% :gameId))
       (reduce + 0)))

(defn power [{:keys [red blue green]}]
  (* red blue green))

(defn main2 [lines]
  (->> lines
       (map parse1)
       (map power)
       (reduce + 0)))

(prn (main2 *input*))
