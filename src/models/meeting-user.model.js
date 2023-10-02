const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const meetingUser = mongoose.model("MeetingUser", Schema({
    socketId: {
        type: String
    },
    meetingId: {
        type: Schema.Types.ObjectId,
        ref: "Meeting"
    },
    userId: {
        type: String,
        required: true
    },
    joined: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isAlive: {
        type: String,
        required: true
    },

}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString()
            delete ret._id;
            delete ret._v
        }
    },
    timestamps: true
})
);

module.exports = {
    meetingUser
};
