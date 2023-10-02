const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const meeting = mongoose.model("Meeting", Schema({
    hostId: {
        type: String,
        required: true
    },
    hostName: {
        type: String,
        required: false
    },
    startTime: {
        type: Date,
        required: true
    },
    meetingUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: "MeetingUser"
        }
    ]
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString()
            delete ret._id;
            delete ret._v
        }
    }
    ,
    timestamps: true
})
);

module.exports = meeting;
