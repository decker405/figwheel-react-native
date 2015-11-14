(ns ^:figwheel-always rn-test.core
  (:require
   [reagent.core :as r :refer [atom]]))

(set! js/React (js/require "react-native/Libraries/react-native/react-native.js"))

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
    [Text "Edit me and watch me update.\n"]
    [Text @app-state]]
   [View {:style (:footer styles)}
    [Text {:style (:text styles)} "Footer"]]])

;; -------------------- min profile, for offline bundle, release ----------------

;; (.registerRunnable (.-AppRegistry js/React) "issues"
;;                    (fn [params]
;;                      (r/render [root] (.-rootTag params))))

;; -------------------- dev profile ---------------------------------------------

(r/render [root] 1)

(defn ^:export init []
  ((fn render []
     (.requestAnimationFrame js/window render))))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  )
