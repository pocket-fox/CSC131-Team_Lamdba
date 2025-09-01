// Per assignment variables:
#let team_name = [Team Lambda]
#let deliverable_number = 1
#let title = [Team Selection & Organization]
#let due_date = [September 2, 2025]

// Document formatting
#let formatting(doc) = {
    set page(margin: (left: 3cm, right: 3cm, bottom: 4cm))
    set page(header: context {
        if counter(page).get().first() > 1 {
            grid(
                columns: (50%, 50%),
                rows: 1,
                align(left)[Deliverable \##deliverable_number],
                align(right)[#title],
            )
        }
    })
    set page(footer: context {
        if counter(page).get().first() > 1 {
            align(right)[#counter(page).display("1")]
        }
    })

    set par(justify: true)
    set text(size: 12pt)

    show heading: it => {
        set text(size: 12pt)
        it
    }
    show heading.where(level: 1): it => {
        if query(heading.where(level: 1).before(here())).len() > 1 {
            pagebreak()
        }
        set block(below: 1em)
        it
    }

    align(center + horizon)[
        Deliverable \##deliverable_number\
        *#title*\
        \
        CSC131 #sym.dash.em Computer Software Engineering\
        // Section 8\
        Fall 2025 *#sym.section*\8\
        #team_name\
        #due_date\
        #pagebreak()
    ]

    doc
}
