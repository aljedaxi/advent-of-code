(require '[clojure.walk :as walk])

(defn readNums [s]
  (as-> s $
      (str/split $ #"\s+")
      (filter #(not= "" %) $)
      (map read-string $)
      (set $)))

(defn score [n]
  (if (= n 0) 0
    (reduce (fn [acc _] (* 2 acc)) 1 (drop 1 (range n)))))

(defn parse [line]
  (if-some [match
            (re-matches #"Card\s+(\d+): ((\d|\s)+) \| ((\d|\s)+)" line)]
    (let [[whole-match cardN winningString _ heldString _1] match]
      [cardN (readNums winningString) (readNums heldString)])
    []))

(defn trace [s]
  (prn s)
  s)

(defn genCardMap [lines]
  (reduce
    (fn [acc line]
      (let [[cardN winningNumbers heldNumbers] (parse line)
            matches (set/intersection winningNumbers heldNumbers)]
        (if (seq matches)
          (assoc acc cardN matches)
          acc)))
    {}
    lines))

; TODO you should use a treewalker lol https://www.abhinavomprakash.com/posts/clojure-walk/
(defn main2 [lines]
  (let [cardMap (genCardMap lines)
        originalCardCount (count lines)]
    originalCardCount))


(defn main [lines]
  (for [line lines
        :let [[cardN winningNumbers heldNumbers] (parse line)
              matches (set/intersection winningNumbers heldNumbers)
              nMatching (count matches)]]
    (score nMatching)))
    
;(prn (reduce + 0 (main *input*)))
(prn (main2 *input*))
