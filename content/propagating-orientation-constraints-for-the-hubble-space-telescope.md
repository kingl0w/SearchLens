---
title: "Propagating orientation constraints for the Hubble Space Telescope"
slug: "propagating-orientation-constraints-for-the-hubble-space-telescope"
program: "Space Telescopes"
category: "Conference Paper"
mission: "Hubble"
tags: ["Astronomy"]
year: 2013
excerpt: "An observing program on the Hubble Space Telescope (HST) is described in terms of exposures that are obtained by one or more of the instruments onboard the HST. Many requested exposures might specify"
authors: ["Bose, Ashim", "Gerb, Andy"]
center: "Legacy CDMS"
ntrs_id: 19940030543
pdf_url: "https://ntrs.nasa.gov/api/citations/19940030543/downloads/19940030543.pdf"
---

An observing program on the Hubble Space Telescope (HST) is described in terms of exposures that are obtained by one or more of the instruments onboard the HST. Many requested exposures might specify orientation requirements and accompanying ranges. Orientation refers to the amount of roll (in degrees) about the line of sight. The range give the permissible tolerance (also in degrees). These requirements may be (1) absolute (in relation to the celestial coordinate system), (2) relative to the nominal roll angle for HST during that exposure, or (3) relative (in relation to other exposures in the observing program). The TRANSformation expert system converts proposals for astronomical observations with HST into detailed observing plans. Part of the conversion involves grouping exposures into higher level structures based on exposure characteristics. Exposures constrained to be at different orientations cannot be grouped together. Because relative orientation requirements cause implicit constraints, orientation constraints have to be propagated. TRANS must also identify any inconsistencies that may exist so they can be corrected. We have designed and implemented an orientation constraint propagator as part of TRANS. The propagator is based on an informal algebra that facilitates the setting up and propagation of the orientation constraints. The constraint propagator generates constraints between directly related exposures, and propagates derived constraints between exposures that are related indirectly. It provides facilities for path-consistency checking, identification of unsatisfiable constraints, and querying of orientation relationships. The system has been successfully operational as part of TRANS for over seven months. The solution has particular significance to space applications in which satellite/telescope pointing and attitude are constrained and relationships exist between multiple configurations.
