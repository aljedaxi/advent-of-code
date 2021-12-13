(ns myapp.core
  (:require 
    [cljs.nodejs :as nodejs]
    myapp.day1
    myapp.day2))

(nodejs/enable-util-print!)

(defn -main
  [& args]
  (println myapp.day2/result2))

(set! *main-cli-fn* -main)
