const meeting = require("../models/meeting.model");
const meetingUser = require("../models/meeting-user.model");

const getAllMeetingUsers = async (meetId, callback) => {
    meetingUser.find({ meetingId: meetId }).then((res) => { return callback(null, res) }).catch((err) => { return callback(err) })
}

const startMeeting = async (params, callback) => {
    const meetingSchema = new meeting(params);

    meetingSchema.save().then((res) => {
        return callback(null, res)
    }).catch((err) => {
        return callback(err)
    })
}

const joinMeeting = async (parmas, callback) => {
    const meetingUserModel = new meetingUser(parmas);

    meetingUserModel.save().then(async (res) => {
        await meeting.findOneAndUpdate({ id: parmas.meetingId }, { $addToSet: { "meetingUsers": meetingUserModel } });
        return callback(null, res);
    }).catch((err) => {
        return callback(err);
    });
}

const isMeetingPresent = async (meetingId, callback) => {
    meeting.findById(meetingId).populate("meetingUsers", "meetingUser").then((res) => {
        !res ? callback("Invalid Meeting Id") : callback(null, true);
    }).catch((err) => {
        return callback(err, false);
    });
}

const checkMeetingExisits = async (meetingId, callback) => {
    meeting.findById(meetingId).populate(meetingId, "hostId, hostName, startTime").then((res) => {
        !res ? callback("Invalid Meeting Id") : callback(null, res);
    }).catch((err) => {
        return callback(err, false);
    });
}

const getMeetingUser = (params, callback) => {
    const { meetingId, userId } = params;

    meetingUser.find({ meetingId, userId }).then((res) => {
        return callback(null, res[0]);
    }).catch((err) => {
        return callback(err);
    });
}

const updateMeetingUser = (params, callback) => {
    meetingUser.updateOne({ userId: params.userId }, { $set: params }, { new: true }).then((res) => {
        return callback(null, res);
    }).catch((err) => {
        return callback(err);
    });
}

const getUserBySocketId = (params, callback) => {
    const { meetingId, socketId } = params;

    meetingUser.find({ meetingId, socketId }).limit(1).then((res) => {
        return callback(null, res);
    }).catch((err) => {
        return callback(err);
    });
}

module.exports = {
    startMeeting,
    joinMeeting,
    getAllMeetingUsers,
    isMeetingPresent,
    checkMeetingExisits,
    getUserBySocketId,
    updateMeetingUser,
    getMeetingUser
}