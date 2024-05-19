export const passwordGenerator = async (length = 4, includeUppercase = true, includeLowercase = true, includeNumbers = true, includeSymbols = true) => {
    try {
        if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
            throw new Error("At least one character type must be selected");
        }

        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+[]{}|;:',.<>?/`~";

        let characterPool = "";
        if (includeUppercase) {
            characterPool += uppercase;
        }
        if (includeLowercase) {
            characterPool += lowercase;
        }
        if (includeNumbers) {
            characterPool += numbers;
        }
        if (includeSymbols) {
            characterPool += symbols;
        }

        if (characterPool.length === 0) {
            throw new Error("No characters available to generate password");
        }

        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterPool.length);
            password += characterPool[randomIndex];
        }

        return password;
    } catch (error) {
        console.error("Error generating password:", error.message);
        throw error; // Re-throw the error after logging it
    }
};


