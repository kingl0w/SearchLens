---
title: "An Algorithm for the Fitting of Planet Models to Kepler Light Curves"
slug: "an-algorithm-for-the-fitting-of-planet-models-to-kepler-light-curves"
program: "Space Telescopes"
category: "Conference Paper"
mission: "Kepler"
tags: ["Lunar And Planetary Science And Exploration", "Exoplanet", "Transit photometry", "Model fit"]
year: 2019
excerpt: "We describe an algorithm which fits model planetary system parameters to light curves from Kepler Mission target stars. The algorithm begins by producing an initial model of the system which is used t"
authors: ["Peter Tenenbaum", "Stephen T Bryson", "Hema Chandrasekaran", "Jie Li", "Elisa Quintana", "Joseph D Twicken", "Jon M Jenkins"]
center: "Ames Research Center"
ntrs_id: 20180007239
pdf_url: "https://ntrs.nasa.gov/api/citations/20180007239/downloads/20180007239.pdf"
---

We describe an algorithm which fits model planetary system parameters to light curves from Kepler Mission target stars. The algorithm begins by producing an initial model of the system which is used to seed the fit,with particular emphasis on obtaining good transit timing parameters. An attempt is then made to determine whether the observed transits are more likely due to a planet or an eclipsing binary. In the event that the transits are consistent with a transiting planet, an iterative fitting process is initiated: a wavelet-based whitening filter is used to eliminate stellar variations on timescales long compared to a transit; a robust nonlinear fitter operating on the whitened light curve produces a new model of the system; and the procedure iterates until convergence upon a self-consistent whitening filter and planet model. The fitted transits are removed from the light curve anda search for additional planet candidates is performed upon the residual light curve. The fitted models are used in additional tests which identify false positive planet detections: multiple planet candidates with near-identical fitted periods are far more likely to be an eclipsing binary, for example, while target stars in which the model lightcurve is correlated with the star centroid position may indicate a background eclipsing binary, and subtraction of all model planet candidates yields a light curve of pure noise and stellar variability, which can be used to study the probability that the planet candidates result from statistical fluctuations in the data.
