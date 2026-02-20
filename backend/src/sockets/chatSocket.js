const ChatMessage = require('../models/ChatMessage.model');
const pythonService = require('../services/pythonService');
const BRD = require('../models/BRD.model');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    socket.on('join-project', (projectId) => {
      socket.join(projectId);
      console.log(`Socket ${socket.id} joined project ${projectId}`);
    });

    socket.on('leave-project', (projectId) => {
      socket.leave(projectId);
      console.log(`Socket ${socket.id} left project ${projectId}`);
    });

    socket.on('chat-message', async (data) => {
      try {
        const { projectId, message } = data;

        // Save user message
        await ChatMessage.create({
          projectId,
          role: 'user',
          content: message
        });

        // Get AI response from Python service
        const aiResponse = await pythonService.chatWithAI({
          project_id: projectId,
          message: message
        });

        // Save AI response
        await ChatMessage.create({
          projectId,
          role: 'assistant',
          content: aiResponse.message,
          suggestions: aiResponse.suggestions
        });

        // Update BRD if needed
        if (aiResponse.brd_update) {
          await BRD.findOneAndUpdate(
            { projectId },
            { 
              content: aiResponse.brd_update,
              updatedAt: Date.now()
            },
            { upsert: true }
          );
        }

        // Send response back
        socket.emit('ai-response', {
          message: aiResponse.message,
          suggestions: aiResponse.suggestions,
          brdUpdate: aiResponse.brd_update
        });

      } catch (error) {
        console.error('Chat error:', error);
        socket.emit('error', { message: 'Failed to process message' });
      }
    });

    socket.on('accept-suggestion', async (data) => {
      try {
        const { projectId, suggestion } = data;

        const result = await pythonService.chatWithAI({
          project_id: projectId,
          message: `Apply this suggestion: ${JSON.stringify(suggestion)}`
        });

        if (result.brd_update) {
          const brd = await BRD.findOneAndUpdate(
            { projectId },
            { 
              content: result.brd_update,
              updatedAt: Date.now()
            },
            { new: true, upsert: true }
          );

          socket.emit('brd-updated', {
            brd,
            changes: 'Suggestion applied'
          });
        }

      } catch (error) {
        console.error('Suggestion error:', error);
        socket.emit('error', { message: 'Failed to apply suggestion' });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });
};