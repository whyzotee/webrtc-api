const meetingServices = require("../services/meeting.service");

exports.startMeeting = (req, res, next) => {
    const { hostId, hostName } = req.body;

    var model = {
        hostId: hostId,
        hostName: hostName,
        startTime: Date.now()
    };

    meetingServices.startMeeting(model, (err, results) => {
        return err ? next(err) : res.status(200).send({ message: "Success", data: results.id });
    })
}

exports.checkMeetingExisits = (req, res, next) => {
    const { meetingId } = req.query;

    meetingServices.checkMeetingExisits(meetingId, (err, results) => {
        return err ? next(err) : res.status(200).send({ message: "Success", data: results });
    });
}

exports.getAllMeetingUsers = (req, res, next) => {
    const { meetingId } = req.query;

    meetingServices.getAllMeetingUsers(meetingId, (err, results) => {
        return err ? next(err) : res.status(200).send({ message: "Success", data: results });
    });
}
