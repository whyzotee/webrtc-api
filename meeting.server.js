const meetingHelper = require("./src/utils/meeting-helper");
const { MeetingPayloadEnum } = require("./src/utils/meeting-payload.enum");

const parseMessage = (msg) => {
    try {
        return JSON.parse(msg);
    } catch (err) {
        return { type: MeetingPayloadEnum.UNKNOWN };
    }
}

const listenMessage = (meetingId, socket, meetingServer) => {
    socket.on("message", (msg) => handleMessage(meetingId, socket, msg, meetingServer));
}

const handleMessage = (meetingId, socket, message, meetingServer) => {
    var payload = typeof message === "string" ? parseMessage(message) : message;

    switch (payload.type) {
        case MeetingPayloadEnum.JOIN_MEETING:
            meetingHelper.joinMeeting(meetingId, socket, meetingServer, payload);
            break;
        case MeetingPayloadEnum.CONNECTION_REQUEST:
            meetingHelper.forwardConnectionRequest(meetingId, socket, meetingServer, payload);
            break;
        case MeetingPayloadEnum.OFFER_SDP:
            meetingHelper.forwardOfferSDP(meetingId, socket, meetingServer, payload);
            break;
        case MeetingPayloadEnum.ICECANDIDATE:
            meetingHelper.forwardIceCandidate(meetingId, socket, meetingServer, payload);
            break;
        case MeetingPayloadEnum.ANSWER_SDP:
            meetingHelper.forwardAnswerSDP(meetingId, socket, meetingServer, payload);
            break;
        case MeetingPayloadEnum.LEAVE_MEETING:
            meetingHelper.userLeft(meetingId, socket, meetingServer, payload);
            break;
        case MeetingPayloadEnum.END_MEETING:
            meetingHelper.endMeeting(meetingId, socket, meetingServer, payload);
            break;
        case MeetingPayloadEnum.VIDEO_TOGGLE:
        case MeetingPayloadEnum.AUDIO_TOGGLE:
            meetingHelper.forwardEvent(meetingId, socket, meetingServer, payload);
            break;
        case MeetingPayloadEnum.UNKNOWN:
            break;
        default:
            break;
    }
};

const initMeetingServer = (server) => {
    const meetingServer = require("socket.io")(server);

    meetingServer.on("connection", (socket) => {
        console.log(`[server] meetingServer.on connection`);

        const meetingId = socket.handshake.query.id;

        listenMessage(meetingId, socket, meetingServer);
    });
}

module.exports = {
    initMeetingServer
};