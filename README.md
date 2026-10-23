# Trackly -- Lost Luggage Tracking System

## Abstract

Trackly is a Lost Luggage Tracking System designed to help airport staff
manage lost and found luggage reports in an organised way. Staff can
register luggage details, search existing reports, compare lost items
with found items, and update the status when luggage is returned. Each
report receives a unique report ID, and a luggage tag ID can be used to
identify matching reports. When a tag ID is unavailable, the system
suggests possible matches by comparing details such as luggage colour,
type, and identifying features.

The project aims to make lost-luggage handling clearer, faster, and
easier to manage. The current website prototype is built with HTML, CSS,
and JavaScript and uses browser storage to retain reports on the same
browser.

## Features

-   **Staff login page:** A simple demonstration login page opens the
    dashboard after valid demo credentials are entered.
-   **Luggage registration:** Add the passenger name, luggage type,
    optional tag ID, colour, report type, location, and additional
    details.
-   **Unique report IDs:** New reports receive IDs such as `LT1002`.
-   **Tag ID matching:** Lost and found reports with the same tag ID are
    identified as matches.
-   **Possible Finds:** If a lost report has no tag ID, the website
    suggests found reports based on matching colour, luggage type, and
    identifying details.
-   **Search:** Search reports by report ID, passenger name, luggage
    type, tag ID, colour, location, details, or status.
-   **Status filters:** View all reports or filter by Lost, Found, and
    Returned.
-   **Return tracking:** Staff can mark a found item as returned. If it
    has a tag ID, the corresponding lost report with the same ID is also
    marked Returned.
-   **Dashboard statistics:** View total reports and counts of Lost,
    Found, and Returned reports.
-   **Purple responsive interface:** The layout is designed to work on
    desktop and smaller screens.

## Technologies Used

-   **HTML** -- page structure and forms
-   **CSS** -- layout, colours, cards, and responsive styling
-   **JavaScript** -- form handling, matching logic, searching,
    filtering, and status updates
-   **localStorage** -- stores reports in the current browser
-   **sessionStorage** -- keeps the demonstration login state for the
    current browser session
-   **GitHub Pages** -- can host the static website

## Project Files

``` text
Trackly/
├── index.html       # Staff login page
├── dashboard.html   # Main luggage management dashboard
├── style.css        # Purple dashboard styling
├── app.js           # Matching, search, storage, and status logic
└── README.md        # Project documentation
```

## How to Run

1.  Place all four website files (`index.html`, `dashboard.html`,
    `style.css`, and `app.js`) in the same folder or GitHub repository.
2.  Make sure the HTML file names and linked CSS/JavaScript file names
    match exactly.
3.  Open `index.html` through the website hosted on GitHub Pages, or run
    the files in a local web server.
4.  Use the demonstration login below to open the dashboard.
5.  Register Lost and Found reports and test searching, matching,
    filtering, and return tracking.

### Demonstration Login

-   **Username:** `staff`
-   **Password:** `trackly123`

These credentials are hard-coded for demonstration only and must not be
used to protect real or sensitive information.

## How Matching Works

### 1. Tag ID Available

When a report has a luggage tag ID, Trackly compares it with other
reports. If a Lost report and a Found report have the same tag ID, the
system displays a match.

### 2. Tag ID Not Available

When a Lost report has no tag ID, Trackly checks Found reports and
assigns points for matching information:

-   Same colour: 2 points
-   Similar luggage-type word: 2 points
-   Similar identifying-detail word: 1 point

A report with a score of at least 2 is shown under **Possible Finds**.
These are suggestions for staff to check; they do not prove that the
luggage belongs to a passenger.

## Data Structures and Project Scope

The project concept is suitable for demonstrating data-structure ideas
such as storing records, looking up identifiers, and keeping a list of
reports. However, **the current website code uses JavaScript arrays and
browser storage**. It does not implement Java `HashMap` or `LinkedList`
classes.

If the assignment requires a Java implementation using specific data
structures, the Java implementation should be submitted separately and
described accurately. The website can serve as a user-interface
prototype for the same project idea.

## Limitations

-   Reports are saved in the current browser using `localStorage`; they
    are not automatically shared between different staff members,
    browsers, or devices.
-   The staff login is a demonstration only. Its credentials are present
    in client-side code, so it is not secure authentication.
-   The optional tag-photo input is provided in the interface, but the
    selected image is not uploaded or saved.
-   Possible-match suggestions depend on simple text comparisons and
    require staff verification.
-   This is a prototype and is not connected to an airport database or a
    live luggage-tracking service.

## Future Enhancements

-   Add a secure backend and staff authentication.
-   Use a shared database so multiple staff members can access the same
    reports.
-   Save and display luggage-tag photographs.
-   Improve matching with more detailed comparison rules.
-   Add passenger notifications and a verified handover record.
-   Connect the interface to a Java backend if required by the project
    specification.

## Conclusion

Trackly provides a simple way to register and manage lost and found
luggage reports. Tag-ID matching helps identify likely matches, while
Possible Finds provides suggestions when the tag ID is missing. Search,
filters, dashboard statistics, and return-status updates make report
management easier. The current website is a prototype that can be
extended with secure authentication, shared storage, and a backend
implementation as future work.
