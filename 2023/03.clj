(defn anySymbol [s] (not (or (re-matches #"\d" s) (= "." s))))
(defn ast [s] (= "*" s))
(defn stupidSearcher [s matcher]
  (keep-indexed
    (fn [idx c] (let [s (str c)] (if (matcher s) idx nil)))
    (seq s)))

(defn adjacentN [n] [(inc n) n (- n 1)])
(defn getAdjacentCharsThatAreInts [s indecesIn]
  (let [allIndeces (mapcat adjacentN indecesIn)
        validIndeces (for [i allIndeces
                           :let [c (str (get s i))]
                           :when (re-matches #"\d" c)] i)]
    validIndeces))
(def succ #(+ 1 %))
(def pred #(- % 1))
(defn addToLastSet [item listOfSets]
  (let [lastIdx (pred (count listOfSets))
        lastSet (get listOfSets lastIdx)]
    (assoc listOfSets lastIdx (conj lastSet item))))
(defn groupFUCK
  ([numbers] (groupFUCK (rest numbers) (first numbers) [#{(first numbers)}]))
  ([numbers lastNumber acc]
   (if (not (seq numbers)) acc
     (let [thisNumber (first numbers)]
       (if (= lastNumber (- thisNumber 1))
         (groupFUCK (rest numbers) thisNumber (addToLastSet thisNumber acc))
         (groupFUCK (rest numbers) thisNumber (conj acc #{thisNumber})))))))

(defn allNumericRuns [s]
  (let [numberIndeces (for [i (range (count s))
                           :let [c (str (get s i))]
                           :when (re-matches #"\d" c)] i)]
    (if (seq numberIndeces) (groupFUCK numberIndeces) nil)))

(defn getAdjacentN [s indecesIn]
  (let [validIndeces (set (getAdjacentCharsThatAreInts s indecesIn))
        numericRuns (allNumericRuns s)
        validRuns (filter #(seq (clojure.set/intersection % validIndeces)) numericRuns)
        nIndeces (map sort validRuns)
        reconstructed (map
                        (fn [sorted] (read-string (str/join (map #(get s %) sorted))))
                        nIndeces)]
    reconstructed))

(def defined #(not= "" %))
(defn thing [prev curr nextLine]
  (if (not (defined curr)) nil
    (let [indeces (flatten (map #(stupidSearcher % anySymbol) (filter defined [prev curr nextLine])))
          resultLol (getAdjacentN curr indeces)]
      resultLol)))

(defn thing2 [prev curr nextLine]
  (if (not (defined curr)) nil
    (let [definedLines (filter defined [prev curr nextLine])
          indeces (stupidSearcher curr ast)
          resultsLol (flatten (map #(getAdjacentN % indeces) definedLines))]
      (if (= (count resultsLol) 2) (reduce * 1 resultsLol) nil))))

(def twoAgo (atom ""))
(def oneAgo (atom ""))
(defn threeAtATime [lines f]
  (lazy-seq
    (let [s (seq lines)
          line (or (first s) "")
          result (f @twoAgo @oneAgo line)]
      (swap! twoAgo (fn [_] @oneAgo))
      (swap! oneAgo (fn [_] line))
      (if s 
        (cons result (threeAtATime (rest s) f))
        (cons result (cons (f @twoAgo "" "") nil))))))

(def notNil #(not (= nil %)))

(defn main [lines] (filter notNil (threeAtATime lines thing)))

(defn main2 [lines] (filter notNil (threeAtATime lines thing2)))

; (prn (reduce + 0 (flatten (main *input*))))
; TODO doesn't work lol
(prn (reduce + 0 (main2 *input*)))
