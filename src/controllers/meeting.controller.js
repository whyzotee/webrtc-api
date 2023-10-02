const meetingServices = require("../services/meeting.service");

const startMeeting = (req, res, next) => {
    const { hostId, hostName } = req.body;

    var model = {
        hostId: hostId,
        hostName: hostName,
        startTime: Date.now()
    };

    meetingServices.startMeeting(model, (err, res) => {
        return err ? next(err) : res.status(200).send({ message: "Success", date: res.id });
    })
}

const checkMeetingExisits = (req, res, next) => {
    const { meetingId } = req.query;

    meetingServices.checkMeetingExisits(meetingId, (err, res) => {
        return err ? next(err) : res.status(200).send({ message: "Success", date: res });
    });
}

const getAllMeetingUsers = (req, res, next) => {
    const { meetingId } = req.query;

    meetingServices.getAllMeetingUsers(meetingId, (err, res) => {
        return err ? next(err) : res.status(200).send({ message: "Success", date: res });
    });
}

module.exports = {
    startMeeting,
    checkMeetingExisits,
    getAllMeetingUsers
}