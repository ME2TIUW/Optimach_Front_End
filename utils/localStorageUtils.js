//set new existing localStorage Item (nested object)

export const getParsedItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing item '${key}' from localStorage:`, error);
    return null;
  }
};

const setStringifiedItem = (key, value) => {
  try {
    const stringValue =
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
        ? value.toString() 
        : JSON.stringify(value); 

    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(
      `Error stringifying or setting item '${key}' in localStorage:`,
      error
    );
  }
};

// const deleteNestedObjectProperty = (objectKey, propertyName) => {
//   let existingObject = getParsedItem(objectKey);

//   if (
//     existingObject &&
//     typeof existingObject === "object" &&
//     !Array.isArray(existingObject)
//   ) {
//     if (Object.prototype.hasOwnProperty.call(existingObject, propertyName)) {
//       delete existingObject[propertyName];
//       setStringifiedItem(objectKey, existingObject);
//       console.log(
//         `Property '${propertyName}' deleted from '${objectKey}' in localStorage.`
//       );
//     } else {
//       console.warn(
//         `Property '${propertyName}' not found in '${objectKey}' for deletion.`
//       );
//     }
//   } else {
//     console.warn(
//       `Object '${objectKey}' not found or is not a plain object in localStorage. Cannot delete property.`
//     );
//   }
// };

export default function updateNestedObjectProperty(
  objectKey,
  propertyName,
  newValue
) {
  let existingObject = getParsedItem(objectKey);

  if (
    !existingObject ||
    typeof existingObject !== "object" ||
    Array.isArray(existingObject)
  ) {
    console.warn(
      `Object '${objectKey}' not found or is not a plain object in localStorage. Initializing as empty object.`
    );
    existingObject = {};
  }

  existingObject[propertyName] = newValue;
  setStringifiedItem(objectKey, existingObject);
}
