---
title: "Planning Satellite Swarm Measurements for Climate Models: Comparing Dynamic Constraint Processing and MILP Methods"
slug: "planning-satellite-swarm-measurements-for-climate-models-comparing-dynamic-constraint-processing-and-milp-methods"
program: "Earth Science"
category: "Conference Paper"
tags: ["Earth Resources And Remote Sensing"]
year: 2022
excerpt: "We present D-SHIELD, a challenging climate science application to plan coordinated measurements (observations) for a constellation of satellites, each containing two different sensors, each with 61 po"
authors: ["Rich Levinson", "Samantha Niemoeller", "Sreeja Nag", "Vinay Ravindra"]
center: "Ames Research Center"
ntrs_id: 20210025802
pdf_url: "https://ntrs.nasa.gov/api/citations/20210025802/downloads/DSHIELD.ICAPS22.12.9.21.7.pdf"
---

We present D-SHIELD, a challenging climate science application to plan coordinated measurements (observations) for a constellation of satellites, each containing two different sensors, each with 61 pointing angle options. The L-band and P-band radar sensors collect data fed into a soil moisture model which tracks and predicts soil moisture across 1.67 million Ground Positions (GP). Soil moisture is an important predictor of wildfires, and then a predictor of floods, landslides and debris flow after a fire. 
	Each measurement covers multiple GP due to the sensor footprint. Each GP has a "model error" which represents the uncertainty of the the soil moisture state prediction. Model error changes at different rates for each GP as the time since last observation increases and after significant events like rain. The planner's goal is to select measurements which maximize soil moisture model improvement (reduce model uncertainty). 
	This problem is combinatorically explosive, involving many degrees of freedom for planner choices. Good domain heuristics can find solutions within a reasonable time for our application needs but cannot be proven optimal. In this paper we compare two different planning approaches to this problem: Dynamic Constraint Processing (DCP) and Mixed Integer Linear Programming (MILP). We match inputs and metrics for both DCP and MILP algorithms to enable a direct apples-to-apples comparison. We demonstrate and discuss the trades between DCP flexibility and performance vs. MILP's promise of provable optimality.
