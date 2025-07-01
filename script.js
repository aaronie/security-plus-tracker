document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const totalVideosSpan = document.getElementById('totalVideos');
    const completedCountSpan = document.getElementById('completedCount');
    const percentageSpan = document.getElementById('percentage');
    const progressBar = document.getElementById('progressBar');
    const totalTimeSpan = document.getElementById('totalTime');
    const timeRemainingSpan = document.getElementById('timeRemaining');

    // Helper function to convert MM:SS to total seconds
    function timeToSeconds(timeStr) {
        const parts = timeStr.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        }
        return 0; // Invalid format
    }

    // Helper function to convert total seconds to HH:MM:SS (or MM:SS if no hours)
    function secondsToHms(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const h = String(hours).padStart(2, '0');
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');

        if (hours > 0) {
            return `${h}:${m}:${s}`;
        } else {
            return `${m}:${s}`; // For shorter durations, just MM:SS
        }
    }

    // This part remains the same: total number of videos found in the HTML
    const totalVideos = checkboxes.length;
    totalVideosSpan.textContent = totalVideos;

    function updateProgress() {
        let completedCount = 0;
        let totalDurationSeconds = 0;
        let completedDurationSeconds = 0;

        checkboxes.forEach(checkbox => {
            // Get the row for the current checkbox
            const row = checkbox.closest('tr');
            // Get the 'Run Time' cell (3rd td in the row, index 2)
            const runTimeCell = row.children[2];
            const runTimeStr = runTimeCell ? runTimeCell.textContent.trim() : '00:00';
            const videoDuration = timeToSeconds(runTimeStr);

            totalDurationSeconds += videoDuration; // Add to total duration regardless of completion

            if (checkbox.checked) {
                completedCount++;
                completedDurationSeconds += videoDuration; // Add to completed duration
            }

            // Save states to localStorage for each checkbox
            localStorage.setItem(checkbox.id, checkbox.checked);
        });

        // --- THE KEY CHANGE IS HERE ---
        // Calculate percentage based on time completed, not video count
        const percentage = totalDurationSeconds === 0 ? 0 : (completedDurationSeconds / totalDurationSeconds) * 100;
        // --- END OF KEY CHANGE ---

        const timeRemainingSeconds = totalDurationSeconds - completedDurationSeconds;

        completedCountSpan.textContent = completedCount;
        percentageSpan.textContent = percentage.toFixed(0) + '%';
        progressBar.style.width = percentage + '%';
        progressBar.textContent = percentage.toFixed(0) > 0 ? percentage.toFixed(0) + '%' : '';

        // Update the time display elements
        totalTimeSpan.textContent = secondsToHms(totalDurationSeconds);
        timeRemainingSpan.textContent = secondsToHms(timeRemainingSeconds);
    }

    // Load saved states from localStorage and update progress on initial load
    checkboxes.forEach(checkbox => {
        const isChecked = localStorage.getItem(checkbox.id) === 'true';
        checkbox.checked = isChecked;
    });
    updateProgress(); // Call once after loading states and initial setup

    // Add event listeners to update progress on change
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });
});