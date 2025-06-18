
document.addEventListener('DOMContentLoaded', function() {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	const totalVideosSpan = document.getElementById('totalVideos');
	const completedCountSpan = document.getElementById('completedCount');
	const percentageSpan = document.getElementById('percentage');
	const progressBar = document.getElementById('progressBar');


	const totalVideos = checkboxes.length;
	totalVideosSpan.textContent = totalVideos;

	function updateProgress() {
		let completedCount = 0;
		checkboxes.forEach(checkbox => {
			if (checkbox.checked) {
				completedCount++;
			}
		});

		const percentage = totalVideos === 0? 0 : (completedCount / totalVideos) * 100;

		completedCountSpan.textContent = completedCount;
		percentageSpan.textContent = percentage.toFixed(0) + '%'; // Round to whole number for display
		progressBar.style.width = percentage + '%';
		progressBar.textContent = percentage.toFixed(0) > 0? percentage.toFixed(0) + '%' : ''; // Display percentage inside bar if > 0

		// Save states to localStorage
		checkboxes.forEach(checkbox => {
			localStorage.setItem(checkbox.id, checkbox.checked);
		});
	}

	// Load saved states from localStorage and update progress on initial load
	checkboxes.forEach(checkbox => {
		const isChecked = localStorage.getItem(checkbox.id) === 'true';
		checkbox.checked = isChecked;
	});
	updateProgress(); // Call once after loading states

	// Add event listeners to update progress on change
	checkboxes.forEach(checkbox => {
		checkbox.addEventListener('change', updateProgress);
	});
});
 