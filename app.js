
/* Check whether staff has logged in */

if (sessionStorage.getItem("tracklyLoggedIn") !== "true") {
    window.location.replace("index.html");
} else {
    startTrackly();
}

function startTrackly() {

    var records = [];
    var activeFilter = "All";

    var form = document.getElementById("luggageForm");
    var recordsList = document.getElementById("recordsList");
    var possibleFindsList = document.getElementById("possibleFindsList");
    var searchInput = document.getElementById("searchInput");
    var formMessage = document.getElementById("formMessage");

    /* Load saved records */

    var savedRecords = localStorage.getItem("tracklyRecords");

    if (savedRecords != null) {
        try {
            records = JSON.parse(savedRecords);

            if (!Array.isArray(records)) {
                records = [];
            }
        } catch (error) {
            records = [];
        }
    } else {
        /* Sample record for demonstration */

        var sample = {
            id: "LT1001",
            owner: "Sample Passenger",
            luggage: "American Tourister Suitcase",
            tagId: "AT782451",
            color: "Blue",
            type: "Lost",
            location: "Terminal 2, Gate 3",
            details: "White ribbon attached to the handle",
            status: "Lost"
        };

        records.push(sample);
        saveRecords();
    }

    /* Save records in browser storage */

    function saveRecords() {
        localStorage.setItem("tracklyRecords", JSON.stringify(records));
    }

    /* Convert text to lowercase for comparison */

    function normalise(text) {
        return String(text || "").trim().toLowerCase();
    }

    /* Make text safe to display in HTML */

    function escapeHTML(text) {
        return String(text == null ? "" : text).replace(/[&<>"']/g, function(character) {
            var symbols = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return symbols[character];
        });
    }

    /* Generate a unique report ID */

    function makeId() {
        var number = 1001;
        var exists = true;

        while (exists) {
            exists = false;

            for (var i = 0; i < records.length; i++) {
                if (records[i].id == "LT" + number) {
                    exists = true;
                    number++;
                    break;
                }
            }
        }

        return "LT" + number;
    }

    /* Find reports with the same tag ID */

    function findMatches(record) {
        var matches = [];

        if (record.tagId == "") {
            return matches;
        }

        for (var i = 0; i < records.length; i++) {
            var other = records[i];

            if (other.id != record.id &&
                other.tagId != "" &&
                normalise(other.tagId) == normalise(record.tagId) &&
                other.type != record.type) {

                matches.push(other);
            }
        }

        return matches;
    }

    /* Find possible matches when the tag ID is missing */

    function getPossibleMatches(lostRecord) {
        var matches = [];

        if (lostRecord.type != "Lost" ||
            lostRecord.status == "Returned") {
            return matches;
        }

        for (var i = 0; i < records.length; i++) {
            var foundRecord = records[i];

            if (foundRecord.type != "Found" ||
                foundRecord.status == "Returned") {
                continue;
            }

            var score = 0;
            var reasons = [];

            /* If the lost report has a tag ID, use exact matching */

            if (lostRecord.tagId != "") {
                if (foundRecord.tagId != "" &&
                    normalise(lostRecord.tagId) == normalise(foundRecord.tagId)) {

                    matches.push({
                        record: foundRecord,
                        reason: "Exact tag ID match"
                    });
                }

                continue;
            }

            /* Compare colours */

            if (normalise(lostRecord.color) != "" &&
                normalise(lostRecord.color) == normalise(foundRecord.color)) {

                score = score + 2;
                reasons.push("same colour");
            }

            /* Compare luggage type */

            var lostWords = normalise(lostRecord.luggage).split(" ");
            var foundWords = normalise(foundRecord.luggage).split(" ");
            var commonWord = false;

            for (var j = 0; j < lostWords.length; j++) {
                if (lostWords[j].length > 2) {
                    for (var k = 0; k < foundWords.length; k++) {
                        if (lostWords[j] == foundWords[k]) {
                            commonWord = true;
                        }
                    }
                }
            }

            if (commonWord) {
                score = score + 2;
                reasons.push("similar luggage type");
            }

            /* Compare additional details */

            var lostDetails = normalise(lostRecord.details).split(" ");
            var foundDetails = normalise(foundRecord.details).split(" ");
            var commonDetail = false;

            for (var j = 0; j < lostDetails.length; j++) {
                if (lostDetails[j].length > 3) {
                    for (var k = 0; k < foundDetails.length; k++) {
                        if (lostDetails[j] == foundDetails[k]) {
                            commonDetail = true;
                        }
                    }
                }
            }

            if (commonDetail) {
                score = score + 1;
                reasons.push("similar identifying details");
            }

            /* Add reports with a score of at least 2 */

            if (score >= 2) {
                matches.push({
                    record: foundRecord,
                    reason: reasons.join(", ")
                });
            }
        }

        return matches;
    }

    /* Update dashboard statistics */

    function updateStats() {
        var lost = 0;
        var found = 0;
        var returned = 0;

        for (var i = 0; i < records.length; i++) {
            if (records[i].status == "Lost") {
                lost++;
            } else if (records[i].status == "Found") {
                found++;
            } else if (records[i].status == "Returned") {
                returned++;
            }
        }

        document.getElementById("totalCount").textContent = records.length;
        document.getElementById("lostCount").textContent = lost;
        document.getElementById("foundCount").textContent = found;
        document.getElementById("returnedCount").textContent = returned;
    }

    /* Display the report status */

    function statusBadge(status) {
        var className = "status-returned";

        if (status == "Lost") {
            className = "status-lost";
        } else if (status == "Found") {
            className = "status-found";
        }

        return '<span class="status ' + className + '">' +
            escapeHTML(status) + '</span>';
    }

    /* Display one luggage report */

    function makeRecordCard(record) {
        var html = '<article class="record-card">';

        html += '<div class="record-top"><div>';
        html += '<span class="record-id">' + escapeHTML(record.id) + '</span>';
        html += '<h3>' + escapeHTML(record.luggage) + '</h3>';
        html += '</div>';
        html += statusBadge(record.status);
        html += '</div>';

        html += '<p><strong>Passenger:</strong> ' +
            escapeHTML(record.owner) + '</p>';

        html += '<p><strong>Tag ID:</strong> ' +
            escapeHTML(record.tagId || "Not provided") + '</p>';

        html += '<p><strong>Colour:</strong> ' +
            escapeHTML(record.color) + '</p>';

        html += '<p><strong>Location:</strong> ' +
            escapeHTML(record.location) + '</p>';

        if (record.details != "") {
            html += '<p><strong>Details:</strong> ' +
                escapeHTML(record.details) + '</p>';
        }

        /* Show matching reports */

        var matches = findMatches(record);

        if (matches.length > 0) {
            html += '<div class="match-note"><strong>Matching tag ID found:</strong> ';

            for (var i = 0; i < matches.length; i++) {
                if (i > 0) {
                    html += ", ";
                }

                html += escapeHTML(matches[i].id);
                html += " (" + escapeHTML(matches[i].status) + ")";
            }

            html += '</div>';
        }

        /* Allow staff to mark found luggage as returned */

        if (record.type == "Found" && record.status == "Found") {
            html += '<button class="return-btn" data-return-id="' +
                escapeHTML(record.id) + '">Mark as Returned</button>';
        }

        html += '</article>';

        return html;
    }

    /* Display possible matches */

    function renderPossibleFinds() {
        var html = "";
        var count = 0;

        for (var i = 0; i < records.length; i++) {
            if (records[i].type == "Lost" &&
                records[i].status == "Lost") {

                var matches = getPossibleMatches(records[i]);

                for (var j = 0; j < matches.length; j++) {
                    var match = matches[j];

                    html += '<div class="record-card">';
                    html += '<h3>Possible match for ' +
                        escapeHTML(records[i].id) + '</h3>';

                    html += '<p><strong>Lost luggage:</strong> ' +
                        escapeHTML(records[i].luggage) + '</p>';

                    html += '<p><strong>Found report:</strong> ' +
                        escapeHTML(match.record.id) + ' — ' +
                        escapeHTML(match.record.luggage) + '</p>';

                    html += '<div class="match-note">' +
                        escapeHTML(match.reason) + '</div>';

                    html += '</div>';

                    count++;
                }
            }
        }

        if (count == 0) {
            html = '<div class="empty-state">' +
                'No possible matches right now.<br>' +
                'Suggestions appear when suitable found reports are registered.' +
                '</div>';
        }

        possibleFindsList.innerHTML = html;
    }

    /* Display reports based on search and selected filter */

    function renderRecords() {
        var query = normalise(searchInput.value);
        var html = "";
        var count = 0;

        for (var i = 0; i < records.length; i++) {
            var record = records[i];

            var matchesFilter = false;

            if (activeFilter == "All" ||
                activeFilter == record.status) {
                matchesFilter = true;
            }

            var searchableText = normalise(
                record.id + " " +
                record.owner + " " +
                record.luggage + " " +
                record.tagId + " " +
                record.color + " " +
                record.location + " " +
                record.details + " " +
                record.status
            );

            if (matchesFilter && searchableText.indexOf(query) != -1) {
                html += makeRecordCard(record);
                count++;
            }
        }

        if (count == 0) {
            html = '<div class="empty-state">' +
                'No reports found. Try another search or filter.' +
                '</div>';
        }

        recordsList.innerHTML = html;
    }

    /* Refresh the complete dashboard */

    function renderAll() {
        updateStats();
        renderPossibleFinds();
        renderRecords();
    }

    /* Register a new luggage report */

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        var owner = document.getElementById("owner").value.trim();
        var luggage = document.getElementById("luggage").value.trim();
        var tagId = document.getElementById("tagId").value.trim();
        var color = document.getElementById("color").value.trim();
        var type = document.getElementById("reportType").value;
        var location = document.getElementById("location").value.trim();
        var details = document.getElementById("details").value.trim();

        if (owner == "" || luggage == "" ||
            color == "" || location == "") {

            formMessage.textContent = "Please complete all required fields.";
            return;
        }

        var newRecord = {
            id: makeId(),
            owner: owner,
            luggage: luggage,
            tagId: tagId,
            color: color,
            type: type,
            location: location,
            details: details,
            status: type
        };

        records.unshift(newRecord);

        saveRecords();
        form.reset();

        if (type == "Lost" && tagId == "") {
            formMessage.textContent =
                "Report registered! It will be checked for possible matches.";
        } else {
            formMessage.textContent =
                "Report " + newRecord.id + " registered successfully!";
        }

        renderAll();
    });

    /* Search reports */

    searchInput.addEventListener("input", function() {
        renderRecords();
    });

    /* Filter reports */

    var filterButtons = document.querySelectorAll(".filter-btn");

    for (var i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener("click", function() {
            activeFilter = this.getAttribute("data-filter");

            for (var j = 0; j < filterButtons.length; j++) {
                filterButtons[j].classList.remove("active");
            }

            this.classList.add("active");
            renderRecords();
        });
    }

    /* Handle the Return button */

    recordsList.addEventListener("click", function(event) {
        var button = event.target.closest("[data-return-id]");

        if (button != null) {
            markReturned(button.getAttribute("data-return-id"));
        }
    });

    /* Mark luggage as returned */

    function markReturned(recordId) {
        var selectedRecord = null;

        for (var i = 0; i < records.length; i++) {
            if (records[i].id == recordId) {
                selectedRecord = records[i];
                break;
            }
        }

        if (selectedRecord == null ||
            selectedRecord.type != "Found" ||
            selectedRecord.status != "Found") {
            return;
        }

        selectedRecord.status = "Returned";

        /* Also update lost reports with the same tag ID */

        if (selectedRecord.tagId != "") {
            for (var i = 0; i < records.length; i++) {
                var record = records[i];

                if (record.id != selectedRecord.id &&
                    record.type == "Lost" &&
                    record.tagId != "" &&
                    normalise(record.tagId) == normalise(selectedRecord.tagId)) {

                    record.status = "Returned";
                }
            }
        }

        saveRecords();
        renderAll();
    }

    /* Log out staff */

    document.getElementById("logoutBtn").addEventListener("click", function() {
        sessionStorage.removeItem("tracklyLoggedIn");
        window.location.replace("index.html");
    });

    /* Display saved records when the page opens */

    renderAll();
}
