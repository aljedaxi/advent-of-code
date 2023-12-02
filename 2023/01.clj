(require '[clojure.string :as str])

(defn firstAndLast [nums] [(first nums) (last nums)])

(defn parseFirstAndLast [nums]
  (read-string (str/join [(first nums) (last nums)])))

(defn getNumbersLol [s] (re-seq #"\d" s))

(def numsMap
  {"one" "1"
   "two" "2"
   "three" "3"
   "four" "4"
   "five" "5"
   "six" "6"
   "seven" "7"
   "eight" "8"
   "nine" "9"})

(defn numify [s] (or (numsMap s) s))

(defn parseFirstAndLast2 [[f l]]
  (read-string (str/join [(numify f) (numify l)])))

(def forwards
  #(->> %
        (re-seq #"\d|one|two|three|four|five|six|seven|eight|nine")
        (filter string?)
        first))
(def backwards
  #(->> %
        str/reverse
        (re-seq #"\d|enin|thgie|neves|xis|evif|ruof|eerht|owt|eno")
        (filter string?)
        first
        str/reverse))

(defn getNumbersPart2 [s]
  [(forwards s) (backwards s)])
(def nums (map (fn [x] (->> x getNumbersPart2 parseFirstAndLast2)) *input*))
(prn (reduce + 0 nums))
