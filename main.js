document.addEventListener("DOMContentLoaded", function () {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    // Map temperaments to numerical values
    const temperamentValues = {
        'introverted': 1,
        'balanced': 2,
        'extroverted': 3
    };

    // Function to calculate circular difference for zodiac signs
    function calculateCircularDifference(index1, index2) {
        return Math.min(Math.abs(index1 - index2), signs.length - Math.abs(index1 - index2));
    }

    // Function to calculate temperament compatibility
    function calculateTemperamentDifference(temperament1, temperament2) {
        return Math.abs(temperamentValues[temperament1] - temperamentValues[temperament2]);
    }

    // Function to handle compatibility check
    function discoverCompatibility() {
        // Get values from the form
        const yourName = document.getElementById("your-name").value;
        const yourAge = parseInt(document.getElementById("your-age").value);
        const yourTemperament = document.getElementById("your-temperament").value;
        const yourGender = document.querySelector('input[name="your-gender"]:checked').value;
        const yourZodiacSign = document.getElementById("your-zodiac-sign").value;

        const partnerName = document.getElementById("partner-name").value;
        const partnerAge = parseInt(document.getElementById("partner-age").value);
        const partnerTemperament = document.getElementById("partner-temperament").value;
        const partnerGender = document.querySelector('input[name="partner-gender"]:checked').value;
        const partnerZodiacSign = document.getElementById("partner-zodiac-sign").value;

        // Perform compatibility check
        const compatibilityResult = checkCompatibility(yourAge, partnerAge, yourTemperament, partnerTemperament, yourZodiacSign, partnerZodiacSign);

        // Calculate love percentage
        const lovePercentage = calculateLovePercentage(yourName, partnerName, yourAge, partnerAge, yourTemperament, partnerTemperament, yourZodiacSign, partnerZodiacSign);

        // Determine FLAMES result
        const flamesResult = determineFlames(yourName, partnerName, lovePercentage);

        // Display the overall result
        displayResult({ name: yourName, age: yourAge, temperament: yourTemperament, zodiacSign: yourZodiacSign },
            { name: partnerName, age: partnerAge, temperament: partnerTemperament, zodiacSign: partnerZodiacSign },
            compatibilityResult, flamesResult);

        // Display result in modal
        displayResultInModal(compatibilityResult, flamesResult);
    }

    // Function to calculate love percentage based on various factors
    function calculateLovePercentage(yourName, partnerName, yourAge, partnerAge, yourTemperament, partnerTemperament, yourZodiacSign, partnerZodiacSign) {
        const maxLength = Math.max(yourName.length, partnerName.length);
        const minLength = Math.min(yourName.length, partnerName.length);
        const lengthDifference = maxLength - minLength;

        // Calculate zodiac sign compatibility using circular difference
        const zodiacDifference = calculateCircularDifference(signs.indexOf(yourZodiacSign), signs.indexOf(partnerZodiacSign));

        // Additional factors affecting love percentage
        const ageFactor = 10 - Math.abs(yourAge - partnerAge); // More age similarity increases love percentage
        const zodiacFactor = 10 - zodiacDifference; // More similar zodiac signs increase love percentage
        const temperamentFactor = 10 - calculateTemperamentDifference(yourTemperament, partnerTemperament); // More similar temperaments increase love percentage

        // Calculate love percentage based on multiple factors
        let lovePercentage = 100 - lengthDifference * 2 + ageFactor + zodiacFactor + temperamentFactor;

        // Ensure love percentage is within the valid range (0-100)
        lovePercentage = Math.min(100, Math.max(0, lovePercentage));

        return lovePercentage;
    }

    // Function to determine FLAMES result
    function determineFlames(yourName, partnerName, lovePercentage) {
        const flames = ['Friendship', 'Love', 'Affection', 'Marriage', 'Enemy', 'Sibling'];
        const emojis = ['🤝', '❤️', '😊', '💍', '👿', '👫'];  // Add corresponding emojis for each FLAMES result

        let combinedNames = yourName.toLowerCase() + partnerName.toLowerCase();

        // Remove common letters
        for (let i = 0; i < combinedNames.length; i++) {
            const currentLetter = combinedNames[i];
            if (yourName.includes(currentLetter) && partnerName.includes(currentLetter)) {
                combinedNames = combinedNames.replace(new RegExp(currentLetter, 'g'), '');
            }
        }

        // Calculate FLAMES result
        let count = combinedNames.length % flames.length;

        return `According to FLAMES, your relationship is: ${flames[count]} ${emojis[count]}.`;
    }

    // Function to perform compatibility check
    function checkCompatibility(yourAge, partnerAge, yourTemperament, partnerTemperament, yourZodiacSign, partnerZodiacSign) {
        // Customizable compatibility rules
        const ageDifferenceThreshold = 5;
        const ageDifferenceModerateThreshold = 10;
        const temperamentDifferenceThreshold = 1; // Customize the threshold as needed
        const zodiacDifferenceThreshold = 3; // Customize the threshold as needed

        // Age difference
        const ageDifference = Math.abs(yourAge - partnerAge);

        // Calculate temperament compatibility
        const temperamentDifference = calculateTemperamentDifference(yourTemperament, partnerTemperament);

        // Calculate zodiac sign compatibility using circular difference
        const yourSignIndex = signs.indexOf(yourZodiacSign);
        const partnerSignIndex = signs.indexOf(partnerZodiacSign);
        const zodiacDifference = calculateCircularDifference(yourSignIndex, partnerSignIndex);

        // Determine compatibility level and love percentage
        let lovePercentageExplanation = "";
        let compatibilityDescription = "";

        if (ageDifference <= ageDifferenceThreshold && temperamentDifference <= temperamentDifferenceThreshold && zodiacDifference <= zodiacDifferenceThreshold) {
            compatibilityDescription = "You have a strong connection and are highly compatible! This suggests a promising foundation for a great relationship.";
            lovePercentageExplanation = "Your love percentage is very high, indicating a deep emotional connection.";
        } else if (ageDifference <= ageDifferenceModerateThreshold && temperamentDifference <= temperamentDifferenceThreshold) {
            compatibilityDescription = "You show moderate compatibility. While there are commonalities, there may be some differences to navigate. Building understanding and communication is key.";
            lovePercentageExplanation = "Your love percentage is moderate, reflecting a decent level of emotional connection.";
        } else {
            compatibilityDescription = "Your compatibility seems low, and there are notable differences. It's important to openly discuss your expectations and work on understanding each other better.";

            // Additional factors for low compatibility
            if (ageDifference > ageDifferenceModerateThreshold) {
                compatibilityDescription += " The significant age difference might pose challenges in terms of shared experiences.";
            }

            if (temperamentDifference > temperamentDifferenceThreshold) {
                compatibilityDescription += " Differences in temperament may require extra effort to find common ground and balance.";
            }

            if (zodiacDifference > zodiacDifferenceThreshold) {
                compatibilityDescription += " Zodiac sign differences may contribute to varied approaches to life and relationships.";
            }

            lovePercentageExplanation = "Your love percentage is lower, suggesting the need for open communication and understanding to strengthen your emotional connection.";
        }

        // Return the overall result
        return `${compatibilityDescription}\n\n${lovePercentageExplanation}\n\n`;
    }

    // Function to display the overall result
    function displayResult(yourDetails, partnerDetails, compatibilityResult, flamesResult) {
        // Modify this based on your UI requirements
        console.log(`${yourDetails.name} (${yourDetails.age}, ${yourDetails.temperament}) and ${partnerDetails.name} (${partnerDetails.age}, ${partnerDetails.temperament})'s Compatibility is: ${compatibilityResult}. \n${flamesResult}`);
    }

    // Function to display result in modal
    function displayResultInModal(compatibilityResult, flamesResult) {
        // Get the modal and modal content elements
        const modal = document.getElementById("compatibilityModal");
        const modalContent = modal.querySelector(".modal-content");

        // Create HTML content for the modal
        const modalHTML = `
            <p>${compatibilityResult}</p>
            <p>${flamesResult}</p>
            <button class="close-modal-button" onclick="closeCompatibilityModal()">Close</button>
        `;

        // Update the modal content
        modalContent.innerHTML = modalHTML;

        // Display the modal
        modal.style.display = "flex";
    }

    // Close the compatibility modal
    window.closeCompatibilityModal = function () {
        const modal = document.getElementById("compatibilityModal");
        modal.style.display = "none";
    };

    // Attach the click event to the button
    const discoverButton = document.querySelector("#discover-compatibility-button");
    if (discoverButton) {
        discoverButton.addEventListener("click", discoverCompatibility);
    }
});
