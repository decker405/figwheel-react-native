(ns ^:figwheel-always rn-test.core
  (:require
    [reagent.core :as r :refer [atom]]))

(set! js/React (js/require "react-native/Libraries/react-native/react-native.js"))

(def Text (r/adapt-react-class (.-Text js/React)))
(def View (r/adapt-react-class (.-View js/React)))

(enable-console-print!)

(defonce app-state (r/atom "Change my state."))

(defn root []
	[View 
		{:style {:flex 1 
						 :background-color "#3498db" 
						 :align-items :center 
						 :justify-content :center}}
		[Text "Hello figwheel"]
		[Text "Edit me."]
		[Text @app-state]])

(r/render [root] 1)

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
)

