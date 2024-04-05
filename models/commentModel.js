const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    },
},
{
    timestamps: true,
}
)

const commentModel = mongoose.model('comment', commentSchema)

module.exports = commentModel