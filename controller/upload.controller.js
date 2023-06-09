exports.fileUpload = async (req, res) => {
  try {
  res.status(200).json(req.file)
    
  } catch (error) {
    console.log(error)
  }
}