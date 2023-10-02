const meetingServices = require("../services/meeting.service");
const { MeetingPayloadEnum } = require("./meeting-payload.enum");

const sendMessage = (socket, payload) => socket.send(JSON.stringify(payload));
const broadcastUsers = (meetingId, socket, meetingServer, payload) => socket.broadcast.emit("message", JSON.stringify(payload));

const addUser = (socket, { meetingId, userId, name }) => {
    let promise = new Promise((resolve, reject) => {
        meetingServices.getMeetingUser({ meetingId, userId }, (err, res) => {
            if (!res) {
                var model = {
                    socketId: socket.id,
                    meetingId: meetingId,
                    userId: userId,
                    joined: true,
                    name: name,
                    isAlive: true
                };

                meetingServices.joinMeeting(model, (err, res) => {
                    if (res) resolve(true);
                    if (err) reject(err);
                })
            } else {
                meetingServices.updateMeetingUser({
                    userId: userId,
                    socketId: socket.id
                }, (err, res) => {
                    if (res) resolve(true);
                    if (err) reject(err);
                })
            }
        });
    });

    return promise;
}

const joinMeeting = async (meetingId, socket, meetingServer, payload) => {
    const { userId, name } = payload.data;

    meetingServices.isMeetingPresent(meetingId, async (err, res) => {
        if (err && !res) sendMessage(socket, { type: MeetingPayloadEnum.NOT_FOUND });

        if (res) {
            addUser(socket, { meetingId, userId, name }).then((res) => {
                if (res) sendMessage(socket, {
                    type: MeetingPayloadEnum.JOINED_MEETING, data: { userId }
                });

                broadcastUsers(meetingId, socket, meetingServer, {
                    type: MeetingPayloadEnum.USER_JOINED,
                    data: { userId, name, ...payload.data }
                });
            }, (err) => console.log(err));
        }
    })
};

const forwardConnectionRequest = (meetingId, socket, meetingServer, payload) => {
    const { userId, otherUserId, name } = payload.data;

    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };

    meetingServices.getMeetingUser(model, (err, res) => {
        if (res) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.CONNECTION_REQUEST,
                data: { userId, name, ...payload.data }
            });

            meetingServer.to(res.socketId).emit("message", sendPayload);
        }
    });
}

const forwardIceCandidate = (meetingId, socket, meetingServer, payload) => {
    const { userId, otherUserId, candidate } = payload.data;

    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };

    meetingServices.getMeetingUser(model, (err, res) => {
        if (res) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ICECANDIDATE,
                data: { userId, candidate }
            });

            meetingServer.to(res.socketId).emit("message", sendPayload);
        }
    });
}

const forwardOfferSDP = (meetingId, socket, meetingServer, payload) => {
    const { userId, otherUserId, sdp } = payload.data;

    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };

    meetingServices.getMeetingUser(model, (err, res) => {
        if (res) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.OFFER_SDP,
                data: { userId, sdp }
            });

            meetingServer.to(res.socketId).emit("message", sendPayload);
        }
    });
}

const forwardAnswerSDP = (meetingId, socket, meetingServer, payload) => {
    const { userId, otherUserId, sdp } = payload.data;

    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };

    meetingServices.getMeetingUser(model, (err, res) => {
        if (res) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ANSWER_SDP,
                data: { userId, sdp }
            });

            meetingServer.to(res.socketId).emit("message", sendPayload);
        }
    });
}

const userLeft = (meetingId, socket, meetingServer, payload) => {
    const { userId } = payload.data;

    broadcastUsers(meetingId, socket, meetingServer, {
        type: MeetingPayloadEnum.USER_LEFT,
        data: { userId: userId }
    })
}

const endMeeting = (meetingId, socket, meetingServer, payload) => {
    const { userId } = payload.data;

    broadcastUsers(meetingId, socket, meetingServer, {
        type: MeetingPayloadEnum.MEETING_ENDED,
        data: { userId: userId }
    });

    meetingServices.getAllMeetingUsers(meetingId, (err, res) => {
        for (let index = 0; index < res.length; index++) {
            const meetingUser = res[index];
            meetingServer.socket.connected(meetingUser.socketId).disconnect();
        }
    });
}

const forwardEvent = (meetingId, socket, meetingServer, payload) => {
    const { userId } = payload.data;

    broadcastUsers(meetingId, socket, meetingServer, {
        type: payload.type,
        data: { userId: userId, ...payload.data }
    });
}

module.exports = {
    joinMeeting,
    forwardConnectionRequest,
    forwardIceCandidate,
    forwardOfferSDP,
    forwardAnswerSDP,
    userLeft,
    endMeeting,
    forwardEvent
}