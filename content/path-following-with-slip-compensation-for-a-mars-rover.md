---
title: "Path Following with Slip Compensation for a Mars Rover"
slug: "path-following-with-slip-compensation-for-a-mars-rover"
program: "Mars Exploration"
category: "Other - NASA Tech Brief"
tags: ["Cybernetics, Artificial Intelligence And Robotics"]
year: 2019
excerpt: "A software system for autonomous operation of a Mars rover is composed of several key algorithms that enable the rover to accurately follow a designated path, compensate for slippage of its wheels on"
authors: ["Helmick, Daniel", "Cheng, Yang", "Clouse, Daniel", "Matthies, Larry", "Roumeliotis, Stergios"]
center: "Jet Propulsion Laboratory"
ntrs_id: 20110015134
pdf_url: "https://ntrs.nasa.gov/api/citations/20110015134/downloads/20110015134.pdf"
---

A software system for autonomous operation of a Mars rover is composed of several key algorithms that enable the rover to accurately follow a designated path, compensate for slippage of its wheels on terrain, and reach intended goals. The techniques implemented by the algorithms are visual odometry, full vehicle kinematics, a Kalman filter, and path following with slip compensation. The visual-odometry algorithm tracks distinctive scene features in stereo imagery to estimate rover motion between successively acquired stereo image pairs, by use of a maximum-likelihood motion-estimation algorithm. The full-vehicle kinematics algorithm estimates motion, with a no-slip assumption, from measured wheel rates, steering angles, and angles of rockers and bogies in the rover suspension system. The Kalman filter merges data from an inertial measurement unit (IMU) and the visual-odometry algorithm. The merged estimate is then compared to the kinematic estimate to determine whether and how much slippage has occurred. The kinematic estimate is used to complement the Kalman-filter estimate if no statistically significant slippage has occurred. If slippage has occurred, then a slip vector is calculated by subtracting the current Kalman filter estimate from the kinematic estimate. This slip vector is then used, in conjunction with the inverse kinematics, to determine the wheel velocities and steering angles needed to compensate for slip and follow the desired path.
