(ns ^:figwheel-always rn-test.core
  (:require
   [reagent.core :as r :refer [atom]]))

(set! js/React (js/require "react-native/Libraries/react-native/react-native.js"))
;; React Native should set DEV to false when bundling with --minify
;;   if you're getting App Registration errors in production, just set this to false
(def developMode? js/__DEV__)

(def Text (r/adapt-react-class (.-Text js/React)))
(def View (r/adapt-react-class (.-View js/React)))

(enable-console-print!)

(defonce app-state (r/atom "In the figwheel REPL type:\n (in-ns 'rn-test.core)\n(reset! app-state \"Hello!\")"))

(def styles {:app { :flex 1
                   :align-items :stretch}
             :header { :flex 1
                      :background-color "#34495e"
                      :justify-content :center
                      :align-items :center}
             :body { :flex 9
                    :background-color "#ecf0f1"
                    :align-items :center
                    :justify-content :center
                    :flex-direction :column}
             :footer { :flex 1
                      :background-color "#34495e"
                      :justify-content :center
                      :align-items :center}
             :text { :color "#ecf0f1"
                    :font-size 20
                    :font-weight "600"}})

(defn root []
  [View
   {:style (:app styles)}
   [View {:style (:header styles)}
    [Text {:style (:text styles)} "Header"]]
   [View {:style (:body styles)}
    [Text "Edit me and watch me change.\n"]
    [Text @app-state]]
   [View {:style (:footer styles)}
    [Text {:style (:text styles)} "Footer"]]])

(defn runDevelopment []
  (r/render [root] 1)
  (defn ^:export init []
    ((fn render []
      (.requestAnimationFrame js/window render)))))

(defn runProduction []
  (.registerRunnable (.-AppRegistry js/React) "figTest"
                     (fn [params]
                       (r/render [root] (.-rootTag params)))))
(case developMode?
  true (runDevelopment)
  (runProduction))

(defn on-js-reload [])
