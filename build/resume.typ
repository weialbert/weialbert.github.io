#let resume(
  author: "",
  author-position: center,
  location: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  personal-info-position: center,

  color-enabled: true,
  text-color: "#000080",
  font: "New Computer Modern",
  paper: "us-letter",
  author-font-size: 20pt,
  font-size: 10pt,
  lang: "en",
  body,
) = {
  set document(author: author, title: author)

  set text(
    font: font,
    size: font-size,
    lang: lang,
    ligatures: false,
  )
  set page(
    margin: 0.5in,
    paper: paper,
  )

  show heading: set text(fill: if color-enabled { rgb(text-color) } else { black })
  show link: set text(fill: if color-enabled { rgb(text-color) } else { blue })
  show link: underline

  show heading.where(level: 1): it => [
    #set align(author-position)
    #set text(
      weight: "bold",
      size: author-font-size,
    )
    #pad(it.body)
  ]

  [= #(author)]

  let contact-item(value, prefix: "", link-type: "") = {
    if value != "" {
      if link-type != "" {
        link(link-type + value)[#(prefix + value)]
      } else {
        value
      }
    }
  }
  pad(
    top: 0.20em,
    align(personal-info-position)[
      #{
        let items = (
          contact-item(phone),
          contact-item(location),
          contact-item(email, link-type: "mailto:"),
          contact-item(github, link-type: "https://"),
          contact-item(linkedin, link-type: "https://"),
          contact-item(portfolio, link-type: "https://"),
        )
        items.filter(x => x != none).join("  |  ")
      }
    ],
  )

  show heading.where(level: 2): it => [
    #pad(top: 0pt, bottom: -10pt, [#smallcaps(it.body)])
    #line(length: 100%, stroke: 1pt)
  ]

  set par(
    justify: true,
    leading: 0.65em,
    spacing: 0.65em,
  )

  body
}

#let one-by-one-layout(
  left: "",
  right: "",
) = {
  [
    #left #h(1fr) #right
  ]
}

#let two-by-two-layout(
  top-left: "",
  top-right: "",
  bottom-left: "",
  bottom-right: "",
) = {
  grid(
    columns: (3fr, 1fr),
    column-gutter: 1em,
    row-gutter: 0.5em,
    align: (top + left, top + right),
    top-left, top-right,
    bottom-left, bottom-right
  )
}

#let dates-util(
  start-date: "",
  end-date: "",
) = {
  if end-date == "" {
    start-date
  } else {
    start-date + " " + $dash.em$ + " " + end-date
  }
}

// Experience Component
#let work(
  company: "",
  role: "",
  dates: "",
  tech-used: "",
  location: "",
) = {
  if tech-used == "" {
    two-by-two-layout(
      top-left: strong(company),
      top-right: dates,
      bottom-left: role,
      bottom-right: emph(location),
    )
  } else {
    two-by-two-layout(
      top-left: strong(company) + " " + "|" + " " + strong(role),
      top-right: dates,
      bottom-left: tech-used,
      bottom-right: emph(location),
    )
  }
}

// Project Component
// Optional arguments: tech-used
#let project(
  name: "",
  dates: "",
  tech-used: "",
  url: "",
) = {
  if tech-used == "" {
    one-by-one-layout(
      left: [*#name* #if url != "" and dates != "" [(#link("https://" + url)[#url])]],
      right: dates,
    )
  } else {
    two-by-two-layout(
      top-left: strong(name),
      top-right: dates,
      bottom-left: tech-used,
      bottom-right: [(#link("https://" + url)[#url])],
    )
  }
}

// Education Component
#let edu(
  institution: "",
  location: "",
  degree: "",
  dates: "",
) = {
  two-by-two-layout(

    top-left: strong(institution),
    top-right: dates,
    bottom-left: degree,
    bottom-right: emph(location),
  )
}

// Final Output
#show: resume.with(
  author: "Albert Wei",
  author-position: center,

  // Personal information (optional)
  location: "New York, NY",
  email: "alwei@umich.edu",
  phone: "(203) 529-7086",
  
  portfolio: "weialbert.github.io",
  personal-info-position: center,

  // Document formatting defaults (override in data if desired)
  color-enabled: false,
  text-color: "#000080",
  font: "New Computer Modern",
  paper: "us-letter",
  author-font-size: 20pt,
  font-size: 10pt,
  lang: "en",
)



== Education

#edu(
  institution: "University of Michigan",
  location: "Ann Arbor, MI",
  degree: "MSE Industrial & Operations Engineering – Operations Research \nBSE Industrial & Operations Engineering",
  dates: dates-util(start-date: "2021", end-date: "2021"),
)
 - Awards: Summa Cum Laude (2021, 2022), Dean's List (2018–2022), University Honors, James B. Angell Scholar 





