---
title: "Nuclear Thermal Propulsion Transient Reactor Modeling and Uncertainty Propagation"
slug: "nuclear-thermal-propulsion-transient-reactor-modeling-and-uncertainty-propagation"
program: "Propulsion & Technology"
category: "Presentation"
tags: ["Nuclear Physics", "Spacecraft Propulsion and Power", "Uncertainty Propogation", "Uncertainty Analysis", "NTP Dynamics and Control", "Reactor Dynamics", "Reactor Control", "Transient Modeling", "Space Nuclear Propulsion", "Reactor Kinetics", "Nuclear Thermal Propulsion"]
year: 2025
excerpt: "The successful design and operation of a nuclear thermal propulsion (NTP) system requires a means of predicting reactor performance through demanding full-system transients. A transient modeling metho"
authors: ["Eleni Mowery", "Jacob Stonehill", "Corey Smith", "Matthew Duchek"]
center: "Marshall Space Flight Center"
ntrs_id: 20250004399
---

The successful design and operation of a nuclear thermal propulsion (NTP) system requires a means of predicting reactor performance through demanding full-system transients. A transient modeling methodology based on the point reactor kinetics (PRK) approximation provides a simple means of evaluating reactor response to reactivity insertions, but its accuracy depends heavily on the quality of kinetic parameters and reactivity coefficients initially supplied as inputs. An open-source Monte Carlo neutron transport code (OpenMC) can determine these inputs on a reactor-dependent basis, but with measurable uncertainty inherent to its stochastic process. When propagated through the over the course of a simulated transient, this uncertainty can result in unacceptably large error bounds on anticipated system performance.

This report details a flexible, two-stage methodology for both utilizing OpenMC to generate reactor-dependent input data for a simple PRK-based transient model and the utilization of this model to measure the impact of the uncertainty associated with the input data on transient reactor performance. The Testing Reference Design is then used to demonstrate the relative impact of different sources of uncertainty on the system performance and establish minimum OpenMC particle counts needed to generate useable input data. Ultimately, this development of this methodology aims to serve as a foundation for informing the reactor-specific input data accuracy needed to produce useful transient results with the higher fidelity models.
