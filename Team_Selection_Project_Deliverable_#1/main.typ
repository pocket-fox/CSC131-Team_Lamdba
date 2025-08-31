#import "./formatting.typ": *
#show: doc => formatting(doc)

#align(center)[
    = Members of #team_name
    #table(
        columns: (auto, auto),
        inset: 10pt,
        stroke: none,
        align: (left + horizon, right + horizon),
        [Amaan Habib _(Lead)_], [amaanhabib\@csus.edu],
        [Connor Lecluse], [clecluse\@csus.edu],
        [Dan], [\@csus.edu],
        [Micho], [\@csus.edu],
        [Rey], [\@csus.edu],
        [Brittnee McDonald], [bmcdonald2\@csus.edu],
    )
]

== Amaan Habib
#lorem(50)

== Connor Lecluse
#lorem(50)

== Dan
#lorem(50)

== Micho
#lorem(50)

== Rey
#lorem(50)

== Brittnee McDonald
Experience with Java, C++, and SQL.

= Team Procedures

The project will be completed using Git and Github as the projects collaboration
tool of choice, with additional optional usage of a personal server for live
collaboration. Team members are expected to keep a local fork of the project
repository from which they will make pull requests on Github for changes they
wish to make to the project. These pull requests must then be reviewed by at
least one other member of the team before being accepted and merged into the
main project branch.

Team members are minimally expected to test the compilation and execution of all
branches they submit as a pull request and/or review from another team member.
The project should both compile and execute without any obvious errors before a
pull request is accepted. Once the project language is specified, the team is
expected to decide on a particular release of the language that satisfies the
projects requirements; each team member is expected to use this release when
running the tests to verify successful compilation and execution of the project.

Pull requests should be singular and focused in the changes they include. Team
members will try to keep the scope of their proposed changes within any single
pull request to the mimimum necessary changes for the feature or fix they are
attempting to implement. Additionally, commit messages should be written as
grammatically valid completions of the phrase: "This commit will...".
