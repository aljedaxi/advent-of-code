(ns myapp.core
  (:require 
    [cljs.nodejs :as nodejs]
    myapp.day1))

(nodejs/enable-util-print!)

(defn -main
  [& args]
  (println myapp.day1/result2))

(set! *main-cli-fn* -main)
