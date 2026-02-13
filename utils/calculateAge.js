export const calculateAge = (dobDate) => {
  if (!dobDate) {
    return "";
  }

  const currentYear = new Date().getFullYear();
  const dobDateObj = new Date(dobDate);
  console.log("currentYear = ", typeof currentYear);
  console.log("dobDate = ", typeof dobDate);

  const dobYear = dobDateObj.getFullYear();

  let age = currentYear - dobYear;

  const currentMonthDay = new Date().getMonth() * 100 + new Date().getDate();
  const dobMonthDay = dobDateObj.getMonth() * 100 + dobDateObj.getDate();

  if (currentMonthDay < dobMonthDay) {
    age--;
  }

  return age.toString();
};
