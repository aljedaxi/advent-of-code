(defn find-galaxies
  ([s] (find-galaxies s 0 '()))
  ([x idx locs]
   (let [s (seq x)]
     (if (not s) locs
       (let [new-locs (if (= \# (first s)) (cons idx locs) locs)]
         (recur (rest s) (+ 1 idx) new-locs))))))

(defn galaxy-locs [lines]
  (->> lines
       (map-indexed (fn [idx l]
                      (map (fn [col] {:col col :row idx})
                           (find-galaxies l))))
       flatten))
   ; (lazy-seq
   ;   (when-let [s (seq lines)]
   ;     (let [galaxies (find-galaxies (first lines))]

(defn empty-before [xs x]
  (count (filter #(> x %) xs)))
(defn sonic-expansion [empty-rows empty-cols galaxies]
  (map (fn [{:keys [row col]}]
         {:row (+ row (empty-before empty-rows row))
          :col (+ col (empty-before empty-cols col))})
       galaxies))

(defn taxicab-distance [x1 x2]
  (+ (abs (- (get x1 :row) (get x2 :row))) (abs (- (get x1 :col) (get x2 :col)))))

(defn stringify [{:keys [row col]}] (format "{\"row\":\"%s\",\"col\":\"%s\"}" row col))
(defn destringify [s] (json/parse-string s true))
(defn double-up [%]
  (for [x % y % :when (not= x y)] [x y]))

(defn pair-galaxies [galaxies]
  (lazy-seq
    (when-let [s (seq galaxies)]
      (let [this-galaxy (first galaxies) others (rest galaxies)]
        (concat
          (map (fn [%] [this-galaxy %]) others) (pair-galaxies others))))))

(defn main [lines]
  (let [galaxies (galaxy-locs lines)
        rows (count lines)
        cols (count (last lines))
        occupied-rows (set (map #(get % :row) galaxies))
        occupied-cols (set (map #(get % :col) galaxies))
        empty-rows (filter #(not (occupied-rows %)) (range rows))
        empty-cols (filter #(not (occupied-cols %)) (range cols))
        expanded-universe (sonic-expansion empty-rows empty-cols galaxies)
        all-galactic-pairs (pair-galaxies expanded-universe)]
    (reduce + 0 
            (map #(apply taxicab-distance %) all-galactic-pairs))))

(pprint (main *input*))
