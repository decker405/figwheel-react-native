(defproject rn-test "0.1.0-SNAPSHOT"
  :description "FIXME: write this!"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}

  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "1.7.170"]
                 [reagent "0.5.1" :exclusions [cljsjs/react]]]

  :plugins [[lein-cljsbuild "1.1.1"]
            [lein-figwheel "0.5.0-SNAPSHOT"]]

  :source-paths ["src"]

  :clean-targets ^{:protect false} ["build" "target"]

  :cljsbuild {:builds [{:id "dev"
                        :source-paths ["src"]
                                        ; must set heads up display to false since there is no document variable...
                        :figwheel {:on-jsload "rn-test.core/on-js-reload"
                                   :heads-up-display false
                                   :debug false} ;

                        :compiler {:main rn-test.core
                                   :asset-path "build/out"
                                   :output-to "build/rn_test.js"
                                   :output-dir "build/out"
                                   :source-map-timestamp true }}

                       {:id "min"
                        :source-paths ["src"]
                        :compiler {:output-to "target/bundler.js"
                                   :output-dir "target/build"
                                   :optimizations :simple
                                   :pretty-print true}}]})
