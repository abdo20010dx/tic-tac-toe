export interface RtcRequest {
    sender?: string
    receiver?: string
    offer: RTCSessionDescriptionInit
    answer: RTCSessionDescriptionInit
    candidate?: RTCIceCandidate
}
