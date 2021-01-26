exports.filteredObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).filter((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key]
  })

  return newObj
}
