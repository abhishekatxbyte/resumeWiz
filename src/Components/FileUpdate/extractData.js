export function extractData(inputString) {
    // function removeSpaces(dataForExtraction) {
    //     return dataForExtraction.replace(/\s+/g, '');
    // }
    // const inputString = removeSpaces(dataForExtraction)
    console.log(inputString)
    const data = {
        Profile: {},
        Education: [],
        Experience: [],
        Skills: [],
        Projects: [],
        Interests: [],
    };

    try {

        data.Profile =
        {
            Name: extractPersonName(inputString),
            Email: extractPersonEmail(inputString),
            Phone: extractPersonPhone(inputString)
        }
        data.Experience = extractPersonExperience(inputString)
        data.Education = extractPersonEducation(inputString)
        data.Skills = extractPersonSkills(inputString)
        data.Projects = extractPersonProjects(inputString)
        data.Interests = extractPersonInterests(inputString)

    } catch (error) {
        console.error('Error extracting data:', error);
    }
    // console.log(inputString)
    // console.log(data.Email)
    // console.log(data.Phone)
    return data;
}
function removeExtraSpaces(inputString) {
    // Use regular expression to remove extra spaces between characters
    return inputString.replace(/\s+/g, ' ').trim();
}

function extractPersonName(inputString) {
    // If not found with the above pattern, try the previous nameRegexes
    const nameRegexes = [
        /([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+)/g,                     // Full Name (First and Last Name)
        /([A-Z][a-zA-Z]+)/g,                                     // First Name Only
        /([A-Z][a-zA-Z]+\s+[A-Z]\.)/g,                             // First Name and Last Initial (e.g., John D.)
        /([A-Z]\.\s+[A-Z][a-zA-Z]+)/g,                             // First Initial and Last Name (e.g., J. Doe)
        /((?:Name|NAME)\s*:\s*)?([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+)/g, // Name: John Doe (with optional "Name" or "NAME")
        /([A-Z][a-z]+\s+[A-Z][a-z]+)/g,                             // First Name Last Name (lowercase letters)
        /([A-Z][a-z]+)/g,                                         // First Name Only (lowercase letters)
        /([A-Z][a-z]+\s+[A-Z]\.)/g,                              // First Name and Last Initial with multiple spaces (e.g., John  D.)
        /([A-Z]\.\s+[A-Z][a-z]+)/g,                              // First Initial and Last Name with multiple spaces (e.g., J.  Doe)
        /([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+)/g,                     // First Name Last Name with multiple spaces
        /(?:Name|NAME)\s*:\s*([A-Z][a-zA-Z]+)/g
        // First Initial and Last Name (e.g., J. Doe)
    ];

    for (const regex of nameRegexes) {
        const match = inputString.match(regex);
        if (match) {
            return match[0].trim().replace(/\s+/g, ' ');
        }
    }
    for (const regex of nameRegexes) {
        const clean = removeExtraSpaces(inputString);
        const match = clean.match(regex);
        if (match) {
            console.log(inputString)

            return match[0].trim().replace(/\s+/g, ' ');
        }
    }
    return "Name not found";
}



function extractPersonEmail(inputString) {
    // Extract email address using a regex for common email patterns
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/i
    const emailMatches = inputString.match(emailRegex);
    if (emailMatches) {
        return emailMatches[0];
    }
    // If no email is found, you can return a default value or handle it as needed.
    return "Email not found";
}

function extractPersonPhone(inputString) {
    // Extract phone number using a regex for common phone number patterns
    const phoneRegex = /\b\d{10}\b|\b\d{3}[-.\s]*\d{2}[-.\s]*\d{2}[-.\s]*\d{2}\b|\b\d{3}[-.\s]*\d{2}[-.\s]*\d{3}[-.\s]*\d{2}\b|\+\d{2,3}[-.\s]*\d{5}[-.\s]*\d{5}\b|\+\d{1}[-.\s]*\d{10}\b/i;
    const phoneMatches = inputString.match(phoneRegex);
    if (phoneMatches) {
        return phoneMatches[0];
    }


    // Example usage:
    const clean = removeExtraSpaces(inputString);
    const phoneMatches2 = clean.match(phoneRegex);
    if (phoneMatches2) {
        return phoneMatches[0];
    }
    // If no phone number is found, you can return a default value or handle it as needed.
    return "Phone number not found";
}


function extractPersonEducation(inputString) {
    const educationSectionRegex = /EDUCATION([\s\S]*?)(?=ACADEMIC\s+PROJECTS|$)/i;
    const educationSectionMatches = inputString.match(educationSectionRegex);

    let educationEntries = [];

    if (educationSectionMatches) {
        const educationData = educationSectionMatches[1].trim();
        const educationLines = educationData.split('\n').map(line => line.trim());
        educationEntries = [...educationLines]
    }

    return educationEntries;
}


function extractPersonSkills(inputString) {
    const skillsSectionRegex = /SKILLS([\s\S]*?)(?=EXPERIENCE|$)/i;
    const skillsSectionMatches = inputString.match(skillsSectionRegex);

    const skillsArray = [];

    if (skillsSectionMatches) {
        const skillsData = skillsSectionMatches[1].trim();
        const skillLines = skillsData.split('\n');

        for (const line of skillLines) {
            // You can adjust the regex pattern to match the specific format of your skills
            // For example, here we assume skills are separated by commas
            const skills = line.split(',').map(skill => skill.trim());
            for (const skill of skills) {
                if (skill.length > 0) {
                    skillsArray.push(skill);
                }
            }
        }
    }
    return skillsArray;
}

function extractPersonExperience(inputString) {
    const experienceSectionRegex2 = /EXPERIENCE([\s\S]*?)(?=PROJECT|$)/i;
    const experienceSectionMatches2 = inputString.match(experienceSectionRegex2);
    const experienceSectionRegex = /PROFESSIONAL\s+EXPERIENCE([\s\S]*?)(?=Company\s+Name:|\n\n|$)/i;
    const experienceSectionMatches = inputString.match(experienceSectionRegex);

    if (experienceSectionMatches2) {
        const experienceData = experienceSectionMatches2[1].trim();
        return experienceData;
    }

    if (experienceSectionMatches) {
        const experienceData = experienceSectionMatches[1].trim();
        return experienceData;
    }

    return '';
}

function extractPersonProjects(inputString) {
    const projectsSectionRegex2 = /PROJECT([\s\S]*?)(?=INTERESTS|$)/i;
    const projectsSectionMatches2 = inputString.match(projectsSectionRegex2);

    if (projectsSectionMatches2) {
        const projectsData = projectsSectionMatches2[1].trim();
        return projectsData;
    }

    return '';
}

function extractPersonInterests(inputString) {
    const interestsSectionRegex2 = /INTERESTS([\s\S]*?)(?=$)/i;
    const interestsSectionMatches2 = inputString.match(interestsSectionRegex2);
    if (interestsSectionMatches2) {
        const interestsData = interestsSectionMatches2[1].trim();
        return interestsData.split('\n').map(interest => interest.trim());
    }
    return;
}