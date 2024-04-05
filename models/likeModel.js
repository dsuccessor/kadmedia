const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
},
{
    timestamps: true,
}
)

const likeModel = mongoose.model('like', likeSchema)

module.exports = likeModel