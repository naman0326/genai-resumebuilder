const multer = require('multer')

// Keep the file in memory; we only need its text, not the file on disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Resume must be a PDF file'))
    }
    cb(null, true)
  }
})

// Wraps multer so upload errors come back as a 400 instead of an HTML error page
function uploadResume(req, res, next) {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'Resume must be smaller than 5MB' : err.message
      return res.status(400).json({ message })
    }
    next()
  })
}

module.exports = uploadResume
