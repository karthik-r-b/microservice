const formatData = (data) => {
  if (data) {
    return { success: true, data: data };
  } else {
    throw new Error("Data not found");
  }
};
export { formatData };
