(defproject rn-test "0.2.0"
  :description "Proof of concept for using figwheel live reloading with React Native"
  :license {:name "The MIT License (MIT)"
            :url "https://opensource.org/licenses/MIT"}

  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "1.7.122"]
                 [reagent "0.5.1" :exclusions [cljsjs/react]]]

  :plugins [[lein-cljsbuild "1.1.0"]
            [lein-figwheel "0.4.1"]]

  :source-paths ["src"]

  :clean-targets ^{:protect false} ["dev" "min" "index.ios.js"]

  :cljsbuild {:builds [{:id "dev"
                        :source-paths ["src"]
                        ; must set heads up display to false since there is no document variable...
                        :figwheel {:on-jsload "rn-test.core/on-js-reload"
                                   :heads-up-display false
                                   :debug false} ;

                        :compiler {:main rn-test.core
                                   :output-to "dev/do_not_use.js"
                                   :output-dir "dev"
                                   :source-map-timestamp true}}

                       {:id "min"
                        :source-paths ["src"]
                        :compiler {:output-to "index.ios.js"
                                   :output-dir "min"
                                   :optimizations :simple
                                   :pretty-print true}}]})
