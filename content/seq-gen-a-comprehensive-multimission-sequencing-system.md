---
title: "SEQ-GEN: A comprehensive multimission sequencing system"
slug: "seq-gen-a-comprehensive-multimission-sequencing-system"
program: "Deep Space"
category: "Conference Paper"
tags: ["Computer Programming And Software"]
year: 2013
excerpt: "SEQ-GEN is a user-interactive computer program used to plan and generate a sequence of commands for spacecraft. Desired activities are specified by the user of SEQ-GEN; SEQ-GEN in turn expands these a"
authors: ["Salcedo, Jose", "Starbird, Thomas J."]
center: "Legacy CDMS"
ntrs_id: 19950011125
pdf_url: "https://ntrs.nasa.gov/api/citations/19950011125/downloads/19950011125.pdf"
---

SEQ-GEN is a user-interactive computer program used to plan and generate a sequence of commands for spacecraft. Desired activities are specified by the user of SEQ-GEN; SEQ-GEN in turn expands these activities, deriving the spacecraft commands necessary to accomplish the desired activities. SEQ-GEN models the effects on the spacecraft of the commands, predicting the state as a function of time, flagging any conflicts and rule violations. These states, conflicts, and violations are viewable both graphically and textually at the user's request. SEQ-GEN also displays the entire sequence graphically, showing each requested activity as a bar on its graphical timeline. SEQ-GEN immediately revalidates the sequence, updating its models and calculations along with its displays based on these changes. Because it has the ability to recalculate spacecraft states immediately, the user is able to perform 'what-if' sessions easily. SEQ-GEN, a multimission tool, is adaptable to any flight project. A flight project writes its adaptation files containing project unique information including in its simplest form, only spacecraft commands. For more involved projects the adaptation files may also contain flight and mission rules, description of the spacecraft and ground models, and the definition of activities. SEQ-GEN operates at whatever level of detail the adaptation files imply. Simple adaptations are straight forward to do. There is, however, no limit to the complexity of activity definitions or of spacecraft models: both may involve unlimited logical decision points. Commands and activities may involve any number of parameters of a wide variety of data types, including integer, float, time, boolean, and character strings. SEQ-GEN will be used by the Mars Pathfinder, Cassini, and VIM (Voyager Interstellar Mission) project in an effort to speed up adaptation time and to keep sequence generation costs down. SEQ-GEN is hosted on UNIX workstations. It uses MOTIF and X for windowing, and was designed and coded in an object-oriented style in the language C++.
