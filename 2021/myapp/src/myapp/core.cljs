(ns myapp.core
  (:require 
    [cljs.nodejs :as nodejs]
    myapp.day1
    myapp.day2
    myapp.day7
    myapp.day8
    myapp.fakeLimeJuicer))

(nodejs/enable-util-print!)

(defn -main
  [& args]
  (println myapp.day8/result))

(set! *main-cli-fn* -main)
