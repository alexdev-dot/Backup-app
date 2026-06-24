import * as messageModel from '../models/messageModel.js';
import { asyncHandler, sendSuccess, sendCreated } from '../utils/helpers.js';
import { HTTP } from '../config/constants.js';

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await messageModel.findConversationsByUser(req.user.userId);
  sendSuccess(res, { conversations });
});

export const getMessages = asyncHandler(async (req, res) => {
  const conversationId = Number(req.params.id);
  const belongs = await messageModel.userBelongsToConversation(conversationId, req.user.userId);
  if (!belongs) {
    return res.status(HTTP.FORBIDDEN).json({ success: false, error: 'Access denied to this conversation' });
  }
  const messages = await messageModel.getMessages(conversationId);
  sendSuccess(res, { messages });
});

export const send = asyncHandler(async (req, res) => {
  const { conversation_id, receiver_id, text } = req.body;

  const belongs = await messageModel.userBelongsToConversation(conversation_id, req.user.userId);
  if (!belongs) {
    return res.status(HTTP.FORBIDDEN).json({ success: false, error: 'Access denied to this conversation' });
  }

  const conv = await messageModel.findConversationById(conversation_id);
  const message = await messageModel.sendMessage({
    conversation_id,
    sender_id:   req.user.userId,
    receiver_id,
    text,
  });

  const isCustomerSender = conv.customer_id === req.user.userId;
  await messageModel.incrementUnread(conversation_id, isCustomerSender);

  sendCreated(res, { message });
});

export const markRead = asyncHandler(async (req, res) => {
  const conversationId = Number(req.params.id);
  const belongs = await messageModel.userBelongsToConversation(conversationId, req.user.userId);
  if (!belongs) {
    return res.status(HTTP.FORBIDDEN).json({ success: false, error: 'Access denied' });
  }
  await messageModel.markAsRead(conversationId, req.user.userId);
  sendSuccess(res, { message: 'Marked as read' });
});

export const startConversation = asyncHandler(async (req, res) => {
  const { professional_id, service } = req.body;

  // Verify the professional_id is actually a professional user
  const { findByEmail } = await import('../models/userModel.js');
  const { findByUserId } = await import('../models/professionalModel.js');
  
  const professional = await findByUserId(professional_id);
  if (!professional) {
    return res.status(HTTP.BAD_REQUEST).json({ success: false, error: 'Professional not found' });
  }

  const conversation = await messageModel.findOrCreateConversation(
    req.user.userId,
    professional_id,
    service
  );
  sendCreated(res, { conversation });
});
