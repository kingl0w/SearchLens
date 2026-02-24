---
title: "Kepler Data Validation Time Series File: Description of File Format and Content"
slug: "kepler-data-validation-time-series-file-description-of-file-format-and-content"
program: "Space Telescopes"
category: "Other"
mission: "Kepler"
tags: ["Astrophysics", "DV Time Series", "Kepler"]
year: 2019
excerpt: "The Kepler space mission searches its time series data for periodic, transit-like signatures. The ephemerides of these events, called Threshold Crossing Events (TCEs), are reported in the TCE tables a"
authors: ["Mullally, Susan E."]
center: "Ames Research Center"
ntrs_id: 20170008456
pdf_url: "https://ntrs.nasa.gov/api/citations/20170008456/downloads/20170008456.pdf"
---

The Kepler space mission searches its time series data for periodic, transit-like signatures. The ephemerides of these events, called Threshold Crossing Events (TCEs), are reported in the TCE tables at the NASA Exoplanet Archive (NExScI). Those TCEs are then further evaluated to create planet candidates and populate the Kepler Objects of Interest (KOI) table, also hosted at the Exoplanet Archive. The search, evaluation and export of TCEs is performed by two pipeline modules, TPS (Transit Planet Search) and DV (Data Validation). TPS searches for the strongest, believable signal and then sends that information to DV to fit a transit model, compute various statistics, and remove the transit events so that the light curve can be searched for other TCEs. More on how this search is done and on the creation of the TCE table can be found in Tenenbaum et al. (2012), Seader et al. (2015), Jenkins (2002). For each star with at least one TCE, the pipeline exports a file that contains the light curves used by TPS and DV to find and evaluate the TCE(s). This document describes the content of these DV time series files, and this introduction provides a bit of context for how the data in these files are used by the pipeline.
