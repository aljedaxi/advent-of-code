(ns myapp.day7
  "bitch i'm sipping tea in your hood")

(def testData
  [16 1 2 0 4 2 7 1 2 14])

(defn group
  [acc v]
  (assoc acc v (+ (if (acc v) (acc v) 0) 1)))

(defn minMax
  [{:keys [minv maxv]} v] 
  {:minv (min minv v) :maxv (max maxv v)})

(defn processTestData
  [xs]
  (reduce
    (fn 
      [acc v]
      {:grouped (group (acc :grouped) v) :extremes (minMax (acc :extremes) v)})
    {:grouped {} :extremes {:minv 9001 :maxv -9001}}
    xs))

(defn absDiff 
  [x y]
  (let [v (- x y)]
    (if (< 0 v)
      v
      (* -1 v))))

(def sum #(reduce + %))

(defn fuelCost
  [diffAlgo positions testPosition]
  (sum (map (fn [[p n]] (* n (diffAlgo testPosition p))) positions)))

(defn findOptimalPoint
  "find point that uses least amount of fuel"
  [{positions :grouped {:keys [minv maxv]} :extremes}]
  (apply min (map #(fuelCost absDiff positions %) (range minv maxv))))

(defn algo1
  [xs]
  (->> xs
       (processTestData)
       (findOptimalPoint)))

(defn absDiff2
  [x y]
  (let [diff (absDiff x y)]
    (reduce #(+ %1 %2) 0 (range (+ diff 1)))))

(defn findOptimalPoint2
  "YOU MISUNDERSTOOD CRAB ENGINEERING, BAAAAKA"
  [{positions :grouped {:keys [minv maxv]} :extremes}]
  (apply min (map #(fuelCost absDiff2 positions %) (range minv maxv))))

(def algo2 #(->> % processTestData findOptimalPoint2))

(def result (algo2 input))
