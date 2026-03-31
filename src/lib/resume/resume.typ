// ============================================================
// 1. DATA
// ============================================================

#let resume-data     = yaml("/src/data/resume.yaml")
#let profiles-config = yaml("/src/data/profiles.yaml")


// ============================================================
// 2. UTILITIES
// ============================================================

// Safe dictionary accessor with optional default
#let get(dict, key, default: none) = {
  if key in dict { dict.at(key) } else { default }
}

// Formats a date range; omits the dash when there is no end date
#let dates-util(start-date: "", end-date: "") = {
  if end-date == "" { start-date } else { start-date + "—" + end-date }
}

// Filters, sorts descending by importance, and caps bullets per profile settings
#let filter-bullets(bullets, profile) = {
  if bullets == none or bullets.len() == 0 { return () }

  let min-importance = get(profile, "min_importance",             default: 0)
  let max-bullets    = get(profile, "max_bullets_per_experience", default: bullets.len())
  let include-tags   = get(profile, "include_tags",               default: ())
  let exclude-tags   = get(profile, "exclude_tags",               default: ())

  let filtered = bullets.filter(b => get(b, "importance", default: 0) >= min-importance)

  if include-tags != none and include-tags.len() > 0 {
    filtered = filtered.filter(b =>
      get(b, "tags", default: ()).any(tag => include-tags.contains(tag))
    )
  }

  if exclude-tags != none and exclude-tags.len() > 0 {
    filtered = filtered.filter(b =>
      not get(b, "tags", default: ()).any(tag => exclude-tags.contains(tag))
    )
  }

  filtered
    .sorted(key: b => (
      -get(b, "importance", default: 0),  // primary: higher importance first
      get(b, "id", default: "")           // secondary: ascending ID
    ))
    .slice(0, calc.min(filtered.len(), max-bullets))
}


// ============================================================
// 3. LAYOUT PRIMITIVES
// ============================================================

// Two-column grid: left content stretches, right content is auto-width and right-aligned
#let entry-layout(left-content: "", right-content: "") = {
  grid(
    columns: (1fr, auto),
    column-gutter: 1em,
    align(left, left-content),
    align(right, right-content),
  )
}

// Section heading with a full-width rule beneath it
#let section(title) = {
  align(center, line(length: 90%, stroke: 0.4pt))
  v(-0.6em)
  heading(level: 2, numbering: none, title)
}


// ============================================================
// 4. ENTRY COMPONENTS
// ============================================================

// Work: 2x2 grid — company/role on left, dates/location on right
#let work(company: "", role: "", dates: "", location: "") = {
  grid(
    columns: (1fr, auto),
    column-gutter: 1em,
    row-gutter: 0.4em,
    strong(company),  align(right, dates),
    role,             align(right, emph(location)),
  )
}

// Project: name + tech-used on left, dates + url on right
#let project(name: "", dates: "", tech-used: "", url: "") = {
  entry-layout(
    left-content: {
      strong(name)
      if tech-used != "" { linebreak(); tech-used }
    },
    right-content: {
      dates
      if url != "" { linebreak(); link("https://" + url)[#url] }
    },
  )
}

// Education: institution + degree on left, dates + location on right
#let edu(institution: "", location: "", degree: "", dates: "") = {
  entry-layout(
    left-content: {
      strong(institution)
      if degree != "" { linebreak(); degree }
    },
    right-content: {
      dates
      if location != "" { linebreak(); emph(location) }
    },
  )
}


// ============================================================
// 5. DOCUMENT SHELL
// ============================================================

// Sets page/font defaults, renders the name header and contact bar, then body
#let resume(
  author: "",
  location: "",
  email: "",
  phone: "",
  portfolio: "",
  body,
) = {
  set document(author: author, title: author)
  set text(font: "New Computer Modern", size: 10pt)
  set page(margin: 0.5in, paper: "us-letter")

  align(center, heading(level: 1, numbering: none)[#author])

  // Returns a plain or linked inline element, or none if value is empty
  let contact-item(value, link-type: "") = {
    if value != "" and value != none {
      if link-type != "" { link(link-type + value)[#value] } else { value }
    }
  }

  pad(top: -0.2em, align(center)[
    #{
      (
        contact-item(phone),
        contact-item(location),
        contact-item(email,     link-type: "mailto:"),
        contact-item(portfolio, link-type: "https://"),
      ).filter(x => x != none).join("  |  ")
    }
  ])

  body
}


// ============================================================
// 6. RENDER LOGIC
// ============================================================

#let render-resume(profile-name: "default") = {
  let profile  = get(profiles-config.profiles, profile-name, default: ())
  let data     = resume-data
  let personal = get(data, "personal", default: ())

  // Filter experiences to those with at least one visible bullet
  let filtered-experiences = get(data, "experiences", default: ())
    .map(exp => (
      company:  get(exp, "company",  default: ""),
      role:     get(exp, "role",     default: ""),
      start:    get(exp, "start",    default: ""),
      end:      get(exp, "end",      default: ""),
      location: get(exp, "location", default: ""),
      bullets:  filter-bullets(get(exp, "bullets", default: ()), profile),
    ))
    .filter(exp => exp.at("bullets").len() > 0)

  // Filter projects to those with at least one visible bullet
  let filtered-projects = if "projects" in data {
    data.projects
      .map(proj => (
        name:      get(proj, "name",      default: ""),
        dates:     get(proj, "dates",     default: ()),
        tech-used: get(proj, "tech-used", default: ""),
        url:       get(proj, "url",       default: ""),
        bullets:   filter-bullets(get(proj, "bullets", default: ()), profile),
      ))
      .filter(p => p.at("bullets").len() > 0)
  } else { () }

  show: resume.with(
    author:    get(personal, "name",      default: ""),
    location:  get(personal, "location",  default: ""),
    email:     get(personal, "email",     default: ""),
    phone:     get(personal, "phone",     default: ""),
    portfolio: get(personal, "portfolio", default: ""),
  )

  // Education
  if "education" in data and data.education.len() > 0 {
    section("Education")
    for item in data.education {
      edu(
        institution: get(item, "institution", default: ""),
        location:    get(item, "location",    default: ""),
        degree:      get(item, "degrees", default: ()).map(d => get(d, "degree", default: "")).join("\n"),
        dates:       get(item, "dates",       default: ""),
      )
    }
  }

  // Experience
  if filtered-experiences.len() > 0 {
    section("Experience")
    for exp in filtered-experiences {
      work(
        company:  exp.at("company"),
        role:     exp.at("role"),
        dates:    dates-util(start-date: str(exp.at("start")), end-date: str(exp.at("end"))),
        location: exp.at("location"),
      )
      for bullet in exp.at("bullets") {
        [- #get(bullet, "text", default: "").replace("$", "\\$")]
      }
    }
  }

  // Projects
  if filtered-projects.len() > 0 {
    section("Projects")
    for proj in filtered-projects {
      project(
        name:      proj.at("name"),
        dates:     "",
        tech-used: proj.at("tech-used"),
        url:       proj.at("url"),
      )
      for bullet in proj.at("bullets") {
        [- #get(bullet, "text", default: "")]
      }
    }
  }

  // Technical Skills
  if "skills" in data and data.skills.len() > 0 {
    section("Technical Skills")
    for skill in data.skills {
      [- *#get(skill, "category", default: "")*: #get(skill, "items", default: ()).join(", ")]
    }
  }
}


// ============================================================
// 7. ENTRY POINT
// ============================================================

#render-resume(profile-name: sys.inputs.at("profile", default: "default"))
