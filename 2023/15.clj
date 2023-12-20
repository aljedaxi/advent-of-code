(defn asciify [c] (int c))
(defn my-hash-lol [s]
  (->> s
       seq
       (map asciify)
       (reduce
         (fn [current-value ascii-code]
           (-> current-value (+ ascii-code) (* 17) (mod 256)))
         0)))

(clojure.test/is (= (my-hash-lol "HASH") 52))
(clojure.test/is (= (my-hash-lol "rn=1") 30))
(clojure.test/is (= (my-hash-lol "cm-") 253))
(clojure.test/is (= (my-hash-lol "qp=3") 97))
(clojure.test/is (= (my-hash-lol "cm=2") 47))
(clojure.test/is (= (my-hash-lol "qp-") 14))
(clojure.test/is (= (my-hash-lol "pc=4") 180))
(clojure.test/is (= (my-hash-lol "ot=9") 9))
(clojure.test/is (= (my-hash-lol "ab=5") 197))
(clojure.test/is (= (my-hash-lol "pc-") 48))
(clojure.test/is (= (my-hash-lol "pc=6") 214))
(clojure.test/is (= (my-hash-lol "ot=7") 231))

(defn main [lines]
  (let [line (first lines)
        instructions (str/split line #",")]
    (->> instructions
         (map my-hash-lol)
         (reduce + 0))))

(prn (main *input*))
