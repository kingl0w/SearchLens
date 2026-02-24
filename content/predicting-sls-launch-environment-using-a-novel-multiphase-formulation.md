---
title: "Predicting SLS Launch Environment using a Novel Multiphase Formulation"
slug: "predicting-sls-launch-environment-using-a-novel-multiphase-formulation"
program: "Artemis"
category: "Conference Paper"
tags: ["Aeronautics (General)", "EGS", "LSP", "SLS"]
year: 2023
excerpt: "Powerful acoustic waves generated during ignition of launch vehicles may be dangerous to the vehicle, its payload, or the surrounding structures. The water-based Ignition Overpressure and Sound Suppre"
authors: ["Jordan B. Angel", "Scott Neuhoff", "Man Long Wong", "Michael F. Barad", "Cetin C. Kiris"]
center: "Ames Research Center"
ntrs_id: 20220018985
pdf_url: "https://ntrs.nasa.gov/api/citations/20220018985/downloads/SciTech_SMAT_SLS.pdf"
---

Powerful acoustic waves generated during ignition of launch vehicles may be dangerous to the vehicle, its payload, or the surrounding structures. The water-based Ignition Overpressure and Sound Suppression (IOP/SS) system at Kennedy Space Center’s (KSC) Launch Complex 39B (LC-39B) will be used to protect the Space Launch System (SLS) from the acoustic vibrations generated during launch. The IOP/SS system uses enormous amounts of water to dampen and attenuate these sound waves. To better understand the launch environment risks and to study the effectiveness of the IOP/SS system it is desirable to have time-accurate unsteady simulations of the vehicle ignition with water-based sound suppression. This paper presents results obtained with a novel, high-order accurate, and robust numerical method designed for simulating compressible multiphase flows. A positivity-preserving finite difference scheme is utilized which is formally high-order accurate and also provably robust.  Robustness is critical due to the extreme nature of the flow which exhibits highly nonlinear shock and rarefaction waves interacting with liquid-gas interfaces with density ratios of the order of 1000:1. Furthermore, the high-order accuracy (and the high resolution property) is desirable for predicting wave
phenomena like IOP waves since the signal can be resolved accurately and propagated long distances with fewer grid points. This finite-difference method was developed using NASA’s Launch, Ascent, and Vehicle Aerodynamics (LAVA) Cartesian immersed boundary framework. We present a validation case by applying our solver to the SLS Scale Model Acoustic Test (SMAT). The SLS SMAT is a well-instrumented 5% scale model test meant to represent the SLS at NASA KSC’s LC-39B pad. Scale IOP tests were performed with and without the sound suppression water and included many sensors which recorded the pressure waves produced during ignition. For this validation case we conduct two simulations, likewise with and without sound suppression water, and compare the SLS SMAT pressure sensor signals with our numerical signals at identical locations. Following this validation case we present a study of the SLS launch environment to examine engineering safety concerns about the mobile launch pad. Engineers at KSC redesigned the main flame deflector at LC-39B anticipating
the increased loads from the SLS and to repair damage from prior Shuttle missions. This
deflector redesign made use of surface pressure and temperature data from LAVA full-scale
SLS simulations without the sound suppression system. The engineers were questioning the
possibility of increased pressure loads on the underside of the mobile launcher due to the water
in the flame trench. Based on the results established in our simulations of the SLS SMAT, we
performed updated calculations for SLS at LC-39B with and without water systems active to
assess the readiness of the launch pad for Artemis I launch. Our results show that the IOP/SS
system is effective at reducing the overpressure signal and overall sound pressure levels felt by
the vehicle and additionally that the pressure loads experienced by the mobile launcher (ML)
during engine startup is not increased by the presence of water.
