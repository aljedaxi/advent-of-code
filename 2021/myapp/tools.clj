(require '[cljs.repl.node :as node])

(defmethod task "node:repl"
  [args]
  (repl/repl (node/repl-env)
             :output-dir "out/nodejs"
             :cache-analysis true))
