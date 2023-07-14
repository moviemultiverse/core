function jsondetect(original, updated) {
  var updatedFields = [];

  // Iterate over the updated array
  for (var i = 0; i < updated.length; i++) {
    var found = false;

    // Find the corresponding element in the original array
    for (var j = 0; j < original.length; j++) {
      if (original[j].id === updated[i].id) {
        found = true;
        // Compare the values of the properties in the original and updated elements
        if (JSON.stringify(original[j]) !== JSON.stringify(updated[i])) {
          // Store the updated element in the updatedFields array
          updatedFields.push(updated[i]);
        }
        break;
      }
    }

    // If the element doesn't exist in the original array, it is considered an updated field
    if (!found) {
      updatedFields.push(updated[i]);
    }
  }

  return updatedFields;
}
module.exports = jsondetect;