== Experience


#work(
  company: "Palantir Technologies",
  role: "Data Engineer",
  dates: dates-util(start-date: "2025", end-date: "present"),
  tech-used: "",
  location: "New York, NY",
)

- Migrated petabyte-scale production datasets to iceberg table format, optimizing storage costs by 40+% and enabling real-time analytics capabilities for enterprise stakeholders




#work(
  company: "Capital One",
  role: "Senior Data Analyst",
  dates: dates-util(start-date: "2021", end-date: "2025"),
  tech-used: "",
  location: "McLean, VA",
)

- Owned US Card complaints data pipeline (Snowflake SQL and Python), migrated data source to S3 enabling real time updates, reduced dataset query time from 300 to 1 seconds, and oversaw change management for 100+ analysts onto production system serving SVP+ leadership

- Refactored legacy retail bank overdraft risk model monitoring pipeline, combining 8 cloud data sources and optimizing runtime from 4+ hours to 20 minutes through parallelization and Apache Spark compute optimization

- Built central data quality framework using Python and Apache Airflow, eliminating 20+ organization-wide adhoc solutions and enabling advanced statistical trend analysis capabilities with scalable infrastructure supporting 70+ production datasets

- Led federal Community Reinvestment Act (CRA) compliance data strategy coordinating cross-functional teams and delivering regulatory submissions to US Treasury OCC

- Designed and implemented intelligent real-time recoveries analytics infrastructure using Airflow, Apache Hamilton, and Snowflake supporting \$10M+ core business decision-making




#work(
  company: "University of Michigan – Transportation Research Institute",
  role: "Model Developer & First Author",
  dates: dates-util(start-date: "2018", end-date: "2021"),
  tech-used: "",
  location: "Ann Arbor, MI",
)

- Published peer-reviewed first-author paper on parametric head geometry modeling using PCA and multivariate linear regression in MATLAB

- Automated landmark and feature extraction from 1,000+ CT images with Machine Learning radial basis functions and cubic spline interpolation














== Publications

- A Parametric Head Geometry Model Accounting for Variation Among Adolescent and Young Adult Populations, Wei, A., et al., Computer Methods and Programs in Biomedicine (2022)





== Technical Skills

- *Programming & Core Tools*: C++, Rust, Python (pandas, numpy, scikit-learn, TensorFlow, PyTorch), SQL (Snowflake, PostgreSQL, NoSQL), R, CI & CD (Github Actions, Jenkins)

- *Data Engineering & Infrastructure*: Apache Spark, Airflow, Kafka, Hamilton, AWS (S3, Glue, Redshift, EMR, SageMaker, Lambda, Athena), Azure (Databricks, Blob Storage, Data Factory, Synapse), GCP (BigQuery, Cloud Storage, Dataflow, Dataproc), Docker

- *Analytics & Visualization*: Jupyter Notebooks, Tableau, Power BI, Statistical Regression Analysis, Time Series (ARIMA, Prophet), A/B Testing

- *Machine Learning & Optimization*: Predictive Modeling, Natural Language Processing, Anomaly Detection & Variance Testing, Linear & Nonlinear Optimization, Operations Research

