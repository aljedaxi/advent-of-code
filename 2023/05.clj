(defn readNums [s]
  (as-> s $
      (str/split $ #"\s+")
      (filter #(not= "" %) $)
      (map read-string $)))

(defn rangeIfy [[destStart sourceStart length]]
  (zipmap
    (range sourceStart (+ length sourceStart))
    (range destStart (+ length destStart))))

(defn parseSeeds [s]
  (let [[_seeds nums] (str/split s #": ")]
    (set (readNums nums))))

(defn restructure [[dest source length]]
  {:dest   [dest length]
   :source [source length]})

(defn map-merge-thing [acc v]
  (let [accDest   (or (:dest acc) [])
        accSource (or (:dest acc) [])
        {dest :dest source :source} v]
    {:dest   (conj accDest dest)
     :source (conj accSource source)}))

(defn parse-maps [lines]
  (->> lines
    (partition-by #(= "" %))
    (filter #(not= "" (first %)))
    (reduce
      (fn [acc [mapName & nums]]
        (assoc
          acc
          (str/replace mapName #" map:" "")
          (map readNums nums)))
      {})))

(defn parse [lines]
  (let [seeds (parseSeeds (first lines))
        maps (parse-maps (rest lines))]
    {:seeds seeds :maps maps}))

(defn in-range [item [bot range-length]]
  (and (>= item bot) (<= item (+ bot range-length))))

(defn getter-supreme [ranges item]
  (when-let [[dest-start source-start length]
             (first (filter (fn [[dest-start source-start length]]
                              (in-range item [source-start length]))
                            ranges))]
    (+ dest-start (- item source-start))))

(defn getFromMap [theMap item]
  (let [found (getter-supreme theMap item)]
    (or found item)))

(defn getFromMaps [maps firstItem]
  (reduce
    (fn [item theMap]
      (getFromMap theMap item))
      firstItem
      maps))

(defn minItem [xs]
  (reduce
    (fn [a v] (if (< a v) a v))
    9999999999999
    xs))

(defn main [lines]
  (let [{seeds :seeds maps :maps} (parse lines)
        seed2soil            (get maps "seed-to-soil")
        soil2fertilizer      (get maps "soil-to-fertilizer")
        fertilizer2water     (get maps "fertilizer-to-water")
        water2light          (get maps "water-to-light")
        light2temperature    (get maps "light-to-temperature")
        temperature2humidity (get maps "temperature-to-humidity")
        humidity2location    (get maps "humidity-to-location")
        mapsInOrder          [seed2soil soil2fertilizer fertilizer2water water2light light2temperature temperature2humidity humidity2location]
        get-loc-number       #(getFromMaps mapsInOrder %)]
    (minItem (map get-loc-number seeds))))
    ;{:keys [seeds seed2soil soil2fert fert2water water2light light2temp temp2hum hum2loc]}

(pprint (main *input*))
