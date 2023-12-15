(defn read-nums [s]
  (as-> s $
      (str/split $ #"\s+")
      (filter #(not= "" %) $)
      (map read-string $)))

(defn remove-key [s] (str/replace s #"\w+:\s+" ""))

(defn parse-line [s] (-> s remove-key read-nums))

(defn gen-race-times [[time distance]]
  (let [possible-times-lol (drop 1 (range time))
        calcd-times        (map
                             (fn [startup-time]
                               (let [moving-time (- time startup-time)]
                                 (* startup-time moving-time)))
                             possible-times-lol)]
    (filter
      (fn [time-moved] (> time-moved distance))
      calcd-times)))

(defn zip-2-pairs [xs1 xs2]
  (lazy-seq
    (when-let [s (seq xs1)]
      (cons [(first xs1) (first xs2)] (zip-2-pairs (rest xs1) (rest xs2))))))

(defn main [[time distance]]
  (let [races (zip-2-pairs (parse-line time) (parse-line distance))
        n-ways-to-win (map #(-> % gen-race-times count) races)]
    (prn races)
    (reduce * 1 n-ways-to-win)))

(prn (main *input*))
