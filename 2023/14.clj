(defn find-galaxies
  ([s] (find-galaxies s 0 '()))
  ([x idx locs]
   (let [s (seq x)]
     (if (not s) locs
       (let [new-locs
             (if
               (#{\# \O} (first s))
               (cons [idx (first s)] locs)
               locs)]
         (recur (rest s) (+ 1 idx) new-locs))))))

(defn get-rock-val [row col-i]
  (some-> row (get col-i) first (get :rock)))

(defn stringify [rocks]
  (let [in-order (group-by :row rocks)]
    (map
      (fn [row-i]
        (let [row (get in-order row-i)
              by-col (group-by :col row)]
          (str/join ""
                    (map
                      (fn [col-i] (or (get-rock-val by-col col-i) \.))
                      (range 10)))))
    (range 10))))

(defn galaxy-locs [lines]
  (->> lines
       (map-indexed
         (fn [row l]
           (map-indexed
             (fn [col c]
               (if (#{\# \O} c) {:col col :row row :rock c} nil))
             (seq l))))
                      ; (map (fn [[col rock]] {:col col :row row :rock rock})
                      ;      (find-galaxies l))))
       flatten
       (filter #(not= nil %))
       (group-by :rock)))

(defn rock-in-next-row [{:keys [col row]} rocks]
  (> 0 (count (filter
                #(and (= col (get :col %)) (= (+ 1 row) (get :row %)))
                rocks))))

(defn blocker [{rock-row :row} in-col]
  (reduce
    (fn [acc maybe-blocker]
      (let [row (get maybe-blocker :row)]
        (if (> row rock-row) acc ;not in path of rock
          (if (not acc) maybe-blocker ;any rock in path
            (if (> row (get acc :row)) maybe-blocker ;in path of rock
              acc)))))
  nil
  in-col))

(clojure.test/is
  (= (blocker
       {:col 0, :row 0, :rock \O}
       [{:col 0, :row 8, :rock \#} {:col 0, :row 9, :rock \#}])
     nil))
(clojure.test/is
  (= (blocker
       {:col 0, :row 1, :rock \O}
       [{:col 0, :row 0, :rock \O} {:col 0, :row 8, :rock \#} {:col 0, :row 9, :rock \#}])
     {:col 0, :row 0, :rock \O}))
(clojure.test/is
  (= (blocker
       {:col 5, :row 5, :rock \O}
       [{:col 5, :row 0, :rock \#} {:col 5, :row 2, :rock \#} {:col 5, :row 6, :rock \#} {:col 5, :row 8, :rock \#} {:col 5, :row 9, :rock \#}])
     {:col 5, :row 2, :rock \#}))
(clojure.test/is
  (= (blocker
       {:col 2, :row 6, :rock \O}
       [{:col 2, :row 5, :rock \#} {:col 2 :row 0}])
     {:col 2, :row 5, :rock \#}))

(defn roll-rock [rock in-col]
  (let [blocking-rock (blocker rock in-col)]
    (if blocking-rock
      (assoc rock :row (+ 1 (get blocking-rock :row)))
      (assoc rock :row 0))))

(defn roll-rocks 
  ([rolly-rocks stationary-rocks] 
   (let [in-order (sort-by :row rolly-rocks)
         stationed-in-col (group-by :col stationary-rocks)]
     (roll-rocks in-order stationed-in-col '())))
  ([rolly-rocks stationary-rocks rolled-rocks]
   (let [rock (first rolly-rocks)]
     (if (not rock) rolled-rocks
       (let [stationed-in-cols (merge-with into stationary-rocks (group-by :col rolled-rocks))
             rocks-in-col (get stationed-in-cols (get rock :col))
             rolled-rock (roll-rock rock rocks-in-col)]
         (recur (rest rolly-rocks) stationary-rocks (cons rolled-rock rolled-rocks)))))))

(defn calc-score [rocks n-rows]
  (let [by-row (group-by :row rocks)]
    (->> by-row
         (map (fn [[row-n v]] (* (count v) (- n-rows row-n))))
         (reduce + 0))))

(defn main [lines]
  (let [all-rocks (galaxy-locs lines)
        rolly-rocks (get all-rocks \O)
        stationary-rocks (get all-rocks \#)
        rolled-state (roll-rocks rolly-rocks stationary-rocks)]
    (calc-score rolled-state (count lines))))

; (pprint (main *input*))
(pprint (main *input*))
