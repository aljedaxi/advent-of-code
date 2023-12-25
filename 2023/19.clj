(defmacro shmap [& ss] `(zipmap [~@(map keyword ss)] [~@ss]))


(defn flowify [s]
  (if (not (str/includes? s ":")) [nil nil nil s]
    (let [[_ key-name evaler val workflow-out] (re-find #"(\w+)(\W+)(\d+):(\w+)" s)]
      [(keyword key-name) (case evaler ">" > "<" <) (read-string val) workflow-out])))


(defn parse-workflow [s]
  (let [[_ name stuff] (re-find #"(\w+)\{(.*)\}" s)
        flow           (map flowify (str/split stuff #","))]
    (shmap name flow)))


(defn parse-part [s]
  (let [[_ real-shit] (re-find #"\{(.*)\}" s)
        splitted      (str/split real-shit #",")]
    (reduce
      (fn [acc x]
        (let [[k v] (str/split x #"=")]
          (assoc acc (keyword k) (read-string v))))
      {}
      splitted)))


(clojure.test/is (= (flowify "x>10:one") [:x > 10 "one"]))
(clojure.test/is (= (flowify "m<20:two") [:m < 20 "two"]))
(clojure.test/is (= (flowify "a>30:R"  ) [:a > 30 "R"]  ))
(clojure.test/is (= (flowify "A"       ) [nil nil nil "A"]))


(clojure.test/is (= (parse-part "{x=787,m=2655,a=1222,s=2876}")
                    {:x 787 :m 2655 :a 1222 :s 2876}))


(defn flow [workflow part]
  (let [test (first workflow)]
    (if (= nil (first test)) (last test)
      (let [[key-name evaler val workflow-out] test
            val-at-key (get part key-name)]
        (if (evaler val-at-key val) workflow-out
          (recur (rest workflow) part))))))


(defn run-through-workflows 
  ([workflows part] (run-through-workflows workflows part (get workflows "in")))
  ([workflows part workflow]
   (let [next-workflow-name (flow workflow part)]
     (if (case next-workflow-name "A" true "R" true false) next-workflow-name
       (recur workflows part (get workflows next-workflow-name))))))


(defn main [lines]
  (let [[definition-strings thing-strings] (split-with #(not= "" %) lines)
        workflows (->> definition-strings
                       (map parse-workflow)
                       (reduce (fn [acc {:keys [flow name]}] (assoc acc name flow)) {}))
        parts (map parse-part (drop 1 thing-strings))]
    (->> parts
         (map #(vector % (run-through-workflows workflows %)))
         (filter (fn [[value output]] (= output "A")))
         (map (fn [[value]] (apply + (vals value))))
         (apply +))))

     
(pprint (main *input*))
