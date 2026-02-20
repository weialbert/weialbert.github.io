---
title: "Parameterized Human Head Finite Element Statistical Model"
description: "Developed a statistical model for generating parameterized human head models for validated, finite element automobile crash and airbag impact simulations"
techStack: ["MATLAB", "PCA", "Statistical Modeling", "Multivariate Linear Regression", "Radial Basis Function", "Finite Element Modeling"]
featured: true
draft: false
order: 1
liveUrl: "https://humanshape.app"
---

## Overview

**The Problem:** Automotive crash simulations rely on high-fidelity finite element models of human anatomy, but manual development is expensive and time-consuming. Available models typically represent only "average" populations (50th percentile male/female), leaving a critical gap: existing safeguards (airbags, seatbelts) are not validated across diverse occupants (varying age, height, BMI). This creates a mismatch where protective systems designed for average individuals may provide inadequate or improper protection for shorter, taller, older, or younger occupants.

**The Solution:** This project develops a parametric statistical shape model that generates anatomically accurate head geometries on demand from demographic inputs (age, height, BMI, sex). By learning population-level geometric variation from a dataset of CT-derived head scans, the system enables rapid synthesis of anatomically plausible models without manual reconstruction. This extends crash simulation validation to population-representative occupants, improving safety assessment coverage and enabling systematic study of how occupant variation affects protective device performance.

The resulting model is accessible at [https://humanshape.app/](https://humanshape.app/).

**Related publication:** [Parametric Head Geometry Model Accounting for Variation Among Adolescent and Young Adult Populations](https://www.sciencedirect.com/science/article/abs/pii/S0169260722001870)

---

## Approach

To address the scalability and diversity limitations of manual model development, the approach captures population-level geometric variation through statistical learning. Starting with a dataset of three-dimensional head surface scans, all geometries were processed to enforce consistent mesh structure and point-to-point correspondence across subjects.

**Key technical elements:**
- Mesh segmentation and preprocessing from CT scans
- Rigid and non-rigid alignment using radial basis functions
- Statistical shape model construction from aligned vertex data
- Principal component analysis for dimensionality reduction
- Multivariate linear regression to map anthropometric inputs to shape parameters

### Technical Implementation

#### Radial Basis Function (RBF) Alignment

RBF interpolation establishes point-to-point correspondence across all head geometries by aligning each scan to a common template landmark set. Thin-plate spline RBF functions minimize deformation energy while preserving anatomical features, enabling consistent vertex-to-vertex mapping across the population.

#### Principal Component Analysis (PCA)

PCA decomposes shape variation into orthogonal modes ranked by variance explained. The dominant principal components capture major geometric differences (e.g., head size, facial proportions) while filtering noise. This reduces the high-dimensional vertex coordinate space to a compact set of shape parameters, typically 10-20 modes explaining 85-95% of population variation.

#### Multivariate Linear Regression

Each PCA shape mode is regressed against anthropometric variables (age, height, BMI, sex) using ordinary least squares estimation. This produces linear coefficients relating each anthropometric input to shape parameter predictions. During generation, new anthropometric values input directly predict shape coefficients, which are then reconstructed back to full 3D geometry using the learned PCA basis.

#### Integrated Workflow

An integrated pipeline where continuous anthropometric inputs produce anatomically plausible 3D head geometries without manual intervention. Each head shape is represented as a set of continuous parameters relative to a learned mean geometry, enabling efficient storage and reconstruction.

>[!NOTE] 
> An interactive viewer is accessible [here](https://humanshape.app/) that allows users to select different inputs using sliders to generate human geometries (simplified from FE outputs).



**Tooling:**
- MATLAB for statistical shape model development, RBF, and PCA implementation
- Custom scripts for mesh processing and alignment
- Linear regression libraries for anthropometric decomposition

*For implementation details and experimental results, see [parametric-modeling.pdf](./parametric-modeling.pdf)*

The end-to-end pipeline generates head geometries from anthropometric inputs using the following techniques:

1. **Input validation and normalization** – Ensure inputs (age, height, BMI, sex) are within valid ranges
2. **Shape coefficient prediction** – *Multivariate linear regression* maps anthropometric data to shape parameters
3. **Geometry reconstruction** – Full 3D geometry is reconstructed from learned *shape space* using *PCA basis*
4. **Export** – Meshes are prepared for finite element preprocessing

The pipeline supports batch generation and parametric sweeps for systematic simulation studies.


## Evaluation

Model performance was validated using geometric and statistical techniques:

- **Reconstruction error analysis** – Comparing generated shapes to original scan data via point-to-point metrics
- **Population bounds validation** – Statistical verification that predicted shapes remain within observed variation
- **Anatomical plausibility** – Visual inspection and morphological assessment across extreme input cases

These validation steps ensured generated geometries were both numerically stable and anatomically realistic.


## Impact

The model reduces development effort by enabling direct generation of population-representative head models from measured data, eliminating manual geometry building. Benefits include broader safety coverage, faster iteration cycles, and systematic exploration of how occupant variation influences simulation outcomes.


## Takeaway

This project applies **statistical shape modeling**, **principal component analysis**, **multivariate linear regression**, and **3D geometry processing** to a real-world engineering challenge. The result is a scalable, data-driven system that replaces manual model development and integrates directly into existing simulation workflows. This reduces development time while expanding anatomical diversity for safety testing.

---

**Publication:** *A Parametric Head Geometry Model Accounting for Variation Among Adolescent and Young Adult Populations*, Computer Methods in Biomechanics and Biomedical Engineering, 2022