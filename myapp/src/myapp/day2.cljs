(ns myapp.day2
  "bitch i'm sipping tea in your hood")

(def succ #(+ 1 %))
(def sum #(reduce + 0 %))

(def testData '(
                ["forward" 5]
                ["down" 5]
                ["forward" 8]
                ["up" 3]
                ["down" 8]
                ["forward" 2]
                ))

(def negative #(* -1 %))

(defn reducer
  "moves by extent"
  [{x :x y :y} [direction extent]]
  (do 
  (case direction
    "forward" {:x (+ extent x) :y y}
    "down"    {:x x :y (+ extent y)}
    "up"      {:x x :y (+ y (negative extent))}
    {:x x :y y})))

(defn algo1
  [ns]
  (reduce reducer {:x 0 :y 0} ns))

(def result1 (algo1 testData))

(def isntNill #(if (= % nil) false true))

(defn moveByAim
  [{x :x y :y aim :aim} [direction extent]]
  (case direction
    "forward" {:x (+ extent x) :y (+ y (* aim extent)) :aim aim}
    "down"    {:x x :y y :aim (+ aim extent)}
    "up"      {:x x :y y :aim (+ aim (negative extent))}
    {:x x :y y :aim aim}))

(defn algo2
  [ns]
  (reduce moveByAim {:x 0 :y 0 :aim 0} ns))

(def result2 (algo2 testData))
