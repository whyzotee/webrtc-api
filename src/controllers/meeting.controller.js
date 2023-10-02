const meetingServices = require("../services/meeting.service");

const startMeeting = (req, respone, next) => {
    const { hostId, hostName } = req.body;

    var model = {
        hostId: hostId,
        hostName: hostName,
        startTime: Date.now()
    };

    meetingServices.startMeeting(model, (err, res) => {
        return err ? next(err) : respone.status(200).send({ message: "Success", data: res.id });
    })
}

const checkMeetingExisits = (req, respone, next) => {
    const { meetingId } = req.query;

    meetingServices.checkMeetingExisits(meetingId, (err, res) => {
        return err ? next(err) : respone.status(200).send({ message: "Success", data: res });
    });
}

const getAllMeetingUsers = (req, respone, next) => {
    const { meetingId } = req.query;

    meetingServices.getAllMeetingUsers(meetingId, (err, res) => {
        return err ? next(err) : respone.status(200).send({ message: "Success", data: res });
    });
}

module.exports = {
    startMeeting,
    checkMeetingExisits,
    getAllMeetingUsers
}