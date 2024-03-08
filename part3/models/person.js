const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const phoneNumberRegex = /^\d{2,3}-\d{7,}/

  const numberValidators = [
    {
      validator: function (value) {
        console.log('Testing phone number:', value);
        const result = phoneNumberRegex.test(value);
        console.log('Result:', result);
        return result;
    },
    message: 'Invalid phone number format. Use format like "09-1234567" or "040-1234567".',
    }
  ]

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true,
    },
    number: {
      type: String,
      minlength: 8,
      required: true,
      validate: numberValidators,
    }
  })

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)