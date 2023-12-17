(require '[clojure.pprint :refer (cl-format)])

(def test-shit '(
                 "???.### 1,1,3"
                 ".??..??...?##. 1,1,3"
                 "?#?#?#?#?#?#?#? 1,3,1,6"
                 "????.#...#... 4,1,1"
                 "????.######..#####. 1,6,5"
                 "?###???????? 3,2,1"))

(defn exp [x n] (reduce * (repeat n x)))
(defn binary [n padding]
  (cl-format nil (format "~%d,'0',B" padding) n))
(defn possibles [positions]
  (map #(binary % positions) (range (exp 2 positions))))

(defn actualize [sitch possibilities]
  (reduce
    (fn [s yes-or-no] (str/replace-first s #"\?" (if (= \1 yes-or-no) "#" ".")))
    sitch
    possibilities))

(defn parser [line]
  (let [[sitch stuff] (str/split line #"\s")
        runs          (str/split stuff #",")]
    [sitch (map read-string runs)]))

(defn parse-sitch [s] 
  (as-> s %
    (str/split % #"\.+")
    (filter #(not= "" %) %)
    (map count %)))

(defn same-seq [s1 s2]
  (if (not (seq s1)) (= (count s1) (count s2))
    (if (not= (first s1) (first s2)) false
      (recur (rest s1) (rest s2)))))

(defn is-legit [sitch broken-runs]
  (same-seq broken-runs (parse-sitch sitch)))

(defn all-possible-arangments [sitch broken-runs]
  (let [n-question-marks (count (filter #(= \? %) (seq sitch)))
        possibilities (possibles n-question-marks)]
    (->> possibilities
         (map #(actualize sitch %))
         (filter #(is-legit % broken-runs))
         count)))

(defn main [lines]
  (->> lines
    (map parser)
    (map #(apply all-possible-arangments %))
    (reduce + 0)))

(pprint (main *input*))
