import { Message } from "../models/user.modal"

export interface ApiResponse {
    success: boolean
    message: string
    isAccesptingMessage?: boolean
    messages?: Array<Message>
}

