export const calculateBMI = (heightCm, weightKg, gender) => {
  if (
    typeof heightCm !== "number" ||
    heightCm <= 0 ||
    typeof weightKg !== "number" ||
    weightKg <= 0 ||
    (gender && typeof gender !== "string") 
  ) {
    console.error(
      "Invalid height, weight, or gender provided for BMI calculation."
    );
    return null;
  }

  const heightMeters = heightCm / 100; 
  let bmi = weightKg / (heightMeters * heightMeters);

  if (gender) {
    const lowerCaseGender = gender.toLowerCase();
    if (lowerCaseGender === "male") {
      bmi *= 0.98; 
    } else if (lowerCaseGender === "female") {
      bmi *= 1.02; 
    }
  }

  return parseFloat(bmi.toFixed(2)); 
};
