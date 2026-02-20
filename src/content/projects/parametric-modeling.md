---
title: "Parameterized Human Head Finite Element Statistical Model"
description: "Developed a statistical model for generating parameterized human head models for validated, finite element automobile crash and airbag impact simulations"
techStack: ["MATLAB", "PCA","Statistical Modeling", "Multivariate Linear Regression", "Radial Basis Function", "Finite Element Modeling"]
featured: true
draft: true
order: 1
# githubUrl: "https://github.com/weialbert/weialbert.github.io"
liveUrl: "https://pubmed.ncbi.nlm.nih.gov/35439654/"
# image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&q=80"
---


## Overview

This project involved developing a parametric system for generating adult head geometries from anthropometric inputs such as age, height, and BMI. The model was designed to support automotive crash simulation workflows, where detailed finite element (FE) human models are typically limited to average male and female anatomies due to development cost.

The core contribution is a data-driven modeling pipeline that captures population-level geometric variation and enables controlled generation of anatomically realistic head shapes for simulation use.

Related publication:  
[Parametric Head Geometry Model Accounting for Variation Among Adolescent and Young Adult Populations](https://www.sciencedirect.com/science/article/abs/pii/S0169260722001870)

---

## Overview

Automotive safety simulations rely on high-resolution anatomical models that are expensive to create and difficult to scale across populations. This creates a mismatch between the diversity of real-world occupants and the limited set of models available for testing.

From a modeling standpoint, this is a dimensionality and generalization problem: complex geometry must be represented in a way that allows variation, prediction, and reuse without manual reconstruction.


## Approach

A dataset of three-dimensional head surface scans was used as the foundation for the model. All geometries were processed to enforce consistent mesh structure and point-to-point correspondence across subjects.

Key technical elements included:
- 3D mesh preprocessing and cleanup  
- Rigid and non-rigid alignment to a common template  
- Construction of a statistical shape model from aligned vertex data  
- Dimensionality reduction to identify dominant geometric variation  

Each head shape is represented as a set of continuous parameters relative to a learned mean geometry, enabling efficient storage and reconstruction.


## Generation Pipeline

Anthropometric variables (age, height, BMI, sex) were used as inputs to predict shape parameters through multivariate regression modeling.

The end-to-end pipeline consists of:
1. Input validation and normalization  
2. Prediction of shape coefficients from physical descriptors  
3. Reconstruction of full 3D geometry from the learned shape space  
4. Export of meshes compatible with finite element preprocessing  

The pipeline supports batch generation and parametric sweeps for simulation studies.


## Evaluation

Model performance was assessed using both geometric accuracy and statistical consistency checks.

Evaluation steps included:
- Reconstruction error analysis comparing generated shapes to original scan data  
- Verification that predicted shapes remained within observed population bounds  
- Visual inspection of anatomical features across extreme input cases  

These checks ensured that generated geometries were both numerically stable and anatomically plausible.


## Impact

The resulting model significantly reduces the effort required to introduce anatomical variation into crash simulations. Instead of manually building new geometries, engineers can generate population-representative head models directly from measured data.

This enables broader safety coverage, faster iteration, and more systematic exploration of how occupant variation influences simulation outcomes.


## Takeaway

This project demonstrates the application of statistical modeling, regression, and 3D geometry processing to a real-world engineering problem involving high-dimensional data and limited samples. The approach replaces manual model development with a scalable, predictive system that integrates directly into existing simulation workflows.


## Reference

- *A Parametric Head Geometry Model Accounting for Variation Among Adolescent and Young Adult Populations*,  
  Computer Methods in Biomechanics and Biomedical Engineering, 2022