---
title: "Assessment of Reduced Order Thermal Modeling Assumptions for Nuclear Thermal Propulsion"
slug: "assessment-of-reduced-order-thermal-modeling-assumptions-for-nuclear-thermal-propulsion"
program: "Propulsion & Technology"
category: "Presentation"
tags: ["Nuclear Physics", "Fluid Mechanics and Thermodynamics", "Spacecraft Propulsion and Power", "Reactor Physics", "Nuclear Thermal Propulsion", "Matlab", "MOOSE", "Thermal Hydraulics", "Reduced Order Modeling"]
year: 2025
excerpt: "The technical complexities and associated cost with physical testing of nuclear thermal propulsion systems increases the need for accurate and computationally efficient modeling and simulation approac"
authors: ["Corey Smith", "Jacob Stonehill", "Daria Nikitaeva", "Matthew Duchek"]
center: "Marshall Space Flight Center"
ntrs_id: 20250004397
---

The technical complexities and associated cost with physical testing of nuclear thermal propulsion systems increases the need for accurate and computationally efficient modeling and simulation approaches. NASA and 
industry utilize both high-fidelity finite element analysis codes like MOOSE and ANSYS as well as reduced order physics-based solvers to assess the parametric trade space and in-depth multiphysics. Reduced order solvers, while computationally efficient, require numerous underlying assumptions, especially for the thermal hydraulic solution. This study includes a set of thermal hydraulic simulations to show the impact of various modeling assumptions and approaches on key outputs. The methodology is focused on the differences between a suite of reduced order thermal hydraulics models built in Matlab compared to a MOOSE-based finite element transient analysis. Results include the calculated error of the solid material temperatures and exit flow conditions between the reference solution from the Small Nuclear Rocket Engine and the MOOSE / Matlab models. Additional discussion will focus on the time-dependent thermal hydraulics using the quasi-static solution from Matlab and the true transient approach in MOOSE. Quasi-static solutions are also taken at each discrete MOOSE time step by allowing for the solution to reach steady state. A linear power ramp from zero-power critical to nominal steady state power is investigated for 30 and 60 second ramp times and serves as the primary case to compare the different modeling approaches.
