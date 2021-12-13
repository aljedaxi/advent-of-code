(ns myapp.day1
  "bitch i'm sipping tea in your hood")

(def testData '(199 200 208 210 200 207 240 269 260 263))

(defn reducer 
  [{largers :largers x-1 :x-1} x]
  (if (> x-1 x)
    {:largers largers :x-1 x}
    {:largers (+ 1 largers) :x-1 x}))

(defn algo1
  [ns]
  (reduce reducer {:x-1 9001 :largers 0} ns))

(def result1 (algo1 testData))

(defn newWindow
  [[x1 x2 x3] n]
  [x2 x3 n])

(def succ #(+ 1 %))

(def sum #(reduce + 0 %))

(def isntNill #(if (= % nil) false true))

(def myAnd #(and %1 %2))

(defn increased
  [lastWindow newWindow]
  (and
    (seq lastWindow)
    (reduce myAnd true (map isntNill lastWindow))
    (> (sum newWindow) (sum lastWindow))))

(defn reducer2
  [{lastWindow :window largers :largers} n]
  (let [currWindow (newWindow lastWindow n)]
    (if (increased lastWindow currWindow)
      {:window currWindow :largers (succ largers)}
      {:window currWindow :largers largers})))

(defn algo2
  [ns]
  (:largers (reduce reducer2 {:window [] :largers 0} ns)))

(def result2 (algo2 testData))
