const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/test', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })

const followerSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    follow: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
},
{
    timestamps: true,
}
)

const followerModel = mongoose.model('follower', followerSchema)

module.exports = followerModel